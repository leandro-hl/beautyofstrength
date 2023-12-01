package main

import (
	"context"
	"crypto/rand"
	"encoding/base64"
	"encoding/json"
	"errors"
	"fmt"
	"github.com/golang-jwt/jwt/v5"
	"github.com/gorilla/mux"
	"github.com/jmoiron/sqlx"
	"github.com/leandro-hl/beautyofstrength/back/db"
	"github.com/leandro-hl/beautyofstrength/back/util"
	"github.com/leandro-hl/beautyofstrength/back/webpush"
	"io"
	"log"
	"math/big"
	"mime/multipart"
	"net/http"
	"os"
	"path/filepath"
	"regexp"
	"sort"
	"strconv"
	"strings"
	"sync"
	"time"
)

const (
	MyPlanificationReservedName             = "Mi Planificacion"
	SharedRoutinesPlanificationReservedName = "Rutinas Compartidas"
)

type Endpoints struct {
	db         *sqlx.DB
	conf       *Config
	cryptoConf *CryptoConfig
	r          *mux.Router
	l          *log.Logger
}

type ListExercisesQueryCache struct {
	invalidated bool
	lastUpdated time.Time
	exercises   []db.ListExerciseQuery
	a           sync.RWMutex
}

func (o *ListExercisesQueryCache) Invalidate() {
	o.a.Lock()
	o.invalidated = true
	defer o.a.Unlock()
}

func (o *ListExercisesQueryCache) IsValid() bool {
	o.a.RLock()
	defer o.a.RUnlock()
	return !o.invalidated
}

func (o *ListExercisesQueryCache) LastUpdated() time.Time {
	o.a.RLock()
	defer o.a.RUnlock()
	return o.lastUpdated
}

func (o *ListExercisesQueryCache) Fetch() []db.ListExerciseQuery {
	o.a.RLock()
	defer o.a.RUnlock()
	return o.exercises
}

func (o *ListExercisesQueryCache) Populate(new []db.ListExerciseQuery) {
	o.a.Lock()
	defer o.a.Unlock()
	o.exercises = new
	o.invalidated = false
	o.lastUpdated = time.Now()
}

func NewListExercisesQueryCache() *ListExercisesQueryCache {
	return &ListExercisesQueryCache{
		invalidated: true,
		exercises:   nil,
		a:           sync.RWMutex{},
	}
}

type ExercisesComparerCache struct {
	s  map[string]string
	s2 map[int]bool
	a  sync.Mutex
}

func (o *ExercisesComparerCache) Add(id int, name string) {
	o.a.Lock()
	defer o.a.Unlock()
	key := strings.ToLower(strings.TrimSpace(strings.ReplaceAll(name, " ", "")))
	o.s[key] = name
	o.s2[id] = true
}

func (o *ExercisesComparerCache) FilterExercisesByIds(exs []ExerciseRequest) (yes []ExerciseRequest, no []ExerciseRequest, order []bool) {
	o.a.Lock()
	defer o.a.Unlock()
	yes = make([]ExerciseRequest, 0)
	no = make([]ExerciseRequest, 0)
	order = make([]bool, 0)
	for _, k := range exs {
		if _, ok := o.s2[*k.Id]; ok {
			yes = append(yes, k)
			order = append(order, true)
		} else {
			no = append(no, k)
			order = append(order, false)
		}
	}

	return
}

func (o *ExercisesComparerCache) FilterNamesByIds(keys []int, names []string) (yes []int, no []string) {
	o.a.Lock()
	defer o.a.Unlock()
	yes = make([]int, 0)
	no = make([]string, 0)
	for i, k := range keys {
		if _, ok := o.s2[k]; ok {
			yes = append(yes, k)
		} else {
			no = append(no, names[i])
		}
	}

	return
}

type ExerciseComparer struct {
	SanitizedKey  *string
	SanitizedName *string
	ShouldCreate  *bool
	ExerciseRequest
}

func (o *ExercisesComparerCache) Exist(exercises []ExerciseComparer) (yes, no []ExerciseComparer) {
	o.a.Lock()
	defer o.a.Unlock()
	yes = make([]ExerciseComparer, 0)
	no = make([]ExerciseComparer, 0)
	for _, k := range exercises {
		if _, ok := o.s[*k.SanitizedKey]; ok {
			yes = append(yes, k)
		} else {
			no = append(no, k)
		}
	}

	return
}

func NewExercisesComparerCache() *ExercisesComparerCache {
	return &ExercisesComparerCache{
		s:  make(map[string]string),
		s2: make(map[int]bool),
		a:  sync.Mutex{},
	}
}

// todo: this will be Redis to avoid losing sessions every time the binary is restarted
type SessionManager struct {
	s map[string]int64
	a sync.Mutex
}

func (o *SessionManager) Read(token string) (int64, error) {
	o.a.Lock()
	defer o.a.Unlock()
	id, ok := o.s[token]
	if !ok {
		return -1, errors.New("invalid session token")
	}
	return id, nil
}

func (o *SessionManager) Write(token string, id int64) {
	o.a.Lock()
	defer o.a.Unlock()
	o.s[token] = id
}

func (o *SessionManager) Revoke(token string) {
	o.a.Lock()
	defer o.a.Unlock()
	delete(o.s, token)
}

func NewSessionManager() *SessionManager {
	return &SessionManager{
		s: make(map[string]int64),
		a: sync.Mutex{},
	}
}

type ShareTokenManager struct {
	s map[string]bool
	a sync.Mutex
}

func (o *ShareTokenManager) Read(token string) bool {
	o.a.Lock()
	defer o.a.Unlock()
	id, ok := o.s[token]
	if !ok {
		panic(errors.New("invalid token"))
	}
	return id
}

func (o *ShareTokenManager) Write(token string) {
	o.a.Lock()
	defer o.a.Unlock()
	o.s[token] = true
}

func NewShareTokenManager() *ShareTokenManager {
	return &ShareTokenManager{
		s: make(map[string]bool),
		a: sync.Mutex{},
	}
}

var sessionStore = NewSessionManager()
var exercisesComparerCache = NewExercisesComparerCache()
var listExercisesQueryCache = NewListExercisesQueryCache()
var shareManager = NewShareTokenManager()
var developmentLastCreatedSessionTokenStack = make([]string, 0)

func NewEndpoints(conf *Config, cryptoConf *CryptoConfig, l *log.Logger, dbs *sqlx.DB) *Endpoints {
	exercisesNames := db.ListExerciseNames(dbs)
	for _, e := range exercisesNames {
		exercisesComparerCache.Add(*e.Id, *e.Name)
	}

	sessions := db.ListActiveUserAccountSessions(dbs)
	for _, s := range sessions {
		sessionStore.Write(*s.Token, *s.UserAccountId)
	}

	return &Endpoints{
		db:         dbs,
		conf:       conf,
		cryptoConf: cryptoConf,
		r:          mux.NewRouter(),
		l:          l,
	}
}

