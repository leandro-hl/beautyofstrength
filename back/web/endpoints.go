package main

import (
	"context"
	"encoding/base64"
	"encoding/json"
	"errors"
	"github.com/gorilla/mux"
	"github.com/jmoiron/sqlx"
	"github.com/leandro-hl/beautyofstrength/back/db"
	"github.com/leandro-hl/beautyofstrength/back/util"
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
)

type Endpoints struct {
	db   *sqlx.DB
	conf *Config
	r    *mux.Router
}

func NewEndpoints(conf *Config) *Endpoints {
	return &Endpoints{
		db:   db.InitDB(*conf.DatasourceName),
		conf: conf,
		r:    mux.NewRouter().PathPrefix("/api").Subrouter(),
	}
}

func (o *Endpoints) Handle() http.Handler {
	o.r.Path("/signUp").HandlerFunc(o.HandleIPWhiteListing(o.HandleFatal(o.HandleTransactional(o.signUp))))
	o.r.Path("/signIn").HandlerFunc(o.HandleIPWhiteListing(o.HandleFatal(o.HandleTransactional(o.signIn))))

	//Profesor services
	o.r.Path("/listExercises").HandlerFunc(o.HandleAuthenticatedTransactional(o.listExercises))
	o.r.Path("/saveExercisesBlock").HandlerFunc(o.HandleAuthenticatedTransactional(o.saveExercisesBlock))

	//Student services
	o.r.Path("/saveUserTrainedToday").HandlerFunc(o.HandleAuthenticatedTransactional(o.saveUserTrainedToday))
	o.r.Path("/getUserLoadedTrainingToday").HandlerFunc(o.HandleAuthenticatedTransactional(o.getUserLoadedTrainingToday))

	//General Services
	o.r.Path("/serveImage").HandlerFunc(o.HandleAuthenticatedTransactional(o.serveImage))
	o.r.Path("/retrieveVapidPublicKey").HandlerFunc(o.HandleAuthenticatedTransactional(o.retrieveVapidPublicKey))
	o.r.Path("/saveUserDevicePushNotificationSubscription").HandlerFunc(o.HandleAuthenticatedTransactional(o.saveUserDevicePushNotificationSubscription))
	o.r.Path("/testPushNotificationWorks").HandlerFunc(o.HandleAuthenticatedTransactional(o.testPushNotificationWorks))
	return o.r
}

func (o *Endpoints) listExercises(w http.ResponseWriter, r *http.Request, tx *sqlx.Tx) {
	exercises := db.ListExercises(tx)
	o.Respond(w, exercises, http.StatusOK)
}

func (o *Endpoints) saveExercisesBlock(w http.ResponseWriter, r *http.Request, tx *sqlx.Tx) {
	t := SaveExercisesBlockRequest{}
	err := o.Decode(r, &t)
	util.Check(err)

	exercises := make([]db.ExerciseBlockGroup, 0)
	for _, e := range t.Exercises {
		exercises = append(exercises, db.ExerciseBlockGroup{
			ExerciseId: e.Id,
			Reps:       e.Reps,
		})
	}
	db.SaveExercisesBlock(tx, *t.Laps, *t.LapRest.Interval, *t.ExeRest.Interval, exercises)
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
}

func (o *Endpoints) saveUserTrainedToday(w http.ResponseWriter, r *http.Request, tx *sqlx.Tx) {
	t := SaveUserTrainedToday{}
	err := o.Decode(r, &t)
	util.Check(err)
	userId := util.UserId(r)
	db.SaveUserTrainedToday(tx, userId, t.Answer)
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

func (o *Endpoints) testPushNotificationWorks(w http.ResponseWriter, r *http.Request, tx *sqlx.Tx) {
	/*
		8. NOTIF 1:
			1. QUESTION_TRAINED_TODAY
			2. “Hola! Entrenaste Hoy”? Botones SI / NO
			3. Guardar la respuesta del usuario en la db.
			4. Configurar el horario en el que se envia la notification.
				1. A las 21HS Argentina.
					1. GOOD TO HAVE (Por la noche seguro. Podría ser después de la ultima clase configurada por el entrenador, para ese dia)
	*/

	/*
	 const subscription = req.body.subscription;
	    const payload = req.body.payload;
	    const options = {
	      TTL: req.body.ttl,
	    };

	    setTimeout(function () {
	      webPush
	        .sendNotification(subscription, payload, options)
	        .then(function () {
	          res.sendStatus(201);
	        })
	        .catch(function (error) {
	          console.log(error);
	          res.sendStatus(500);
	        });
	    }, req.body.delay * 1000);
	*/
	//userId := util.UserId(r)
	//reg := regexp.MustCompile(`\(([^)]+)\)`)
	//device := reg.FindString(r.Header.Get("User-Agent"))
	//key, err := base64.StdEncoding.DecodeString(*o.conf.VapidDataKey)
	//util.Check(err)
	//vapiddata, _ := util.Decrypt(db.RetrieveUserDeviceNotifationSubscription(tx, userId, device), key)
	//var sub webpush.Subscription
	//util.JsonDecode(&sub, strings.NewReader(vapiddata))
	//
	//webpush.SendNotification([]byte("QUESTION_TRAINED_TODAY"), &sub, &webpush.Options{
	//	//Topic:   "", //check it
	//	TTL:     60, //secs
	//	Urgency: "medium",
	//	VAPID: webpush.VAPID{
	//		PublicKey:  *o.conf.VapidPublicKey,
	//		PrivateKey: *o.conf.VapidPrivateKey,
	//	},
	//	//RecordSize: 0,
	//	//Subscriber: "",
	//})
	//w.WriteHeader(http.StatusOK)
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
			//log
		}
	}
}

