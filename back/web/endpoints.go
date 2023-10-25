package main

import (
	"context"
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

type Endpoints struct {
	db   *sqlx.DB
	conf *Config
	r    *mux.Router
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

func (o *ExercisesComparerCache) FilterExercisesByIds(exs []ExerciseRequest) (yes []ExerciseRequest, no []ExerciseRequest) {
	o.a.Lock()
	defer o.a.Unlock()
	yes = make([]ExerciseRequest, 0)
	no = make([]ExerciseRequest, 0)
	for _, k := range exs {
		if _, ok := o.s2[*k.Id]; ok {
			yes = append(yes, k)
		} else {
			no = append(no, k)
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
		panic("Invalid token")
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
var shareManager = NewShareTokenManager()
var developmentLastCreatedSessionTokenStack = make([]string, 0)

func NewEndpoints(conf *Config) *Endpoints {
	dbs := db.InitDB(*conf.DatasourceName)

	exercisesNames := db.ListExerciseNames(dbs)
	for _, e := range exercisesNames {
		exercisesComparerCache.Add(*e.Id, *e.Name)
	}

	return &Endpoints{
		db:   dbs,
		conf: conf,
		r:    mux.NewRouter(),
	}
}

func (o *Endpoints) Handle() http.Handler {
	api := o.r.PathPrefix("/api").Subrouter()
	//todo: para speech de venta: routines up to 20 exercises per block! (how many blocks?) LOL. Buy more exercises by $$$$
	//o.r.Path("/signUp").HandlerFunc(o.HandleIPWhiteListing(o.HandleFatal(o.HandleTransactional(o.signUp))))
	//o.r.Path("/signIn").HandlerFunc(o.HandleIPWhiteListing(o.HandleFatal(o.HandleTransactional(o.signIn))))
	//o.r.Path("/testPushNotificationWorks").HandlerFunc(o.HandleAuthenticatedTransactional(o.HandleAuthorization(o.testPushNotificationWorks, db.Professor)))
	api.Path("/getLocalInfo").HandlerFunc(o.HandleOptionsRequest(o.HandleIPWhiteListing(o.HandleFatal(o.getLocalInfo))))
	api.Path("/googlesignin").HandlerFunc(o.HandleOptionsRequest(o.HandleIPWhiteListing(o.HandleFatal(o.HandleTransactional(o.googleSignIn)))))

	//Profesor services (all premium)
	api.Path("/createPlanification").HandlerFunc(o.HandleAuthenticatedTransactional(o.HandleAuthorization(o.createPlanification, db.Professor)))

	//Student services
	//free tier
	//premium tier
	//both
	api.Path("/saveUserTrainedToday").HandlerFunc(o.HandleAuthenticatedTransactional(o.HandleAuthorization(o.saveUserTrainedToday, db.StudentFree, db.StudentPremium)))
	api.Path("/getUserLoadedTrainingToday").HandlerFunc(o.HandleAuthenticatedTransactional(o.HandleAuthorization(o.getUserLoadedTrainingToday, db.StudentFree, db.StudentPremium)))

	//General Services
	//o.r.Path("/serveImage").HandlerFunc(o.HandleAuthenticatedTransactional(o.serveImage))
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
	api.Path("/getRoutineDetails").HandlerFunc(o.HandleAuthenticatedTransactional(o.HandleAuthorization(o.getRoutineDetails, db.StudentFree, db.StudentPremium, db.Professor)))
	api.Path("/getUserAccountDetails").HandlerFunc(o.HandleAuthenticatedTransactional(o.HandleAuthorization(o.getUserAccountDetails, db.StudentFree, db.StudentPremium, db.Professor)))

	//ui
	if !o.conf.IsDevelopment() {
		o.r.PathPrefix("/").Handler(http.FileServer(http.Dir("ui/build")))
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
		permissions["createOneRoutine"] = true
		permissions["editRoutinesICreated"] = true
		permissions["executeRoutine"] = true
		permissions["listPlanifications"] = true
		permissions["menuplanifications"] = true
		permissions["listExercises"] = true
	}

	if *plan == db.StudentFree || *plan == db.StudentPremium {
		permissions["menustatistics"] = true
		permissions["menuhomestudent"] = true
	}

	if *plan == db.StudentPremium || *plan == db.Professor {
		permissions["createManyRoutines"] = true
		permissions["createManyExerciseBlocks"] = true
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
	user := db.GetUserAccountDetails(tx, userId)
	o.Respond(w, user, http.StatusOK)
}

func (o *Endpoints) getRoutineDetails(w http.ResponseWriter, r *http.Request, tx *sqlx.Tx) {
	routineId, err := strconv.ParseInt(r.URL.Query().Get("routineId"), 10, 64)
	util.Check(err)

	userId := util.UserId(r)
	result := db.GetRoutineDetails(tx, routineId, userId)
	res := &GetRoutineDetailsResponse{Id: result[0].Routineid, Name: result[0].Routinename, Blocks: make([]GetRoutineDetailsBlock, 0)}

	lastBlockId := int64(0)
	var block *GetRoutineDetailsBlock
	for _, r := range result {
		if *r.Blockgroupid != lastBlockId {
			lastBlockId = *r.Blockgroupid
			if block != nil {
				res.Blocks = append(res.Blocks, *block)
			}
			block = &GetRoutineDetailsBlock{
				Id:              r.Blockgroupid,
				Name:            r.Blockgroupname,
				Duration:        r.BlockDuration,
				Type:            r.Type,
				Laps:            r.Laps,
				Exerestinterval: r.Exerestinterval,
				Laprestinterval: r.Laprestinterval,
				Exercises: []GetRoutineDetailsBlockExercise{
					{Name: r.Exercisename, Secs: r.Secs, Reps: r.Reps},
				},
			}
		} else {
			block.Exercises = append(block.Exercises, GetRoutineDetailsBlockExercise{Name: r.Exercisename, Secs: r.Secs, Reps: r.Reps})
		}
	}
	//last block
	res.Blocks = append(res.Blocks, *block)

	o.Respond(w, &res, http.StatusOK)
}

func (o *Endpoints) getSharedRoutineDetails(w http.ResponseWriter, r *http.Request, tx *sqlx.Tx) {
	shareEncrypted := r.URL.Query().Get("share")
	if shareEncrypted != "" {
		decoded, err := base64.RawURLEncoding.DecodeString(shareEncrypted)
		util.Check(err)
		key, err := base64.StdEncoding.DecodeString(*o.conf.LinkSharingKey)
		util.Check(err)
		decrypted, err := util.Decrypt(string(decoded), key)
		util.Check(err)
		var t ShareEncrypted
		err = json.Unmarshal([]byte(decrypted), &t)
		util.Check(err)

		metaData := db.GetUserSharingToken(tx, t.PlanificationId, t.RoutineId, t.CreatorId)

		if metaData.Creationdate.Add(time.Hour * time.Duration(*o.conf.LinkSharingExpirationDays) * 24).Before(time.Now()) {
			db.InvalidateSharingTokenForRoutine(tx, t.PlanificationId, t.RoutineId, t.CreatorId)
			o.Respond(w, nil, http.StatusUnauthorized)
		} else {
			result := db.GetRoutineDetails(tx, t.RoutineId, t.CreatorId)
			res := &GetRoutineDetailsResponse{Id: result[0].Routineid, Name: result[0].Routinename, Blocks: make([]GetRoutineDetailsBlock, 0)}

			lastBlockId := int64(0)
			var block *GetRoutineDetailsBlock
			for _, r := range result {
				if *r.Blockgroupid != lastBlockId {
					lastBlockId = *r.Blockgroupid
					if block != nil {
						res.Blocks = append(res.Blocks, *block)
					}
					block = &GetRoutineDetailsBlock{
						Id:              r.Blockgroupid,
						Name:            r.Blockgroupname,
						Duration:        r.BlockDuration,
						Type:            r.Type,
						Laps:            r.Laps,
						Exerestinterval: r.Exerestinterval,
						Laprestinterval: r.Laprestinterval,
						Exercises: []GetRoutineDetailsBlockExercise{
							{Name: r.Exercisename, Secs: r.Secs, Reps: r.Reps},
						},
					}
				} else {
					block.Exercises = append(block.Exercises, GetRoutineDetailsBlockExercise{Name: r.Exercisename, Secs: r.Secs, Reps: r.Reps})
				}
			}
			//last block
			res.Blocks = append(res.Blocks, *block)

			o.Respond(w, &res, http.StatusOK)
		}
	} else {
		o.Respond(w, nil, http.StatusUnauthorized)
	}
}

func (o *Endpoints) listRoutines(w http.ResponseWriter, r *http.Request, tx *sqlx.Tx) {
	planificationId, err := strconv.ParseInt(r.URL.Query().Get("planificationId"), 10, 64)
	util.Check(err)
	o.Respond(w, db.ListRoutines(tx, planificationId), http.StatusOK)
}

func (o *Endpoints) listPlanifications(w http.ResponseWriter, r *http.Request, tx *sqlx.Tx) {
	userId := util.UserId(r)
	//todo: use a Response struct to not expose db data.
	o.Respond(w, db.ListPlanifications(tx, userId), http.StatusOK)
}

func (o *Endpoints) listExercises(w http.ResponseWriter, r *http.Request, tx *sqlx.Tx) {
	exercises := db.ListExercises(tx)
	//todo: use a Response struct to not expose db data.
	o.Respond(w, exercises, http.StatusOK)
}

func (o *Endpoints) saveExerciseBlockValidations(r *http.Request, tx *sqlx.Tx, routineId, planificationId *int64, exercises []ExerciseRequest) ([]ExerciseRequest, *int64) {
	userId := util.UserId(r)
	plan := o.plan(r)

	if !db.CalculateUserOwnsPlanification(tx, userId, *planificationId) {
		panic("Unauthorized to modify the requested planification")
	}

	if len(exercises) == 0 || len(exercises) > *o.conf.ExercisesPerBlockLimit {
		panic(fmt.Sprintf("You cannot add more than %d to an exercises block", *o.conf.ExercisesPerBlockLimit))
	}

	if routineId == nil {
		last := db.CountRoutinesInPlanification(tx, *planificationId)
		if *plan == db.StudentFree && *last > 0 {
			panic("Free accounts cannot have more than one routine")
		}
		routineId = db.CreateRoutine(tx, fmt.Sprintf("Dia %d", *last+1), *planificationId)
	} else {
		if !db.CalculateUserOwnsRoutine(tx, userId, *planificationId, *routineId) {
			panic("Unauthorized to modify the requested routine")
		}

		blocks := db.CalculateRoutineBlocksAmount(tx, *routineId)
		if *plan == db.StudentFree && blocks >= *o.conf.StudentFreeAccountRoutineBlocksLimit {
			panic(fmt.Sprintf("You cannot add more than %d exercise blocks to a routine with a free account", *o.conf.StudentFreeAccountRoutineBlocksLimit))
		}
	}

	exercisesToAddToBlock, nonExistingExerciseNames := exercisesComparerCache.FilterExercisesByIds(exercises)

	if *plan == db.Professor {
		exerciseNamesComparer := make([]ExerciseComparer, 0)
		sanitizedKeys := make([]string, 0)
		re := regexp.MustCompile(`[^a-zA-Z0-9]`)
		for _, e := range nonExistingExerciseNames {
			if len(*e.Name) > *o.conf.CustomExerciseNameCharacterLimit {
				//not supported
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
		for i, ex := range nonExistingExercises {
			if !*ex.ShouldCreate {
				for _, ex2 := range nonExistingExercises[0:i] {
					if *ex2.SanitizedKey == *ex.SanitizedKey {
						*ex.ExerciseRequest.Name = *ex2.SanitizedName
						*ex.ExerciseRequest.Id = *ex2.Id
						exercisesToAddToBlock = append(exercisesToAddToBlock, ex.ExerciseRequest)
						break
					}
				}

				continue
			}
			count := db.CountExercisesCreatedByUser(tx, userId)
			if *count > *o.conf.CustomExercisesPerUserLimit {
				panic("No puedes crear mas ejercicios nuevos.")
			}
			exerciseId := db.CreateExercise(tx, *ex.SanitizedName, userId)
			*ex.ExerciseRequest.Name = *ex.SanitizedName
			*ex.ExerciseRequest.Id = *exerciseId
			exercisesToAddToBlock = append(exercisesToAddToBlock, ex.ExerciseRequest)
			exercisesComparerCache.Add(*exerciseId, *ex.SanitizedName)
		}
	}

	return exercisesToAddToBlock, routineId
}

func (o *Endpoints) saveExercisesBlockFree(w http.ResponseWriter, r *http.Request, tx *sqlx.Tx) {
	t := SaveExercisesBlockFreeRequest{}
	err := o.Decode(r, &t)
	util.Check(err)

	validExercises, routineId := o.saveExerciseBlockValidations(r, tx, t.RoutineId, t.PlanificationId, t.Exercises)
	exercises := make([]db.ExerciseBlockGroup, 0)
	for _, e := range validExercises {
		if e.Type != nil && *e.Type == "sec" {
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
	db.SaveExercisesBlock(tx, *routineId, "cpt", *t.BlockName, nil, t.Laps, t.RestingInteval, t.ExeRestingInteval, exercises)
	o.Respond(w, &SaveExercisesBlockCptResponse{RoutineId: routineId}, http.StatusOK)
}

func (o *Endpoints) saveExercisesBlockCpt(w http.ResponseWriter, r *http.Request, tx *sqlx.Tx) {
	t := SaveExercisesBlockCptRequest{}
	err := o.Decode(r, &t)
	util.Check(err)

	validExercises, routineId := o.saveExerciseBlockValidations(r, tx, t.RoutineId, t.PlanificationId, t.Exercises)
	exercises := make([]db.ExerciseBlockGroup, 0)
	for _, e := range validExercises {
		exercises = append(exercises, db.ExerciseBlockGroup{
			ExerciseId: e.Id,
			Secs:       t.WorkingInterval,
		})
	}
	db.SaveExercisesBlock(tx, *routineId, "cpt", *t.BlockName, nil, t.Laps, t.RestingInteval, t.RestingInteval, exercises)
	o.Respond(w, &SaveExercisesBlockCptResponse{RoutineId: routineId}, http.StatusOK)
}

func (o *Endpoints) saveExercisesBlockAmrap(w http.ResponseWriter, r *http.Request, tx *sqlx.Tx) {
	t := SaveExercisesBlockAmrapRequest{}
	err := o.Decode(r, &t)
	util.Check(err)

	validExercises, routineId := o.saveExerciseBlockValidations(r, tx, t.RoutineId, t.PlanificationId, t.Exercises)
	exercises := make([]db.ExerciseBlockGroup, 0)
	for _, e := range validExercises {
		exercises = append(exercises, db.ExerciseBlockGroup{
			ExerciseId: e.Id,
			Reps:       e.Reps,
		})
	}
	db.SaveExercisesBlock(tx, *routineId, "amrap", *t.BlockName, t.BlockDuration, nil, nil, nil, exercises)
	o.Respond(w, &SaveExercisesBlockAmrapResponse{RoutineId: routineId}, http.StatusOK)
}

func (o *Endpoints) saveExercisesBlockCombo(w http.ResponseWriter, r *http.Request, tx *sqlx.Tx) {
	t := SaveExercisesBlockComboRequest{}
	err := o.Decode(r, &t)
	util.Check(err)

	validExercises, routineId := o.saveExerciseBlockValidations(r, tx, t.RoutineId, t.PlanificationId, t.Exercises)
	exercises := make([]db.ExerciseBlockGroup, 0)
	for _, e := range validExercises {
		exercises = append(exercises, db.ExerciseBlockGroup{
			ExerciseId: e.Id,
		})
	}
	db.SaveExercisesBlock(tx, *routineId, "cbo", *t.BlockName, nil, t.Laps, nil, nil, exercises)
	o.Respond(w, &SaveExercisesBlockComboResponse{RoutineId: routineId}, http.StatusOK)
}

func (o *Endpoints) saveExerciseBlockPir(w http.ResponseWriter, r *http.Request, tx *sqlx.Tx) {
	t := SaveExercisesBlockPirRequest{}
	err := o.Decode(r, &t)
	util.Check(err)

	validExercises, routineId := o.saveExerciseBlockValidations(r, tx, t.RoutineId, t.PlanificationId, t.Exercises)
	exercises := make([]db.ExerciseBlockGroup, 0)
	for _, e := range validExercises {
		exercises = append(exercises, db.ExerciseBlockGroup{
			ExerciseId: e.Id,
			Reps:       e.Reps,
		})
	}
	db.SaveExercisesBlock(tx, *routineId, "pir", *t.BlockName, nil, t.Laps, nil, nil, exercises)
	o.Respond(w, &SaveExercisesBlockPirResponse{RoutineId: routineId}, http.StatusOK)
}

func (o *Endpoints) createPlanification(w http.ResponseWriter, r *http.Request, tx *sqlx.Tx) {
	t := CreatePlanificationRequest{}
	err := o.Decode(r, &t)
	util.Check(err)

	userId := util.UserId(r)
	id := db.CreatePlanification(tx, userId, *t.Name)
	o.Respond(w, &CreatePlanificationResponse{Id: id}, http.StatusOK)
}

func (o *Endpoints) retrieveVapidPublicKey(w http.ResponseWriter, r *http.Request, tx *sqlx.Tx) {
	w.Write([]byte(*o.conf.VapidPublicKey))
}

func (o *Endpoints) saveUserDevicePushNotificationSubscription(w http.ResponseWriter, r *http.Request, tx *sqlx.Tx) {
	t := SaveUserDevicePushNotificationSubscriptionRequest{}
	err := o.Decode(r, &t)
	util.Check(err)

	userId := util.UserId(r)
	reg := regexp.MustCompile(`\(([^)]+)\)`)
	device := reg.FindString(r.Header.Get("User-Agent"))

	key, err := base64.StdEncoding.DecodeString(*o.conf.VapidDataKey)
	util.Check(err)

	encrypted, err := util.Encrypt(*t.Subscription, key)
	util.Check(err)
	db.SaveUserDevicePushNotificationSubscription(tx, userId, encrypted, device)
	o.Respond(w, nil, http.StatusOK)
}

func (o *Endpoints) saveUserTrainedToday(w http.ResponseWriter, r *http.Request, tx *sqlx.Tx) {
	t := SaveUserTrainedTodayRequest{}
	err := o.Decode(r, &t)
	util.Check(err)
	userId := util.UserId(r)
	db.SaveUserTrainedToday(tx, userId, t.Answer)
	o.Respond(w, nil, http.StatusOK)
}

func (o *Endpoints) getUserLoadedTrainingToday(w http.ResponseWriter, r *http.Request, tx *sqlx.Tx) {
	userId := util.UserId(r)
	trained := db.GetUserLoadedTrainingToday(tx, userId)
	o.Respond(w, &struct {
		Loaded *bool `json:"loaded"`
	}{
		Loaded: &trained,
	}, http.StatusOK)
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
		panic("No CSRF token in post body")
	}

	if csrfTokenCookie.Value != csrfTokenPayload {
		panic("Failed to verify double submit cookie")
	}

	jwtToken := dataMap["credential"]
	token, err := jwt.ParseWithClaims(jwtToken, &util.GoogleAuthClaims{}, func(token *jwt.Token) (interface{}, error) {
		keyId := token.Header["kid"].(string)
		return o.conf.GooglePEMPublicKeys[keyId], nil
	}, jwt.WithAudience(*o.conf.GoogleClientId))
	util.Check(err)

	if !token.Valid {
		panic("Invalid Token")
	}

	claims := token.Claims.(*util.GoogleAuthClaims)

	exp, err := claims.GetExpirationTime()
	util.Check(err)

	if time.Now().After(exp.Time) {
		panic("Invalid Token")
	}

	iss, err := claims.GetIssuer()
	util.Check(err)
	if _, ok = o.conf.GoogleTokenValidIssuers[iss]; !ok {
		panic("Invalid Token")
	}

	userId := db.GetUserIdByUserNameNoError(tx, claims.Email)
	if userId != nil {
		o.storeSessionData(w, *userId)
		plan := db.GetAccountPlanIdentifierByUserId(tx, *userId)
		if plan == nil {
			http.Redirect(w, r, *o.conf.AddressUi+"/plans", http.StatusFound)
		} else if *plan == db.StudentFree {
			http.Redirect(w, r, *o.conf.AddressUi+"/student", http.StatusFound)
		} else if *plan == db.StudentPremium {
			http.Redirect(w, r, *o.conf.AddressUi+"/student", http.StatusFound)
		} else if *plan == db.Professor {
			http.Redirect(w, r, *o.conf.AddressUi+"/professor", http.StatusFound)
		} else {
			http.Redirect(w, r, *o.conf.AddressUi+"/plans", http.StatusFound)
		}
	} else {
		//todo: auto generate a password and send it over email
		planId := db.GetAccountPlanIdByIdentifier(tx, db.StudentFree)
		userId = db.CreateUserAccount(tx, &db.UserAccount{
			Name:          util.PString(claims.Name),
			Username:      util.PString(claims.Email),
			Email:         util.PString(claims.Email),
			EmailVerified: util.PBool(claims.EmailVerified),
			UserType:      util.PString(string(db.StudentFree)),
			Password:      util.PString("autogenerated"),
			PictureUrl:    util.PString(claims.PictureUrl),
			Locale:        util.PString(claims.Locale),
			AccountPlanId: planId,
		})
		db.CreatePlanification(tx, *userId, "Mi Planificacion")
		o.storeSessionData(w, *userId)
		http.Redirect(w, r, *o.conf.AddressUi+"/plans", http.StatusFound)
	}
}

func (o *Endpoints) shareRoutine(w http.ResponseWriter, r *http.Request, tx *sqlx.Tx) {
	t := ShareRoutineRequest{}
	err := o.Decode(r, &t)
	util.Check(err)
	userId := util.UserId(r)
	if db.GetUserCreatedTheRoutine(tx, *t.PlanificationId, *t.RoutineId, userId) {
		db.InvalidateSharingTokenForRoutine(tx, *t.PlanificationId, *t.RoutineId, userId)
		key, err := base64.StdEncoding.DecodeString(*o.conf.LinkSharingKey)
		util.Check(err)
		str, err := json.Marshal(ShareEncrypted{
			RoutineId:       *t.RoutineId,
			PlanificationId: *t.PlanificationId,
			CreatorId:       userId,
		})
		util.Check(err)

		encrypted, err := util.Encrypt(string(str), key)
		util.Check(err)

		db.SaveUserSharingToken(tx, *t.PlanificationId, *t.RoutineId, userId)
		o.Respond(w, fmt.Sprintf("/routine?share=%s", base64.RawURLEncoding.EncodeToString([]byte(encrypted))), http.StatusOK)
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

func (o *Endpoints) storeSessionData(w http.ResponseWriter, userId int64) {
	sessionID, err := util.GenerateSessionID()
	util.Check(err)
	sessionStore.Write(sessionID, userId)
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
		plan := db.GetAccountPlanIdentifierByUserId(tx, userId)

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
	key, err := base64.StdEncoding.DecodeString(*o.conf.VapidDataKey)
	util.Check(err)
	vapiddata, _ := util.Decrypt(db.RetrieveUserDeviceNotifationSubscription(tx, userId, device), key)
	var sub webpush.Subscription
	util.JsonDecode(&sub, strings.NewReader(vapiddata))

	webpush.SendNotification([]byte("QUESTION_TRAINED_TODAY"), &sub, &webpush.Options{
		//Topic:   "", //check it
		TTL:     60, //secs
		Urgency: "medium",
		VAPID: webpush.VAPID{
			PublicKey: *o.conf.VapidPublicKey,
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
//	userId := db.GetUserIdByUserName(tx, *request.Username)
//	o.storeSessionData(w, userId)
//	w.WriteHeader(http.StatusOK)
//}