func (o *Endpoints) Handle() http.Handler {
	api := o.r.PathPrefix("/api").Subrouter()
	//todo: para speech de venta: routines up to 20 exercises per block! (how many blocks?) LOL. Buy more exercises by $$$$
	//o.r.Path("/signUp").HandlerFunc(o.HandleIPWhiteListing(o.HandleFatal(o.HandleTransactional(o.signUp))))
	//o.r.Path("/signIn").HandlerFunc(o.HandleIPWhiteListing(o.HandleFatal(o.HandleTransactional(o.signIn))))
	//o.r.Path("/testPushNotificationWorks").HandlerFunc(o.HandleAuthenticatedTransactional(o.HandleAuthorization(o.testPushNotificationWorks, db.Professor)))

	if o.conf.IsDevelopment() {
		api.Path("/getLocalInfo").HandlerFunc(o.HandleOptionsRequest(o.HandleIPWhiteListing(o.HandleFatal(o.getLocalInfo))))
		api.Path("/createTestUser").HandlerFunc(o.HandleOptionsRequest(o.HandleIPWhiteListing(o.HandleFatal(o.HandleTransactional(o.createTestUser)))))
	}
	api.Path("/googlesignin").HandlerFunc(o.HandleOptionsRequest(o.HandleIPWhiteListing(o.HandleFatal(o.HandleTransactional(o.googleSignIn)))))

	//Instructor services (all premium)
	api.Path("/sharePlanification").HandlerFunc(o.HandleAuthenticatedTransactional(o.HandleAuthorization(o.sharePlanification, db.Professor)))
	api.Path("/createPlanification").HandlerFunc(o.HandleAuthenticatedTransactional(o.HandleAuthorization(o.createPlanification, db.Professor)))
	api.Path("/savePlanificationDays").HandlerFunc(o.HandleAuthenticatedTransactional(o.HandleAuthorization(o.savePlanificationDays, db.Professor)))
	api.Path("/listQueuedPlanificationAccessRequests").HandlerFunc(o.HandleAuthenticatedTransactional(o.HandleAuthorization(o.listQueuedPlanificationAccessRequests, db.Professor)))
	api.Path("/acceptPlanificationAccessRequest").HandlerFunc(o.HandleAuthenticatedTransactional(o.HandleAuthorization(o.acceptPlanificationAccessRequest, db.Professor)))
	api.Path("/declinePlanificationAccessRequest").HandlerFunc(o.HandleAuthenticatedTransactional(o.HandleAuthorization(o.declinePlanificationAccessRequest, db.Professor)))

	//Premium services
	api.Path("/savePlanificationEditions").HandlerFunc(o.HandleAuthenticatedTransactional(o.HandleAuthorization(o.savePlanificationEditions, db.StudentPremium, db.Professor)))
	api.Path("/saveRoutineEditions").HandlerFunc(o.HandleAuthenticatedTransactional(o.HandleAuthorization(o.saveRoutineEditions, db.StudentPremium, db.Professor)))
	api.Path("/saveNewRm").HandlerFunc(o.HandleAuthenticatedTransactional(o.HandleAuthorization(o.saveNewRm, db.StudentPremium)))

	api.Path("/listUserRms").HandlerFunc(o.HandleAuthenticatedTransactional(o.HandleAuthorization(o.listUserRms, db.StudentFree, db.StudentPremium)))
	api.Path("/listLastUserRmHistoryStats").HandlerFunc(o.HandleAuthenticatedTransactional(o.HandleAuthorization(o.listLastUserRmHistoryStats, db.StudentFree, db.StudentPremium)))

	//Student services
	api.Path("/saveUserTrainedToday").HandlerFunc(o.HandleAuthenticatedTransactional(o.HandleAuthorization(o.saveUserTrainedToday, db.StudentFree, db.StudentPremium)))
	api.Path("/getUserLoadedTrainingToday").HandlerFunc(o.HandleAuthenticatedTransactional(o.HandleAuthorization(o.getUserLoadedTrainingToday, db.StudentFree, db.StudentPremium)))

	//General Services
	//o.r.Path("/serveImage").HandlerFunc(o.HandleAuthenticatedTransactional(o.serveImage))
	//redirect directly to the api. check the domain is mercado pago. implement some shit like google auth sec
	api.Path("/teacherSubscriptionApproved").HandlerFunc(o.HandleAuthenticatedTransactional(o.HandleAuthorization(o.teacherSubscriptionApproved, db.StudentFree, db.StudentPremium, db.Professor)))
	api.Path("/eliteSubscriptionApproved").HandlerFunc(o.HandleAuthenticatedTransactional(o.HandleAuthorization(o.eliteSubscriptionApproved, db.StudentFree, db.StudentPremium, db.Professor)))
	api.Path("/saveExercisesBlockFree").HandlerFunc(o.HandleAuthenticatedTransactional(o.HandleAuthorization(o.saveExercisesBlockFree, db.StudentFree, db.StudentPremium, db.Professor)))
	api.Path("/saveExercisesBlockCpt").HandlerFunc(o.HandleAuthenticatedTransactional(o.HandleAuthorization(o.saveExercisesBlockCpt, db.StudentFree, db.StudentPremium, db.Professor)))
	api.Path("/saveExercisesBlockAmrap").HandlerFunc(o.HandleAuthenticatedTransactional(o.HandleAuthorization(o.saveExercisesBlockAmrap, db.StudentFree, db.StudentPremium, db.Professor)))
	api.Path("/saveExercisesBlockCombo").HandlerFunc(o.HandleAuthenticatedTransactional(o.HandleAuthorization(o.saveExercisesBlockCombo, db.StudentFree, db.StudentPremium, db.Professor)))
	api.Path("/saveExerciseBlockPir").HandlerFunc(o.HandleAuthenticatedTransactional(o.HandleAuthorization(o.saveExerciseBlockPir, db.StudentFree, db.StudentPremium, db.Professor)))
	api.Path("/listPlanifications").HandlerFunc(o.HandleAuthenticatedTransactional(o.HandleAuthorization(o.listPlanifications, db.StudentFree, db.StudentPremium, db.Professor)))
	api.Path("/listRoutines").HandlerFunc(o.HandleAuthenticatedTransactional(o.HandleAuthorization(o.listRoutines, db.StudentFree, db.StudentPremium, db.Professor)))
	api.Path("/listExercises").HandlerFunc(o.HandleAuthenticatedTransactional(o.HandleAuthorization(o.listExercises, db.StudentFree, db.StudentPremium, db.Professor)))
	api.Path("/getUserPermissions").HandlerFunc(o.HandleAuthenticatedTransactional(o.HandleAuthorization(o.getUserPermissions, db.StudentFree, db.StudentPremium, db.Professor)))
	api.Path("/retrieveVapidPublicKey").HandlerFunc(o.HandleAuthenticatedTransactional(o.HandleAuthorization(o.retrieveVapidPublicKey, db.StudentFree, db.StudentPremium, db.Professor)))
	api.Path("/saveUserDevicePushNotificationSubscription").HandlerFunc(o.HandleAuthenticatedTransactional(o.HandleAuthorization(o.saveUserDevicePushNotificationSubscription, db.StudentFree, db.StudentPremium, db.Professor)))
	api.Path("/shareRoutine").HandlerFunc(o.HandleAuthenticatedTransactional(o.HandleAuthorization(o.shareRoutine, db.StudentFree, db.StudentPremium, db.Professor)))
	api.Path("/getSharedRoutineDetails").HandlerFunc(o.HandleAuthenticatedTransactional(o.HandleAuthorization(o.getSharedRoutineDetails, db.StudentFree, db.StudentPremium, db.Professor)))
	api.Path("/requestAccessToSharedPlanification").HandlerFunc(o.HandleAuthenticatedTransactional(o.HandleAuthorization(o.requestAccessToSharedPlanification, db.StudentFree, db.StudentPremium, db.Professor)))
	api.Path("/getRoutineDetails").HandlerFunc(o.HandleAuthenticatedTransactional(o.HandleAuthorization(o.getRoutineDetails, db.StudentFree, db.StudentPremium, db.Professor)))
	api.Path("/getUserAccountDetails").HandlerFunc(o.HandleAuthenticatedTransactional(o.HandleAuthorization(o.getUserAccountDetails, db.StudentFree, db.StudentPremium, db.Professor)))
	api.Path("/actionateRoutine").HandlerFunc(o.HandleAuthenticatedTransactional(o.HandleAuthorization(o.actionateRoutine, db.StudentFree, db.StudentPremium, db.Professor)))
	api.Path("/saveSharedRoutine").HandlerFunc(o.HandleAuthenticatedTransactional(o.HandleAuthorization(o.saveSharedRoutine, db.StudentFree, db.StudentPremium, db.Professor)))
	api.Path("/listLatestEvents").HandlerFunc(o.HandleAuthenticatedTransactional(o.HandleAuthorization(o.listLatestEvents, db.StudentFree, db.StudentPremium, db.Professor)))
	api.Path("/signout").HandlerFunc(o.HandleAuthenticatedTransactional(o.HandleAuthorization(o.signout, db.StudentFree, db.StudentPremium, db.Professor)))
	api.Path("/checkAuth").HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		_, err := r.Cookie("auth_token")
		if err != nil {
			o.Respond(w, false, http.StatusUnauthorized)
			return
		} else {
			o.Respond(w, true, http.StatusOK)
			return
		}
	})
	//ui
	if !o.conf.IsDevelopment() || o.conf.ServeStaticUI() {
		app := o.r.PathPrefix("/app").Subrouter()
		app.Use(func(next http.Handler) http.Handler {
			return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
				if !strings.Contains(r.URL.Path, ".") {
					r.URL.Path = "/app/"
				}
				next.ServeHTTP(w, r)
			})
		})
		app.PathPrefix("/").Handler(http.StripPrefix("/app/", http.FileServer(http.Dir("ui/build"))))
		o.r.Path("/").HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			if r.URL.Path == "/" {
				http.Redirect(w, r, "/app/", http.StatusMovedPermanently)
				return
			}
		})
	}

	return o.r
}

func (o *Endpoints) getUserPermissions(w http.ResponseWriter, r *http.Request, tx *sqlx.Tx) {
	plan := o.plan(r)
	permissions := make(map[string]bool, 0)

	if *plan == db.StudentFree || *plan == db.StudentPremium || *plan == db.Professor {
		permissions["receiveNotifications"] = true
		permissions["shareRoutine"] = true
		permissions["getSharedRoutineDetails"] = true
		permissions["listPlanifications"] = true
		permissions["menuplanifications"] = true
		permissions["listExercises"] = true
		//not implemented
		permissions["createOneRoutine"] = true
		permissions["editRoutinesICreated"] = true
	}

	if *plan == db.StudentFree || *plan == db.StudentPremium {
		permissions["menustatistics"] = true
		permissions["menuhomestudent"] = true
	}

	if *plan == db.StudentPremium || *plan == db.Professor {
		permissions["createManyRoutines"] = true
		permissions["createManyExerciseBlocks"] = true
		permissions["executeRoutine"] = true
		permissions["editPlanification"] = true
		permissions["editRoutine"] = true
		permissions["canSaveSharedRoutines"] = true
	}

	if *plan == db.StudentPremium {
		permissions["statistics"] = true
	}

	if *plan == db.Professor {
		permissions["menudiscussions"] = true
		permissions["menuhomeprofessor"] = true
		permissions["createPlanification"] = true
		permissions["createNewExercises"] = true
		permissions["createNewMuscles"] = true
		permissions["createNewEquipment"] = true
		permissions["sharePlanification"] = true
	}

	o.Respond(w, permissions, http.StatusOK)
}

func (o *Endpoints) getUserAccountDetails(w http.ResponseWriter, r *http.Request, tx *sqlx.Tx) {
	userId := util.UserId(r)
	user := db.GetUserAccountDetails(o.db, tx, userId)
	o.Respond(w, user, http.StatusOK)
}

func (o *Endpoints) getRoutineDetails(w http.ResponseWriter, r *http.Request, tx *sqlx.Tx) {
	routineId, err := strconv.ParseInt(r.URL.Query().Get("routineId"), 10, 64)
	util.Check(err)
	userId := util.UserId(r)

	//todo: if owner??
	header := db.GetRoutineHeader(o.db, tx, routineId, userId, userId)
	result := db.GetRoutineDetails(o.db, tx, routineId, userId)
	res := o.calculateRoutineDetailsResponse(header, result, false)

	o.Respond(w, &res, http.StatusOK)
}

func (o *Endpoints) getSharedRoutineDetails(w http.ResponseWriter, r *http.Request, tx *sqlx.Tx) {
	shareEncrypted := r.URL.Query().Get("share")
	if shareEncrypted != "" {
		decoded, err := base64.RawURLEncoding.DecodeString(shareEncrypted)
		util.Check(err)
		key, err := base64.StdEncoding.DecodeString(*o.cryptoConf.LinkSharingKey)
		util.Check(err)
		decrypted, err := util.Decrypt(string(decoded), key)
		util.Check(err)
		var t ShareEncrypted
		err = json.Unmarshal([]byte(decrypted), &t)
		util.Check(err)

		metaData := db.GetRoutineUserSharingToken(o.db, tx, t.PlanificationId, t.RoutineId, t.CreatorId)
		if metaData.Creationdate.Add(time.Hour * time.Duration(*o.conf.LinkSharingExpirationDays) * 24).Before(time.Now()) {
			db.InvalidateSharingTokenForRoutine(o.db, tx, t.PlanificationId, t.RoutineId, t.CreatorId)
			panic(&BadRequestResponse{ErrorCode: util.PString("shared_routine_expired")})
		} else {
			usr := util.UserId(r)
			header := db.GetRoutineHeader(o.db, tx, t.RoutineId, t.CreatorId, usr)
			result := db.GetRoutineDetails(o.db, tx, t.RoutineId, t.CreatorId)
			res := o.calculateRoutineDetailsResponse(header, result, *metaData.CanBeSaved)

			o.Respond(w, &res, http.StatusOK)
		}
	} else {
		panic(&BadRequestResponse{ErrorCode: util.PString("no_shared_routine")})
	}
}