func (o *Endpoints) Decode(r *http.Request, v interface{}) error {
	return json.NewDecoder(r.Body).Decode(v)
}

// todo: this will be Redis
type SessionManager struct {
	s         map[string]int64
	a         sync.Mutex
	lastAdded string
}

func (o *SessionManager) Read(token string) int64 {
	o.a.Lock()
	defer o.a.Unlock()
	//todo should be token in prod
	id, ok := o.s[o.lastAdded]
	if !ok {
		panic("Invalid session token")
	}
	return id
}

func (o *SessionManager) Write(token string, id int64) {
	o.a.Lock()
	defer o.a.Unlock()
	id, ok := o.s[token]
	if !ok {
		panic("Invalid session token")
	}
}

func NewSessionManager() *SessionManager {
	return &SessionManager{
		s: make(map[string]int64),
		a: sync.Mutex{},
	}
}

var sessionStore = NewSessionManager()

func (o *Endpoints) signUp(w http.ResponseWriter, r *http.Request, tx *sqlx.Tx) {
	var request SignUpRequest
	err := json.NewDecoder(r.Body).Decode(&request)
	util.CheckErr(err)

	//todo: validate that the user does not already exists?
	//create user
	//o.storeSessionCookie(w, userId)
}

func (o *Endpoints) signIn(w http.ResponseWriter, r *http.Request, tx *sqlx.Tx) {
	var request SignInRequest
	err := json.NewDecoder(r.Body).Decode(&request)
	util.CheckErr(err)

	//todo: validate user credentials
	userId := db.GetUserIdByUserName(tx, *request.Username)

	o.storeSessionCookie(w, userId)
	w.WriteHeader(http.StatusOK)
}

func (o *Endpoints) storeSessionCookie(w http.ResponseWriter, userId int64) {
	sessionID, err := util.GenerateSessionID()
	util.CheckErr(err)
	sessionStore.Write(sessionID, userId)
	//http.SetCookie(w, &http.Cookie{
	//	Name:   "custom_session_token",
	//	Value:  "sessionID",
	//	Domain: "localhost",
	//	MaxAge: 60 * 60 * 24 * 365,
	//	//Expires: time.Now().Add(1 * time.Hour),
	//	//HttpOnly: true,
	//	//Domain: "localhost:3000",
	//	//Path: "/",
	//	//SameSite: http.SameSiteLaxMode,
	//	//Secure: false,
	//})

	//if strings.HasPrefix(route, "http://localhost") {
	//	http.SetCookie(w, &http.Cookie{
	//		Name:   optimizelySessionKey,
	//		Value:  uuid.New().String(),
	//		Path:   "/",
	//		Domain: "localhost",
	//		MaxAge: 60 * 60 * 24 * 365,
	//	})
	//} else {
	//	http.SetCookie(w, &http.Cookie{
	//		Name:   optimizelySessionKey,
	//		Value:  uuid.New().String(),
	//		Path:   "/",
	//		Secure: true,
	//		Domain: xHost,
	//		MaxAge: 60 * 60 * 24 * 365,
	//	})
	//}
}

func (o *Endpoints) HandleAuthorization(handlerFunc http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		//get user type and permissions
		//if !ok -> status.Unathotizer
		handlerFunc(w, r)
	}
}

func (o *Endpoints) HandleAuthenticated(handlerFunc http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		//todo: fix cookie shit
		//data, err := o.retrieveSessionData(r)
		//if err != nil {
		//	http.Redirect(w, r, "/login", http.StatusSeeOther)
		//	return
		//}

		//todo: check the user exists? Also: should be retrieveSessionData()
		userId := sessionStore.Read("")
		handlerFunc(w, r.WithContext(context.WithValue(r.Context(), "userId", userId)))
	}
}

func (o *Endpoints) retrieveSessionData(r *http.Request) *int64 {
	cookie, err := r.Cookie("custom_session_token")
	util.Check(err)

	data := sessionStore.Read(cookie.Value)
	return &data
}

func (o *Endpoints) HandleIPWhiteListing(f http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		origin := strings.Split(r.RemoteAddr, ":")[0]
		phoneIP := "192.168.0.42"
		androidPhoneIP := "192.168.0.114"
		macIP := *o.conf.Address
		if origin != "127.0.0.1" && origin != phoneIP && origin != macIP && origin != androidPhoneIP {
			panic("error")
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
			if e := recover(); e != nil {
				if rollbackErr := tx.Rollback(); rollbackErr != nil {
					log.Fatalf("update failed: %v, unable to back: %v", err, rollbackErr)
				}
				panic(e)
			}
		}()
		handlerFunc(w, r, tx)
	}
}

func (o *Endpoints) HandleAuthenticatedTransactional(handlerFunc HandlerTransactional) http.HandlerFunc {
	return o.HandleIPWhiteListing(o.HandleFatal(o.HandleAuthenticated(o.HandleTransactional(handlerFunc))))
}

func (o *Endpoints) HandleFatal(handlerFunc http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		defer func() {
			if e := recover(); e != nil {
				switch e.(type) {
				case util.ValidationErrors:
					o.Respond(w, e, http.StatusBadRequest)
				default:
					o.Respond(w, e, http.StatusInternalServerError)
				}
			}
		}()

		handlerFunc(w, r)
	}
}