func (o *Endpoints) calculateRoutineDetailsResponse(header *db.GetRoutineHeaderQuery, result []db.GetRoutineDetailsQuery, canBeSaved bool) *GetRoutineDetailsResponse {
	res := &GetRoutineDetailsResponse{
		Id:                      header.Routineid,
		Name:                    header.Routinename,
		Difficulty:              header.Difficulty,
		Duration:                header.Duration,
		IsCopy:                  header.IsCopy,
		AlreadyCopied:           header.AlreadyCopied,
		CanBeSaved:              &canBeSaved,
		AlreadyMarkedByAthetles: util.PBool(*header.TimesMarked > 0),
		BlockGroupers:           make([]GetRoutineDetailsBlockGrouper, 0),
	}

	if len(result) == 1 && result[0].GrouperId == nil {
		return res
	}

	lastGrouperId := int64(0)
	lastBlockId := int64(0)
	lastBlockIndex := 0
	var grouper *GetRoutineDetailsBlockGrouper
	var block *GetRoutineDetailsBlock
	for _, re := range result {
		if *re.GrouperId != lastGrouperId {
			lastGrouperId = *re.GrouperId
			lastBlockIndex = 0
			if grouper != nil {
				res.BlockGroupers = append(res.BlockGroupers, *grouper)
			}
			grouper = &GetRoutineDetailsBlockGrouper{
				Id:     re.GrouperId,
				Name:   re.GrouperName,
				Blocks: make([]GetRoutineDetailsBlock, 0),
			}
			if re.Blockgroupid != nil {
				lastBlockId = *re.Blockgroupid
				block = &GetRoutineDetailsBlock{
					Id:              re.Blockgroupid,
					Name:            re.Blockgroupname,
					Duration:        re.BlockDuration,
					Type:            re.Type,
					Laps:            re.Laps,
					Exerestinterval: re.Exerestinterval,
					Laprestinterval: re.Laprestinterval,
					Exercises:       make([]GetRoutineDetailsBlockExercise, 0),
				}
				if re.ExerciseBGID != nil {
					block.Exercises = append(block.Exercises, GetRoutineDetailsBlockExercise{Id: re.ExerciseBGID, Name: re.Exercisename, Secs: re.Secs, Reps: re.Reps, VideoCode: re.VideoCode})
				}
				grouper.Blocks = append(grouper.Blocks, *block)
			}
		} else {
			if *re.Blockgroupid != lastBlockId {
				lastBlockId = *re.Blockgroupid
				lastBlockIndex++
				block = &GetRoutineDetailsBlock{
					Id:              re.Blockgroupid,
					Name:            re.Blockgroupname,
					Duration:        re.BlockDuration,
					Type:            re.Type,
					Laps:            re.Laps,
					Exerestinterval: re.Exerestinterval,
					Laprestinterval: re.Laprestinterval,
					Exercises:       make([]GetRoutineDetailsBlockExercise, 0),
				}
				if re.ExerciseBGID != nil {
					block.Exercises = append(block.Exercises, GetRoutineDetailsBlockExercise{Id: re.ExerciseBGID, Name: re.Exercisename, Secs: re.Secs, Reps: re.Reps, VideoCode: re.VideoCode})
				}
				grouper.Blocks = append(grouper.Blocks, *block)
			} else if re.ExerciseBGID != nil {
				grouper.Blocks[lastBlockIndex].Exercises = append(grouper.Blocks[lastBlockIndex].Exercises, GetRoutineDetailsBlockExercise{
					Id:        re.ExerciseBGID,
					Name:      re.Exercisename,
					Secs:      re.Secs,
					Reps:      re.Reps,
					VideoCode: re.VideoCode,
				})
			}
		}
	}
	//last block
	res.BlockGroupers = append(res.BlockGroupers, *grouper)
	return res
}

func (o *Endpoints) listLatestEvents(w http.ResponseWriter, r *http.Request, tx *sqlx.Tx) {
	usr := util.UserId(r)
	events := db.ListLatestEventsBy(o.db, tx, usr)

	res := make([]string, 0)
	for _, e := range events {
		switch *e.Type {
		case db.SavedCopyOfRoutine:
			res = append(res, fmt.Sprintf("%s guardó la rutina %s que compartiste", *e.SenderName, *e.RoutineName))
			break
		}
	}

	o.Respond(w, &ListLatestEventsResponse{Events: res}, http.StatusOK)
}

func (o *Endpoints) saveSharedRoutine(w http.ResponseWriter, r *http.Request, tx *sqlx.Tx) {
	t := SaveSharedRoutineRequest{}
	err := o.Decode(r, &t)
	util.Check(err)

	usr := util.UserId(r)
	meta := db.GetRoutineUserSharingTokenBy(o.db, tx, *t.RoutineId)
	if *meta.CanBeSaved {
		plan := o.plan(r)
		if *plan == db.StudentFree {
			panic(&BadRequestResponse{ErrorCode: util.PString("free_saved_routines_no")})
		}

		if db.CalculateUserAlreadyCopiedRoutine(o.db, tx, usr, *t.RoutineId) {
			panic(&BadRequestResponse{ErrorCode: util.PString("shared_routine_already_copied")})
		}

		planificationId := db.GetPlanificationIdByName(o.db, tx, usr, SharedRoutinesPlanificationReservedName)
		if planificationId == nil {
			planificationId = db.CreatePlanification(o.db, tx, usr, SharedRoutinesPlanificationReservedName, true)
			db.InsertPlanificationDays(o.db, tx, *planificationId, "01234")
		}
		//else {
		//	count := db.CountRoutinesInPlanification(o.db, tx, *planificationId)
		//	plan := o.plan(r)
		//	if *plan == db.StudentFree && *count > 0 {
		//		panic(&BadRequestResponse{ErrorCode: util.PString("free_saved_routines_limit")})
		//		//panic(errors.New("free accounts cannot save more than one shared routine"))
		//	}
		//}
		original := db.GetRoutineById(o.db, tx, *t.RoutineId)
		originalGroupers := db.ListBlockGroupGrouperByRoutineId(o.db, tx, *t.RoutineId)
		newRoutineId := db.CreateRoutine(
			o.db,
			tx,
			*original.Name,
			*planificationId,
			*original.CreatorId,
			*original.Difficulty,
			*original.Duration)

		for _, bg := range originalGroupers {
			newBgId := db.CreateBlockGrouper(o.db, tx, *bg.Name, *newRoutineId, *bg.Order)
			originalGroups := db.ListBlockGroupByRoutineId(o.db, tx, *bg.RoutineId, *bg.Id)

			for _, b := range originalGroups {
				newBlockGroupId := db.CreateBlockGroup(o.db, tx, *b.Type, *b.Name, *newRoutineId, *newBgId, b.Duration, b.Laps, b.LapRestInterval, b.ExeRestInterval)
				originalExercises := db.ListBlockGroupExerciseByBlockId(o.db, tx, *b.Id)

				for _, ex := range originalExercises {
					db.CreateExerciseBlockGroup(o.db, tx, *newBlockGroupId, *ex.ExerciseId, *ex.Order, ex.Reps, ex.Secs)
				}
			}
		}

		db.InsertEventUser(o.db, tx, db.SavedCopyOfRoutine, *original.CreatorId, usr, nil, original.Id)
		db.InsertUserRoutineCopy(o.db, tx, usr, *original.Id)
	} else {
		panic(&BadRequestResponse{ErrorCode: util.PString("cannot_save_routine")})
		//panic(errors.New("routine cannot be saved"))
	}
}

func (o *Endpoints) actionateRoutine(w http.ResponseWriter, r *http.Request, tx *sqlx.Tx) {
	t := ActionateRoutineRequest{}
	err := o.Decode(r, &t)
	util.Check(err)

	usr := util.UserId(r)
	if !db.CalculateUserHasNoAccessToPlanification(o.db, tx, *t.PlanificationId, usr) {
		plan := db.GetAccountPlanIdentifierByUserId(o.db, tx, usr)
		iAmPremium := *plan == db.StudentPremium || *plan == db.Professor
		if !iAmPremium {
			if db.CalculateUserAlreadyActionatedARoutineToday(o.db, tx, *t.PlanificationId, usr) {
				panic(&BadRequestResponse{ErrorCode: util.PString("free_actionate_routine_limit")})
				//panic(errors.New("you already actionate a routine today"))
			}
			schedule := db.GetPlanificationScheduleByUser(o.db, tx, *t.PlanificationId, usr)
			db.UpdateUserPlanificationRoutineAccess(o.db, tx, *t.PlanificationId, usr, *schedule.AccessUpToRoutine+1)
		}

		if *t.ActionatedRoutineAction == "skip" {
			db.InsertUserRoutineHistory(o.db, tx, false, *t.PlanificationId, *t.ActionatedRoutineId, usr)
		} else if *t.ActionatedRoutineAction == "finished" {
			db.InsertUserRoutineHistory(o.db, tx, true, *t.PlanificationId, *t.ActionatedRoutineId, usr)
		}
	} else {
		panic(&BadRequestResponse{ErrorCode: util.PString("no_access")})
	}
}

func (o *Endpoints) listRoutines(w http.ResponseWriter, r *http.Request, tx *sqlx.Tx) {
	id := r.URL.Query().Get("planificationId")
	if id == "" {
		panic(&BadRequestResponse{ErrorCode: util.PString("required_planificationid")})
		//panic(errors.New("planification id is required"))
	}
	planificationId, err := strconv.ParseInt(id, 10, 64)
	util.Check(err)

	usr := util.UserId(r)
	routines := make([]db.ListRoutinesQuery, 0)
	plan := db.GetAccountPlanIdentifierByUserId(o.db, tx, usr)
	iAmPremium := *plan == db.StudentPremium || *plan == db.Professor
	iAmOwner := db.CalculateUserOwnsPlanification(o.db, tx, usr, planificationId)
	isEditable := false
	if iAmOwner {
		routines = db.ListActiveRoutinesICreated(o.db, tx, planificationId, usr)
		isEditable = iAmPremium && !db.CalculatePlanificationAlreadyExecutedBySomeone(o.db, tx, planificationId)
	} else {
		if db.CalculateUserHasNoAccessToPlanification(o.db, tx, planificationId, usr) {
			o.Respond(w, nil, http.StatusUnauthorized)
			return
		}
		routines = db.ListActiveRoutines(o.db, tx, planificationId, usr)
	}

	schedule := db.GetPlanificationScheduleByUser(o.db, tx, planificationId, usr)
	week := len(*schedule.Days)
	accessUpToRoutine := *schedule.AccessUpToRoutine
	userActionatedRoutineToday := false
	if iAmPremium {
		//todo: this could be in a cron job
		//premium users can access the whole training week every week
		if schedule.AccessLastUpdated.Sub(time.Now()).Hours() > 6*24 {
			accessUpToRoutine = *schedule.AccessUpToRoutine + week
			db.UpdateUserPlanificationRoutineAccess(o.db, tx, planificationId, usr, accessUpToRoutine)
		}
	} else {
		userActionatedRoutineToday = db.CalculateUserAlreadyActionatedARoutineToday(o.db, tx, planificationId, usr)
	}

	scheduleDaysBuf := strings.Split(*schedule.Days, "")
	scheduleDays := make([]int, 0)
	for _, d := range scheduleDaysBuf {
		i, _ := strconv.Atoi(d)
		scheduleDays = append(scheduleDays, i)
	}

	scheduleDaysIterator := 0
	weekStarts := true
	dayNames := []string{"Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado", "Domingo"}
	today := int(time.Now().Weekday()) - 1

	routinesResponse := make([]ListRoutinesRoutineResponse, 0)
	for i := 0; i < len(routines); i++ {
		routineResponse := ListRoutinesRoutineResponse{
			Id:              routines[i].Id,
			Name:            routines[i].Name,
			PlanificationId: routines[i].PlanificationId,
			BlockCount:      routines[i].BlockCount,
			WorkCount:       routines[i].WorkCount,
			Completed:       routines[i].Completed,
			Duration:        routines[i].Duration,
		}

		if routines[i].Completed != nil {
			if !iAmOwner && !iAmPremium {
				routineResponse.Id = nil
			}
		} else {
			if iAmOwner && iAmPremium {
				//todo: and is a planification for myself (otherwise I can simplify the UI removing unuseful actions)
				routineResponse.IsActionable = true
			} else if !userActionatedRoutineToday && scheduleDays[scheduleDaysIterator] <= today && i < accessUpToRoutine {
				routineResponse.IsActionable = true
			} else if i >= accessUpToRoutine {
				routineResponse.Id = nil
			}
		}

		if week > 0 {
			*routines[i].Name = *routines[i].Name + ": " + dayNames[scheduleDays[scheduleDaysIterator]]
			if scheduleDaysIterator == week-1 {
				scheduleDaysIterator = 0
				weekStarts = true
			} else {
				if weekStarts {
					routineResponse.IsStartOfWeek = true
					weekStarts = false
				}
				scheduleDaysIterator++
			}
		}
		routinesResponse = append(routinesResponse, routineResponse)
	}

	o.Respond(w, &ListRoutinesResponse{
		IsEditable: &isEditable,
		Week:       schedule.Days,
		Routines:   routinesResponse,
	}, http.StatusOK)
}

func (o *Endpoints) listPlanifications(w http.ResponseWriter, r *http.Request, tx *sqlx.Tx) {
	userId := util.UserId(r)
	o.Respond(w, db.ListMyPlanifications(o.db, tx, userId), http.StatusOK)
}

func (o *Endpoints) listExercises(w http.ResponseWriter, r *http.Request, tx *sqlx.Tx) {
	userId := util.UserId(r)

	var exercises []db.ListExerciseQuery
	if listExercisesQueryCache.IsValid() {
		exercises = listExercisesQueryCache.Fetch()
	} else {
		exercises = db.ListExercises(o.db, tx, userId)
		listExercisesQueryCache.Populate(exercises)
	}
	//todo: use a Response struct to not expose db data.
	plan := o.plan(r)
	if *plan == db.Professor {
		o.Respond(w, &ListExercisesResponse{
			ShowVideoInfo: util.PBool(true),
			Exercises:     exercises,
		}, http.StatusOK)
	} else {
		//todo: for students there will be another query that retrieves exercise videos from a round robin of instructors
		//in the case that the student is not inside a planification owned by an instructor
		o.Respond(w, &ListExercisesResponse{
			ShowVideoInfo: util.PBool(false),
			Exercises:     exercises,
		}, http.StatusOK)
	}
}

func (o *Endpoints) listUserRms(w http.ResponseWriter, r *http.Request, tx *sqlx.Tx) {
	userId := util.UserId(r)

	rms := db.ListUserExerciseRmByUserId(o.db, tx, userId)

	rmsRes := make([]UserRmResponse, 0)
	for i, rm := range rms {
		rmsRes = append(rmsRes, UserRmResponse{
			Id:           rm.UeId,
			ExerciseName: rm.ExerciseName,
			Rm:           rm.Rm,
			Date:         util.PString(rm.LastUpdatedDate.Format("02/01/2006")),
			Sum:          nil,
			From:         nil,
		})

		if *rm.ExerciseName == "Fondo" {
			rmsRes[i].Sum = util.PBool(true)
			rmsRes[i].From = util.PInt(0)
		}
	}

	rmsRes[len(rmsRes)-1].Sum = util.PBool(true)
	rmsRes[len(rmsRes)-1].From = util.PInt(2)

	o.Respond(w, &ListUserRmsResponse{
		Rms: rmsRes,
	}, http.StatusOK)
}

func (o *Endpoints) saveNewRm(w http.ResponseWriter, r *http.Request, tx *sqlx.Tx) {
	t := SaveNewRmRequest{}
	err := o.Decode(r, &t)
	util.Check(err)

	usr := util.UserId(r)
	if !db.CalculateRmBelongToUser(o.db, tx, usr, *t.Id) {
		panic(&BadRequestResponse{ErrorCode: util.PString("no_access")})
	}

	db.UpdateUserRmSummary(o.db, tx, *t.Id, *t.Rm)
	db.InsertNewUserRmHistory(o.db, tx, *t.Id, *t.Rm)
}

func (o *Endpoints) listLastUserRmHistoryStats(w http.ResponseWriter, r *http.Request, tx *sqlx.Tx) {
	usr := util.UserId(r)
	data := db.ListLast7UserRmHistory(o.db, tx, usr)
	labels := make([]string, 0)
	matrix := make([][]int, 5)
	for i := range matrix {
		matrix[i] = make([]int, 0)
	}
	lastRmId := *data[0].Id
	dataEach := 7
	currentSerie := 0
	maxDate := data[0].Date
	minDate := data[0].Date
	for i := 0; i < len(data); i++ {
		if *data[i].Id != lastRmId {
			//repeat for last element
			if len(matrix[currentSerie]) < dataEach {
				loadedData := make([]int, 0)
				for _, d := range matrix[currentSerie] {
					loadedData = append(loadedData, d)
				}
				matrix[currentSerie] = make([]int, 0)
				for j := 0; j < dataEach-len(loadedData); j++ {
					matrix[currentSerie] = append(matrix[currentSerie], 0)
				}
				for _, d := range loadedData {
					matrix[currentSerie] = append(matrix[currentSerie], d)
				}
			}
			lastRmId = *data[i].Id
			currentSerie++
		}

		if data[i].Rm == nil {
			matrix[currentSerie] = append(matrix[currentSerie], 0)
		} else {
			matrix[currentSerie] = append(matrix[currentSerie], *data[i].Rm)
		}

		if maxDate == nil {
			maxDate = data[i].Date
		} else if data[i].Date != nil && maxDate.Before(*data[i].Date) {
			maxDate = data[i].Date
		}

		if minDate == nil {
			minDate = data[i].Date
		} else if data[i].Date != nil && minDate.After(*data[i].Date) {
			minDate = data[i].Date
		}
	}

	if len(matrix[currentSerie]) < dataEach {
		loadedData := make([]int, 0)
		for _, d := range matrix[currentSerie] {
			loadedData = append(loadedData, d)
		}
		matrix[currentSerie] = make([]int, 0)
		for j := 0; j < dataEach-len(loadedData); j++ {
			matrix[currentSerie] = append(matrix[currentSerie], 0)
		}
		for _, d := range loadedData {
			matrix[currentSerie] = append(matrix[currentSerie], d)
		}
	}

	if minDate != nil {
		labels = append(labels, (*minDate).Format("02/01/2006"))
	} else {
		labels = append(labels, time.Now().Format("02/01/2006"))
	}

	if maxDate != nil {
		labels = append(labels, (*maxDate).Format("02/01/2006"))
	} else {
		labels = append(labels, time.Now().Format("02/01/2006"))
	}

	o.Respond(w, &ListLastUserRmHistoryStatsResponse{
		Labels: labels,
		Series: matrix,
	}, http.StatusOK)
}

func (o *Endpoints) saveRoutineEditions(w http.ResponseWriter, r *http.Request, tx *sqlx.Tx) {
	t := EditRoutineRequest{}
	err := o.Decode(r, &t)
	util.Check(err)

	userId := util.UserId(r)
	if !db.CalculateUserOwnsRoutine(o.db, tx, userId, *t.PlanificationId, *t.RoutineId) {
		panic(&BadRequestResponse{ErrorCode: util.PString("no_access")})
	}

	plan := o.plan(r)
	if *plan != db.StudentPremium && *plan != db.Professor {
		panic(&BadRequestResponse{ErrorCode: util.PString("no_access_premium")})
	}

	if t.NewRoutineName != nil {
		if len(*t.NewRoutineName) > 30 {
			panic(&BadRequestResponse{ErrorCode: util.PString("update_routine_name_max_30")})
		}
		db.UpdateRoutineName(o.db, tx, *t.PlanificationId, *t.RoutineId, *t.NewRoutineName)
	}

	if len(t.NewGrouperNames) > 10 {
		panic(&BadRequestResponse{ErrorCode: util.PString("update_routine_blockgroup_limit")})
	}
	if len(t.GrouperIdsToDelete) > 10 {
		panic(&BadRequestResponse{ErrorCode: util.PString("update_routine_blockgroup_limit")})
	}
	if len(t.WorkOutToDelete) > 50 {
		panic(&BadRequestResponse{ErrorCode: util.PString("update_routine_workout_limit")})
	}
	if len(t.ExercisesToDelete) > 100 {
		panic(&BadRequestResponse{ErrorCode: util.PString("update_routine_exercise_limit")})
	}

	for _, g := range t.NewGrouperNames {
		if g.Name == nil {
			panic(&BadRequestResponse{ErrorCode: util.PString("update_routine_blockgroup_name_required")})
		}
		if len(*g.Name) > 35 {
			panic(&BadRequestResponse{ErrorCode: util.PString("update_routine_blockgroup_name_max_35")})
		}

		db.UpdateGrouperNames(o.db, tx, *t.PlanificationId, *t.RoutineId, *g.Id, *g.Name)
	}

	for _, bg := range t.GrouperIdsToDelete {
		db.DeleteBlockGrouper(o.db, tx, *t.RoutineId, bg)
		db.DeleteWorkoutsByGrouperId(o.db, tx, *t.RoutineId, bg)
		db.DeleteExerciseBlockGroupByGrouperId(o.db, tx, *t.RoutineId, bg)
	}

	for _, wo := range t.WorkOutToDelete {
		db.DeleteWorkout(o.db, tx, *t.RoutineId, *wo.GrouperId, *wo.WorkoutId)
		db.DeleteExerciseBlockGroupByWorkoutId(o.db, tx, *t.RoutineId, *wo.GrouperId, *wo.WorkoutId)
	}

	for _, e := range t.ExercisesToDelete {
		db.DeleteExerciseBlockGroup(o.db, tx, *t.RoutineId, *e.GrouperId, *e.WorkoutId, *e.ExerciseId)
	}

	for _, wk := range t.ExercisesToAdd {
		if len(wk.Exercises) > 30 {
			panic(&BadRequestResponse{ErrorCode: util.PString("update_routine_exercise_limit")})
		}

		if !db.CalculateGrouperWorkoutBelongToRoutine(o.db, tx, *t.RoutineId, *wk.GrouperId, *wk.WorkoutId) {
			panic(&BadRequestResponse{ErrorCode: util.PString("no_access")})
		}

		currentValid := db.ListBlockGroupExerciseByBlockId(o.db, tx, *wk.WorkoutId)
		db.DeleteExerciseBlockGroupByWorkoutId(o.db, tx, *t.RoutineId, *wk.GrouperId, *wk.WorkoutId)

		iNew := 0
		iCurrent := 0
		for i := 0; i < len(currentValid)+len(wk.Exercises); i++ {
			if iNew < len(wk.Exercises) && i == *wk.Exercises[iNew].Order {
				e := wk.Exercises[iNew]
				db.CreateExerciseBlockGroup(o.db, tx, *e.WorkoutId, *e.ExerciseId, i, e.Reps, e.Secs)
				iNew++
			} else {
				e := currentValid[iCurrent]
				db.CreateExerciseBlockGroup(o.db, tx, *e.BlockGroupId, *e.ExerciseId, i, e.Reps, e.Secs)
				iCurrent++
			}
		}
	}
}

func (o *Endpoints) saveExerciseBlockValidations(r *http.Request, tx *sqlx.Tx, routineId, planificationId *int64, exercises []ExerciseRequest, newName *string) ([]ExerciseRequest, *int64) {
	userId := util.UserId(r)
	plan := o.plan(r)

	if len(*newName) > 50 {
		panic(&BadRequestResponse{ErrorCode: util.PString("create_blockgroup_name_max_50")})
	}

	if !db.CalculateUserOwnsPlanification(o.db, tx, userId, *planificationId) {
		panic(&BadRequestResponse{ErrorCode: util.PString("no_access")})
		//panic(errors.New("unauthorized to modify the requested planification"))
	}

	if len(exercises) == 0 {
		panic(&BadRequestResponse{ErrorCode: util.PString("required_at_least_one_exercise")})
		//panic(errors.New("you are not adding any exercises but at least one is required"))
	}

	if len(exercises) > *o.conf.ExercisesPerBlockLimit {
		panic(&BadRequestResponse{ErrorCode: util.PString("work_exercises_limit")})
		//panic(fmt.Errorf("you cannot add more than %d to an exercises block", *o.conf.ExercisesPerBlockLimit))
	}

	if routineId == nil {
		last := db.CountRoutinesInPlanification(o.db, tx, *planificationId)
		if *plan == db.StudentFree && *last > 0 {
			panic(&BadRequestResponse{ErrorCode: util.PString("free_create_routine_limit")})
			//panic(errors.New("free accounts cannot have more than one routine"))
		}
		routineId = db.CreateRoutineDefault(o.db, tx, fmt.Sprintf("Dia %d", *last+1), *planificationId, userId)
	} else {
		if !db.CalculateUserOwnsRoutine(o.db, tx, userId, *planificationId, *routineId) {
			panic(&BadRequestResponse{ErrorCode: util.PString("no_access")})
			//panic(errors.New("unauthorized to modify the requested routine"))
		}

		header := db.GetRoutineHeader(o.db, tx, *routineId, userId, userId)
		if *header.TimesMarked > 0 {
			panic(&BadRequestResponse{ErrorCode: util.PString("cannot_modify_routine")})
			//panic(errors.New("you cannot add more exercise blocks to a routine that was already marked by any athlete"))
		}

		blocks := db.CalculateRoutineBlocksAmount(o.db, tx, *routineId)
		if *plan == db.StudentFree && blocks >= *o.conf.StudentFreeAccountRoutineBlocksLimit {
			panic(&BadRequestResponse{ErrorCode: util.PString("free_work_routine_limit")})
			//panic(errors.New(fmt.Sprintf("you cannot add more than %d exercise blocks to a routine with a free account", *o.conf.StudentFreeAccountRoutineBlocksLimit)))
		}
	}

	//todo exercise ID for newly created exercises may collide if several instructors are creating new exercises.
	//	let's wait for people to complain to look for a solution
	existingExercises, nonExistingExercisesUnsanitized, order := exercisesComparerCache.FilterExercisesByIds(exercises)
	nonExistingToAdd := make([]ExerciseRequest, 0)
	if *plan == db.Professor {
		exerciseNamesComparer := make([]ExerciseComparer, 0)
		sanitizedKeys := make([]string, 0)
		re := regexp.MustCompile(`[^a-zA-Z0-9áéíóúÁÉÍÓÚñÑüÜ/]`)
		for _, e := range nonExistingExercisesUnsanitized {
			if len(*e.Name) > *o.conf.CustomExerciseNameCharacterLimit {
				//todo validation mge not supported
				continue
			}
			sanitizedKey := strings.ToLower(string(re.ReplaceAll([]byte(*e.Name), []byte(""))))
			avoid := false
			for _, s := range sanitizedKeys {
				if s == sanitizedKey {
					avoid = true
					continue
				}
			}
			if !avoid {
				sanitizedKeys = append(sanitizedKeys, sanitizedKey)
			}
			toSanitizeName := strings.Split(*e.Name, " ")
			for _, word := range toSanitizeName {
				word = string(re.ReplaceAll([]byte(word), []byte("")))
			}
			sanitizedName := strings.Join(toSanitizeName, " ")
			exerciseNamesComparer = append(exerciseNamesComparer, ExerciseComparer{
				SanitizedKey:    &sanitizedKey,
				SanitizedName:   &sanitizedName,
				ShouldCreate:    util.PBool(!avoid),
				ExerciseRequest: e,
			})
		}
		_, nonExistingExercises := exercisesComparerCache.Exist(exerciseNamesComparer)
		newExercisesCreated := false
		for i, ex := range nonExistingExercises {
			if !*ex.ShouldCreate {
				for _, ex2 := range nonExistingExercises[0:i] {
					if *ex2.SanitizedKey == *ex.SanitizedKey {
						*ex.ExerciseRequest.Name = *ex2.SanitizedName
						*ex.ExerciseRequest.Id = *ex2.Id
						nonExistingToAdd = append(nonExistingToAdd, ex.ExerciseRequest)
						break
					}
				}

				continue
			}
			count := db.CountExercisesCreatedByUser(o.db, tx, userId)
			if *count > *o.conf.CustomExercisesPerUserLimit {
				panic(&BadRequestResponse{ErrorCode: util.PString("new_exercises_limit")})
				//panic(errors.New("you cannot create more new exercises"))
			}
			exerciseId := db.CreateExercise(o.db, tx, *ex.SanitizedName, userId)
			*ex.ExerciseRequest.Name = *ex.SanitizedName
			*ex.ExerciseRequest.Id = *exerciseId
			nonExistingToAdd = append(nonExistingToAdd, ex.ExerciseRequest)
			exercisesComparerCache.Add(*exerciseId, *ex.SanitizedName)
			newExercisesCreated = true
		}

		if newExercisesCreated {
			listExercisesQueryCache.Invalidate()
		}
	}

	exercisesToAddToBlock := make([]ExerciseRequest, 0)
	existingExercisesIndex := 0
	nonExistingExercisesIndex := 0
	for _, o := range order {
		if o {
			exercisesToAddToBlock = append(exercisesToAddToBlock, existingExercises[existingExercisesIndex])
			existingExercisesIndex++
		} else {
			exercisesToAddToBlock = append(exercisesToAddToBlock, nonExistingToAdd[nonExistingExercisesIndex])
			nonExistingExercisesIndex++
		}
	}
	return exercisesToAddToBlock, routineId
}

func (o *Endpoints) saveExercisesBlockFree(w http.ResponseWriter, r *http.Request, tx *sqlx.Tx) {
	t := SaveExercisesBlockFreeRequest{}
	err := o.Decode(r, &t)
	util.Check(err)

	validExercises, routineId := o.saveExerciseBlockValidations(r, tx, t.RoutineId, t.PlanificationId, t.Exercises, t.NewBlockGroupName)
	exercises := make([]db.ExerciseBlockGroup, 0)
	for _, e := range validExercises {
		if e.Type != nil && *e.Type == "secs" {
			exercises = append(exercises, db.ExerciseBlockGroup{
				ExerciseId: e.Id,
				Secs:       e.Reps,
			})
		} else {
			exercises = append(exercises, db.ExerciseBlockGroup{
				ExerciseId: e.Id,
				Reps:       e.Reps,
			})
		}
	}
	db.SaveExercisesBlock(o.db, tx, *routineId, "cpt",
		*t.BlockName, nil, t.Laps, t.RestingInteval,
		t.ExeRestingInteval, exercises, *t.NewBlockGroupName, t.NewBlockGroupId, *t.NewBlockGroupOrder)
	o.Respond(w, &SaveExercisesBlockCptResponse{RoutineId: routineId}, http.StatusOK)
}

func (o *Endpoints) saveExercisesBlockCpt(w http.ResponseWriter, r *http.Request, tx *sqlx.Tx) {
	t := SaveExercisesBlockCptRequest{}
	err := o.Decode(r, &t)
	util.Check(err)

	validExercises, routineId := o.saveExerciseBlockValidations(r, tx, t.RoutineId, t.PlanificationId, t.Exercises, t.NewBlockGroupName)
	exercises := make([]db.ExerciseBlockGroup, 0)
	for _, e := range validExercises {
		exercises = append(exercises, db.ExerciseBlockGroup{
			ExerciseId: e.Id,
			Secs:       t.WorkingInterval,
		})
	}
	db.SaveExercisesBlock(o.db, tx, *routineId, "cpt", *t.BlockName,
		nil, t.Laps, t.RestingInteval, t.RestingInteval, exercises, *t.NewBlockGroupName, t.NewBlockGroupId, *t.NewBlockGroupOrder)
	o.Respond(w, &SaveExercisesBlockCptResponse{RoutineId: routineId}, http.StatusOK)
}

func (o *Endpoints) saveExercisesBlockAmrap(w http.ResponseWriter, r *http.Request, tx *sqlx.Tx) {
	t := SaveExercisesBlockAmrapRequest{}
	err := o.Decode(r, &t)
	util.Check(err)

	validExercises, routineId := o.saveExerciseBlockValidations(r, tx, t.RoutineId, t.PlanificationId, t.Exercises, t.NewBlockGroupName)
	exercises := make([]db.ExerciseBlockGroup, 0)
	for _, e := range validExercises {
		exercises = append(exercises, db.ExerciseBlockGroup{
			ExerciseId: e.Id,
			Reps:       e.Reps,
		})
	}
	db.SaveExercisesBlock(o.db, tx, *routineId, "amrap", *t.BlockName,
		t.BlockDuration, nil, nil, nil, exercises, *t.NewBlockGroupName, t.NewBlockGroupId, *t.NewBlockGroupOrder)
	o.Respond(w, &SaveExercisesBlockAmrapResponse{RoutineId: routineId}, http.StatusOK)
}

func (o *Endpoints) saveExercisesBlockCombo(w http.ResponseWriter, r *http.Request, tx *sqlx.Tx) {
	t := SaveExercisesBlockComboRequest{}
	err := o.Decode(r, &t)
	util.Check(err)

	validExercises, routineId := o.saveExerciseBlockValidations(r, tx, t.RoutineId, t.PlanificationId, t.Exercises, t.NewBlockGroupName)
	exercises := make([]db.ExerciseBlockGroup, 0)
	for _, e := range validExercises {
		exercises = append(exercises, db.ExerciseBlockGroup{
			ExerciseId: e.Id,
		})
	}
	db.SaveExercisesBlock(o.db, tx, *routineId, "cbo", *t.BlockName, nil,
		t.Laps, nil, nil, exercises, *t.NewBlockGroupName, t.NewBlockGroupId, *t.NewBlockGroupOrder)
	o.Respond(w, &SaveExercisesBlockComboResponse{RoutineId: routineId}, http.StatusOK)
}

func (o *Endpoints) saveExerciseBlockPir(w http.ResponseWriter, r *http.Request, tx *sqlx.Tx) {
	t := SaveExercisesBlockPirRequest{}
	err := o.Decode(r, &t)
	util.Check(err)

	validExercises, routineId := o.saveExerciseBlockValidations(r, tx, t.RoutineId, t.PlanificationId, t.Exercises, t.NewBlockGroupName)
	exercises := make([]db.ExerciseBlockGroup, 0)
	for _, e := range validExercises {
		exercises = append(exercises, db.ExerciseBlockGroup{
			ExerciseId: e.Id,
			Reps:       e.Reps,
		})
	}
	db.SaveExercisesBlock(o.db, tx, *routineId, "pir", *t.BlockName, nil,
		t.Laps, nil, nil, exercises, *t.NewBlockGroupName, t.NewBlockGroupId, *t.NewBlockGroupOrder)
	o.Respond(w, &SaveExercisesBlockPirResponse{RoutineId: routineId}, http.StatusOK)
}

func (o *Endpoints) createPlanification(w http.ResponseWriter, r *http.Request, tx *sqlx.Tx) {
	t := CreatePlanificationRequest{}
	err := o.Decode(r, &t)
	util.Check(err)

	if t.Name == nil {
		panic(&BadRequestResponse{ErrorCode: util.PString("create_planification_name_required")})
	}

	if *t.Name == MyPlanificationReservedName || *t.Name == SharedRoutinesPlanificationReservedName {
		panic(&BadRequestResponse{ErrorCode: util.PString("create_planification_reserved_names")})
		//panic(errors.New("you cannot use reserved planification names"))
	}

	if len(*t.Name) > 50 {
		panic(&BadRequestResponse{ErrorCode: util.PString("create_planification_name_max_50")})
	}

	userId := util.UserId(r)
	id := db.CreatePlanification(o.db, tx, userId, *t.Name, false)
	o.Respond(w, &CreatePlanificationResponse{Id: id}, http.StatusOK)
}

func (o *Endpoints) savePlanificationDays(w http.ResponseWriter, r *http.Request, tx *sqlx.Tx) {
	t := SavePlanificationDaysRequest{}
	err := o.Decode(r, &t)
	util.Check(err)

	if len(*t.Days) <= 0 {
		panic(&BadRequestResponse{ErrorCode: util.PString("required_planification_week_one_day")})
	}

	userId := util.UserId(r)
	if !db.CalculateUserOwnsPlanification(o.db, tx, userId, *t.PlanificationId) {
		o.Respond(w, nil, http.StatusUnauthorized)
		return
	}

	db.InsertPlanificationDays(o.db, tx, *t.PlanificationId, *t.Days)
	o.Respond(w, nil, http.StatusOK)
}

func (o *Endpoints) retrieveVapidPublicKey(w http.ResponseWriter, r *http.Request, tx *sqlx.Tx) {
	w.Write([]byte(*o.cryptoConf.VapidPublicKey))
}

func (o *Endpoints) saveUserDevicePushNotificationSubscription(w http.ResponseWriter, r *http.Request, tx *sqlx.Tx) {
	t := SaveUserDevicePushNotificationSubscriptionRequest{}
	err := o.Decode(r, &t)
	util.Check(err)

	userId := util.UserId(r)
	reg := regexp.MustCompile(`\(([^)]+)\)`)
	device := reg.FindString(r.Header.Get("User-Agent"))

	key, err := base64.StdEncoding.DecodeString(*o.cryptoConf.VapidDataKey)
	util.Check(err)

	encrypted, err := util.Encrypt(*t.Subscription, key)
	util.Check(err)
	db.SaveUserDevicePushNotificationSubscription(o.db, tx, userId, encrypted, device)
	o.Respond(w, nil, http.StatusOK)
}

func (o *Endpoints) saveUserTrainedToday(w http.ResponseWriter, r *http.Request, tx *sqlx.Tx) {
	t := SaveUserTrainedTodayRequest{}
	err := o.Decode(r, &t)
	util.Check(err)
	userId := util.UserId(r)
	db.SaveUserTrainedToday(o.db, tx, userId, t.Answer)
	o.Respond(w, nil, http.StatusOK)
}

func (o *Endpoints) getUserLoadedTrainingToday(w http.ResponseWriter, r *http.Request, tx *sqlx.Tx) {
	userId := util.UserId(r)
	trained := db.GetUserLoadedTrainingToday(o.db, tx, userId)
	o.Respond(w, &struct {
		Loaded *bool `json:"loaded"`
	}{
		Loaded: &trained,
	}, http.StatusOK)
}

func (o *Endpoints) teacherSubscriptionApproved(w http.ResponseWriter, r *http.Request, tx *sqlx.Tx) {
	//todo: teacherSubscriptionApproved make sure they did paid
	//make sure domain is meli
	//set plan to user
	//ver si viene la cookie en este caso...
	//userId := util.UserId(r)
	//can only be called once per user. if they want another subscription they should first communicate to
	//cancel the previous one.
}

func (o *Endpoints) eliteSubscriptionApproved(w http.ResponseWriter, r *http.Request, tx *sqlx.Tx) {
	//todo: eliteSubscriptionApproved
}

func (o *Endpoints) googleSignIn(w http.ResponseWriter, r *http.Request, tx *sqlx.Tx) {
	bodyBytes, err := io.ReadAll(r.Body)
	util.Check(err)
	defer r.Body.Close()
	bodyString := string(bodyBytes)
	data := strings.Split(bodyString, "&")
	dataMap := make(map[string]string, len(data))
	for _, d := range data {
		keyvalue := strings.Split(d, "=")
		dataMap[keyvalue[0]] = keyvalue[1]
	}

	csrfTokenCookie, err := r.Cookie("g_csrf_token")
	util.Check(err)

	csrfTokenPayload, ok := dataMap["g_csrf_token"]
	if !ok {
		panic(errors.New("no CSRF token in post body"))
	}

	if csrfTokenCookie.Value != csrfTokenPayload {
		panic(errors.New("failed to verify double submit cookie"))
	}

	jwtToken := dataMap["credential"]
	token, err := jwt.ParseWithClaims(jwtToken, &util.GoogleAuthClaims{}, func(token *jwt.Token) (interface{}, error) {
		keyId := token.Header["kid"].(string)
		return o.conf.GooglePEMPublicKeys[keyId], nil
	}, jwt.WithAudience(*o.cryptoConf.GoogleClientId))
	util.Check(err)

	if !token.Valid {
		panic(errors.New("invalid token"))
	}

	claims := token.Claims.(*util.GoogleAuthClaims)

	exp, err := claims.GetExpirationTime()
	util.Check(err)

	if time.Now().After(exp.Time) {
		panic(errors.New("invalid token"))
	}

	iss, err := claims.GetIssuer()
	util.Check(err)
	if _, ok = o.conf.GoogleTokenValidIssuers[iss]; !ok {
		panic(errors.New("invalid token"))
	}

	userId := db.GetUserIdByUserNameNoError(o.db, tx, claims.Email)
	if userId != nil {
		o.storeSessionData(w, tx, *userId)
		plan := db.GetAccountPlanIdentifierByUserId(o.db, tx, *userId)
		if plan == nil {
			http.Redirect(w, r, *o.conf.AddressUi+"/app"+"/plans", http.StatusFound)
		} else if *plan == db.StudentFree {
			http.Redirect(w, r, *o.conf.AddressUi+"/app"+"/my-planifications", http.StatusFound)
		} else if *plan == db.StudentPremium {
			http.Redirect(w, r, *o.conf.AddressUi+"/app"+"/my-planifications", http.StatusFound)
		} else if *plan == db.Professor {
			http.Redirect(w, r, *o.conf.AddressUi+"/app"+"/my-planifications", http.StatusFound)
		} else {
			http.Redirect(w, r, *o.conf.AddressUi+"/app"+"/plans", http.StatusFound)
		}
	} else {
		//todo: auto generate a password and send it over email
		planId := db.GetAccountPlanIdByIdentifier(o.db, tx, db.StudentFree)
		userId = db.CreateUserAccount(o.db, tx, &db.UserAccount{
			Name:          util.PString(claims.Name),
			Username:      util.PString(claims.Email),
			Email:         util.PString(claims.Email),
			EmailVerified: util.PBool(claims.EmailVerified),
			UserType:      util.PString(string(db.StudentFree)),
			Password:      util.PString("autogenerated"),
			PictureUrl:    util.PString(claims.PictureUrl),
			Locale:        util.PString(claims.Locale),
			AccountPlanId: planId,
			CreatedDate:   time.Now(),
		})
		planificationId := db.CreatePlanification(o.db, tx, *userId, MyPlanificationReservedName, true)
		db.InsertPlanificationDays(o.db, tx, *planificationId, "01234")
		db.GenerateUserExerciseRm(o.db, tx, *userId)
		o.storeSessionData(w, tx, *userId)
		http.Redirect(w, r, *o.conf.AddressUi+"/app"+"/my-planifications", http.StatusFound)
	}
}

func (o *Endpoints) signout(w http.ResponseWriter, r *http.Request, tx *sqlx.Tx) {
	if !o.conf.IsDevelopment() {
		cookie, _ := r.Cookie("auth_token")
		sessionStore.Revoke(cookie.Value)
		userId := util.UserId(r)
		db.RemoveActiveSession(o.db, tx, userId)
		http.SetCookie(w, &http.Cookie{
			Name:     "auth_token",
			Value:    "",
			Domain:   ".bos.team",
			MaxAge:   -1,
			HttpOnly: true,
			Path:     "/",
			SameSite: http.SameSiteStrictMode,
			Secure:   true,
		})
	}
}

func (o *Endpoints) shareRoutine(w http.ResponseWriter, r *http.Request, tx *sqlx.Tx) {
	t := ShareRoutineRequest{}
	err := o.Decode(r, &t)
	util.Check(err)
	userId := util.UserId(r)
	if db.CalculateUserOwnsRoutine(o.db, tx, userId, *t.PlanificationId, *t.RoutineId) {
		db.InvalidateSharingTokenForRoutine(o.db, tx, *t.PlanificationId, *t.RoutineId, userId)
		key, err := base64.StdEncoding.DecodeString(*o.cryptoConf.LinkSharingKey)
		util.Check(err)
		str, err := json.Marshal(ShareEncrypted{
			RoutineId:       *t.RoutineId,
			PlanificationId: *t.PlanificationId,
			CreatorId:       userId,
		})
		util.Check(err)

		encrypted, err := util.Encrypt(string(str), key)
		util.Check(err)

		db.SaveUserSharingToken(o.db, tx, *t.PlanificationId, userId, t.RoutineId, *t.CanBeSaved)
		o.Respond(w, fmt.Sprintf("/routine?share=%s", base64.RawURLEncoding.EncodeToString([]byte(encrypted))), http.StatusOK)
	} else {
		o.Respond(w, nil, http.StatusUnauthorized)
	}
}

func (o *Endpoints) requestAccessToSharedPlanification(w http.ResponseWriter, r *http.Request, tx *sqlx.Tx) {
	p := RequestAccessToSharedPlanificationRequest{}
	err := o.Decode(r, &p)
	util.Check(err)
	userId := util.UserId(r)

	decoded, err := base64.RawURLEncoding.DecodeString(*p.SharedPlanification)
	util.Check(err)
	key, err := base64.StdEncoding.DecodeString(*o.cryptoConf.LinkSharingKey)
	util.Check(err)
	decrypted, err := util.Decrypt(string(decoded), key)
	util.Check(err)
	var t ShareEncrypted
	err = json.Unmarshal([]byte(decrypted), &t)
	util.Check(err)

	metaData := db.GetPlanificationUserSharingToken(o.db, tx, t.PlanificationId, t.CreatorId)

	if !db.UserAlreadyRequestedAccessToSharedPlanification(o.db, tx, *metaData.PlanificationId, userId) {
		if db.CalculateUserHasNoAccessToPlanification(o.db, tx, *metaData.PlanificationId, userId) {
			db.QueueAccessRequestToSharedPlanification(o.db, tx, *metaData.PlanificationId, userId)
		}
	}
}

func (o *Endpoints) listQueuedPlanificationAccessRequests(w http.ResponseWriter, r *http.Request, tx *sqlx.Tx) {
	o.Respond(w, db.ListQueuedPlanificationAccessRequests(o.db, tx, util.UserId(r)), http.StatusOK)
}

func (o *Endpoints) acceptPlanificationAccessRequest(w http.ResponseWriter, r *http.Request, tx *sqlx.Tx) {
	p := AcceptPlanificationAccessRequest{}
	err := o.Decode(r, &p)
	util.Check(err)
	userId := util.UserId(r)
	if db.CalculateUserOwnsPlanification(o.db, tx, userId, *p.PlanificationId) &&
		db.CalculateUserHasNoAccessToPlanification(o.db, tx, *p.PlanificationId, *p.RequesterUserId) {
		plan := db.GetAccountPlanIdentifierByUserId(o.db, tx, *p.RequesterUserId)
		db.AcceptPlanificationAccessRequest(o.db, tx, *p.PlanificationId, *p.RequesterUserId, userId, plan)
	}
}

func (o *Endpoints) declinePlanificationAccessRequest(w http.ResponseWriter, r *http.Request, tx *sqlx.Tx) {
	p := DeclinePlanificationAccessRequest{}
	err := o.Decode(r, &p)
	util.Check(err)
	userId := util.UserId(r)
	if db.CalculateUserOwnsPlanification(o.db, tx, userId, *p.PlanificationId) {
		db.DeclinePlanificationAccessRequest(o.db, tx, *p.PlanificationId, *p.RequesterUserId, userId)
	}
}

func (o *Endpoints) savePlanificationEditions(w http.ResponseWriter, r *http.Request, tx *sqlx.Tx) {
	p := SavePlanificationEditionsRequest{}
	err := o.Decode(r, &p)
	util.Check(err)
	userId := util.UserId(r)
	if len(p.Week) <= 0 {
		panic(&BadRequestResponse{ErrorCode: util.PString("required_planification_week_one_day")})
	}

	if !db.CalculateUserOwnsPlanification(o.db, tx, userId, *p.PlanificationId) {
		panic(&BadRequestResponse{ErrorCode: util.PString("no_access")})
	}

	if db.CalculatePlanificationAlreadyExecutedBySomeone(o.db, tx, *p.PlanificationId) {
		panic(&BadRequestResponse{ErrorCode: util.PString("cannot_edit_planification_being_executed")})
	}

	db.UpdatePlanificationDays(o.db, tx, *p.PlanificationId, strings.Join(p.Week, ""))
	for i := 0; i < len(p.RoutinesToDelete); i++ {
		db.DeleteRoutine(o.db, tx, p.RoutinesToDelete[i])
	}
}

func (o *Endpoints) sharePlanification(w http.ResponseWriter, r *http.Request, tx *sqlx.Tx) {
	t := SharePlanificationRequest{}
	err := o.Decode(r, &t)
	util.Check(err)
	userId := util.UserId(r)
	if db.CalculateUserOwnsPlanification(o.db, tx, userId, *t.PlanificationId) {
		key, err := base64.StdEncoding.DecodeString(*o.cryptoConf.LinkSharingKey)
		util.Check(err)
		str, err := json.Marshal(ShareEncrypted{
			PlanificationId: *t.PlanificationId,
			CreatorId:       userId,
		})
		util.Check(err)

		encrypted, err := util.Encrypt(string(str), key)
		util.Check(err)

		db.SaveUserSharingToken(o.db, tx, *t.PlanificationId, userId, nil, false)
		o.Respond(w, fmt.Sprintf("/my-planifications?pshare=%s", base64.RawURLEncoding.EncodeToString([]byte(encrypted))), http.StatusOK)
	} else {
		o.Respond(w, nil, http.StatusUnauthorized)
	}
}

func (o *Endpoints) serveImage(w http.ResponseWriter, r *http.Request, tx *sqlx.Tx) {
	input := r.URL.Query().Get("name")
	baseDirectory := "img"

	if strings.Contains(input, "..") {
		http.Error(w, "Invalid path.", http.StatusBadRequest)
		return
	}

	sanitizedPath := filepath.Clean(input)

	fullPath := filepath.Join(baseDirectory, sanitizedPath)
	if !strings.HasPrefix(fullPath, baseDirectory) {
		http.Error(w, "Invalid path.", http.StatusBadRequest)
		return
	}

	if _, err := os.Stat(fullPath); err != nil {
		http.Error(w, "File not found.", http.StatusNotFound)
		return
	}

	ext := filepath.Ext(sanitizedPath)
	if ext != ".jpg" && ext != ".png" {
		http.Error(w, "Invalid file type.", http.StatusBadRequest)
		return
	}

	/*
		todo:
			Logging: While you shouldn't show detailed error messages to users, it's a good idea to log them on the server-side for debugging and monitoring purposes.
			Rate Limiting & Monitoring: If possible, implement rate limiting to prevent abuse. Monitor for repeated failed attempts, which might indicate someone is trying to find vulnerabilities.
	*/

	http.ServeFile(w, r, fullPath)
}

func (o *Endpoints) getImage(key string, r *http.Request) (multipart.File, *multipart.FileHeader, string) {
	input, header, err := r.FormFile(key)
	util.Check(err)

	allowed := []string{"image/jpeg", "image/jpg", "image/png"}
	mimetype := header.Header.Get("Content-Type")
	i := sort.SearchStrings(allowed, mimetype)

	if i == len(allowed) {
		panic(errors.New("not_allowed_image_type"))
	}

	return input, header, strings.Split(mimetype, "/")[1]
}

func (o *Endpoints) GetParam(p string, req *http.Request) string {
	return mux.Vars(req)[p]
}

func (o *Endpoints) GetIntParam(p string, r *http.Request) *int64 {
	if i, err := strconv.ParseInt(o.GetParam(p, r), 10, 64); err != nil {
		i = 0
		return &i
	} else {
		return &i
	}
}

func (o *Endpoints) Respond(w http.ResponseWriter, data interface{}, status int) {
	w.WriteHeader(status)

	if data != nil {
		if err := json.NewEncoder(w).Encode(data); err != nil {
			fmt.Println(err)
		}
	}
}

func (o *Endpoints) Decode(r *http.Request, v interface{}) error {
	return json.NewDecoder(r.Body).Decode(v)
}

func (o *Endpoints) getLocalInfo(w http.ResponseWriter, r *http.Request) {
	if !o.conf.IsDevelopment() {
		o.Respond(w, nil, http.StatusUnauthorized)
		return
	}
	if len(developmentLastCreatedSessionTokenStack) == 0 {
		o.Respond(w, nil, http.StatusUnauthorized)
		return
	}
	last := developmentLastCreatedSessionTokenStack[len(developmentLastCreatedSessionTokenStack)-1]
	developmentLastCreatedSessionTokenStack = developmentLastCreatedSessionTokenStack[:len(developmentLastCreatedSessionTokenStack)-1]
	w.Write([]byte(last))
}

func (o *Endpoints) createTestUser(w http.ResponseWriter, r *http.Request, tx *sqlx.Tx) {
	if !o.conf.IsDevelopment() {
		o.Respond(w, nil, http.StatusUnauthorized)
		return
	}
	const letters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
	const n = 10
	var result string
	for i := 0; i < n; i++ {
		letter, err := rand.Int(rand.Reader, big.NewInt(int64(len(letters))))
		if err != nil {
			panic(err)
		}
		result += string(letters[letter.Int64()])
	}

	email := fmt.Sprintf("%s@%s", result, "test.com")
	accountType := r.URL.Query().Get("accountType")
	source := r.URL.Query().Get("utm_source")
	acc := db.AccountPlanType(rune(accountType[0]))
	planId := db.GetAccountPlanIdByIdentifier(o.db, tx, acc)
	userId := db.CreateUserAccount(o.db, tx, &db.UserAccount{
		Name:          util.PString("Test " + result),
		Username:      util.PString(email),
		Email:         util.PString(email),
		EmailVerified: util.PBool(false),
		UserType:      util.PString(accountType),
		Password:      util.PString("autogenerated"),
		PictureUrl:    util.PString(""),
		Locale:        util.PString(""),
		AccountPlanId: planId,
		CreatedDate:   time.Now(),
	})
	planificationId := db.CreatePlanification(o.db, tx, *userId, MyPlanificationReservedName, true)
	db.InsertPlanificationDays(o.db, tx, *planificationId, "01234")
	db.GenerateUserExerciseRm(o.db, tx, *userId)
	o.storeSessionData(w, tx, *userId)

	if source == "btn" {
		w.Write([]byte("/my-planifications"))
		return
	}
	http.Redirect(w, r, *o.conf.AddressUi+"/app"+"/plans", http.StatusFound)
}

func (o *Endpoints) storeSessionData(w http.ResponseWriter, tx *sqlx.Tx, userId int64) {
	//todo: maintain only one session per user per device type.
	sessionID, err := util.GenerateSessionID()
	util.Check(err)
	sessionStore.Write(sessionID, userId)
	db.SaveCreatedActiveSession(o.db, tx, sessionID, userId)
	if o.conf.IsDevelopment() {
		developmentLastCreatedSessionTokenStack = append(developmentLastCreatedSessionTokenStack, sessionID)
	} else {
		http.SetCookie(w, &http.Cookie{
			Name:     "auth_token",
			Value:    sessionID,
			Domain:   ".bos.team",
			MaxAge:   60 * 60 * 24 * 365,
			Expires:  time.Now().Add(1 * time.Hour),
			HttpOnly: true,
			Path:     "/",
			SameSite: http.SameSiteStrictMode,
			Secure:   true,
		})
	}
}

func (o *Endpoints) HandleAuthorization(handlerFunc HandlerTransactional, access ...db.AccountPlanType) HandlerTransactional {
	return func(w http.ResponseWriter, r *http.Request, tx *sqlx.Tx) {
		userId := util.UserId(r)
		plan := db.GetAccountPlanIdentifierByUserId(o.db, tx, userId)

		granted := false
		for _, a := range access {
			if *plan == a {
				granted = true
				break
			}
		}

		if !granted {
			o.Respond(w, "No tenes acceso para realizar esta operacion", http.StatusUnauthorized)
			return
		}
		handlerFunc(w, r.WithContext(context.WithValue(r.Context(), "plan", plan)), tx)
	}
}

func (o *Endpoints) HandleAuthenticated(handlerFunc http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		userId, err := o.retrieveSessionData(r)
		if err != nil {
			o.Respond(w, nil, http.StatusUnauthorized)
			return
		}
		handlerFunc(w, r.WithContext(context.WithValue(r.Context(), "userId", *userId)))
	}
}

func (o *Endpoints) retrieveSessionData(r *http.Request) (*int64, error) {
	if o.conf.IsDevelopment() {
		authHeader := r.Header.Get("Authorization")
		if authHeader == "" {
			return nil, errors.New("no authorization header")
		}

		splitToken := strings.Split(authHeader, "Bearer ")
		if len(splitToken) != 2 {
			return nil, errors.New("no token found")
		}

		token := splitToken[1]
		if token == "" {
			return nil, errors.New("no token found")
		}
		data, err := sessionStore.Read(token)
		if err != nil {
			return nil, err
		}
		return &data, nil
	} else {
		cookie, err := r.Cookie("auth_token")
		if err != nil {
			return nil, err
		}
		data, err := sessionStore.Read(cookie.Value)
		if err != nil {
			return nil, err
		}
		return &data, nil
	}
}

func (o *Endpoints) plan(r *http.Request) *db.AccountPlanType {
	return r.Context().Value("plan").(*db.AccountPlanType)
}

func (o *Endpoints) HandleIPWhiteListing(f http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if o.conf.IsDevelopment() {
			origin := strings.Split(r.RemoteAddr, ":")[0]
			valid := false
			for _, ip := range o.conf.WhiteListedIPs {
				if origin == ip {
					valid = true
					break
				}
			}
			if !valid {
				o.Respond(w, nil, http.StatusUnauthorized)
				return
			}
		}
		f(w, r)
	}
}

type HandlerTransactional func(http.ResponseWriter, *http.Request, *sqlx.Tx)

func (o *Endpoints) HandleTransactional(handlerFunc HandlerTransactional) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		tx, err := o.db.Beginx()
		util.Check(err)
		defer func() {
			err = tx.Commit()
			if err != nil && !(err.Error() == "sql: transaction has already been committed or rolled back") {
				util.Check(err)
			}
		}()
		defer func() {
			if e := recover(); e != nil {
				if rollbackErr := tx.Rollback(); rollbackErr != nil {
					log.Printf("update failed: %v, unable to back: %v", e, rollbackErr)
				}
				panic(e)
			}
		}()
		handlerFunc(w, r, tx)
	}
}

func (o *Endpoints) HandleOptionsRequest(f http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}
		f(w, r)
	}
}

func (o *Endpoints) HandleAuthenticatedTransactional(handlerFunc HandlerTransactional) http.HandlerFunc {
	return o.HandleOptionsRequest(o.HandleIPWhiteListing(o.HandleFatal(o.HandleAuthenticated(o.HandleTransactional(handlerFunc)))))
}

func (o *Endpoints) HandleFatal(handlerFunc http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		defer func() {
			if e := recover(); e != nil {
				switch e.(type) {
				case *BadRequestResponse:
					o.Respond(w, e, http.StatusBadRequest)
				case util.ValidationErrors:
					o.Respond(w, e, http.StatusBadRequest)
				default:
					util.CheckNoPanic(e.(error))
					o.Respond(w, nil, http.StatusInternalServerError)
				}
			}
		}()

		handlerFunc(w, r)
	}
}

// for testing purposes
func (o *Endpoints) pushNotificationWorks(w http.ResponseWriter, r *http.Request, tx *sqlx.Tx) {
	userId := util.UserId(r)
	reg := regexp.MustCompile(`\(([^)]+)\)`)
	device := reg.FindString(r.Header.Get("User-Agent"))
	key, err := base64.StdEncoding.DecodeString(*o.cryptoConf.VapidDataKey)
	util.Check(err)
	vapiddata, _ := util.Decrypt(db.RetrieveUserDeviceNotifationSubscription(o.db, tx, userId, device), key)
	var sub webpush.Subscription
	util.JsonDecode(&sub, strings.NewReader(vapiddata))

	webpush.SendNotification([]byte("QUESTION_TRAINED_TODAY"), &sub, &webpush.Options{
		//Topic:   "", //check it
		TTL:     60, //secs
		Urgency: "medium",
		VAPID: webpush.VAPID{
			PublicKey: *o.cryptoConf.VapidPublicKey,
			//PrivateKey: *o.conf.VapidPrivateKey,
		},
		//RecordSize: 0,
		//Subscriber: "",
	})
	o.Respond(w, nil, http.StatusOK)
}

//func (o *Endpoints) signUp(w http.ResponseWriter, r *http.Request, tx *sqlx.Tx) {
//	var request SignUpRequest
//	err := json.NewDecoder(r.Body).Decode(&request)
//	util.CheckErr(err)
//	//create user
//	//o.storeSessionData(w, userId)
//}

//func (o *Endpoints) signIn(w http.ResponseWriter, r *http.Request, tx *sqlx.Tx) {
//	var request SignInRequest
//	err := json.NewDecoder(r.Body).Decode(&request)
//	util.CheckErr(err)
//	userId := db.GetUserIdByUserName(o.db, tx, *request.Username)
//	o.storeSessionData(w, userId)
//	w.WriteHeader(http.StatusOK)
//}
