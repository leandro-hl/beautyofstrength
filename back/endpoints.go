package main

import (
	"encoding/json"
	"errors"
	"github.com/gorilla/mux"
	"github.com/jmoiron/sqlx"
	"mime/multipart"
	"net/http"
	"os"
	"path/filepath"
	"sort"
	"strconv"
	"strings"
)

type Endpoints struct {
	db *sqlx.DB
	r  *mux.Router
}

func NewEndpoints() *Endpoints {
	return &Endpoints{
		db: InitDB(),
		r:  mux.NewRouter().PathPrefix("/api").Subrouter(),
	}
}

func (o *Endpoints) Handle() http.Handler {
	o.r.Path("/signUp").HandlerFunc(o.HandleIPWhiteListing(o.HandleTransactional(o.signUp)))

	//Profesor services
	o.r.Path("/listExercises").HandlerFunc(o.HandleAuthenticatedTransactional(o.listExercises))
	o.r.Path("/saveExercisesBlock").HandlerFunc(o.HandleAuthenticatedTransactional(o.saveExercisesBlock))

	//Student services
	o.r.Path("/serveImage").HandlerFunc(o.HandleAuthenticatedTransactional(o.serveImage))
	return o.r
}

func (o *Endpoints) listExercises(w http.ResponseWriter, r *http.Request, tx *sqlx.Tx) {
	exercises := listExercises(tx)
	o.Respond(w, exercises, http.StatusOK)
}

func (o *Endpoints) saveExercisesBlock(w http.ResponseWriter, r *http.Request, tx *sqlx.Tx) {
	t := SaveExercisesBlockRequest{}
	err := o.Decode(r, &t)
	Check(err)
	saveExercisesBlock(tx, t)
}

func (o *Endpoints) signUp(w http.ResponseWriter, r *http.Request, tx *sqlx.Tx) {
	var request SignUpRequest
	err := json.NewDecoder(r.Body).Decode(&request)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	token := "exampleToken"
	response := &SignUpResponse{
		Token: &token,
	}

	err = json.NewEncoder(w).Encode(response)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
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
	Check(err)

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

func (o *Endpoints) HandleAuthenticated(handlerFunc http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		//TODO: AUTH
		//usr, pss, ok := r.BasicAuth()
		//
		//if !ok {
		//	w.WriteHeader(http.StatusUnauthorized)
		//	return
		//}
		//
		//ok = true //o.s.UserIsValid(usr, pss)
		//
		//if usr != pss {
		//	w.WriteHeader(http.StatusInternalServerError)
		//	return
		//}
		//
		//if !ok {
		//	w.WriteHeader(http.StatusUnauthorized)
		//	return
		//}

		handlerFunc(w, r)
	}
}

func (o *Endpoints) HandleIPWhiteListing(f http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		origin := strings.Split(r.RemoteAddr, ":")[0]
		phoneIP := "192.168.0.42"
		macIP := "192.168.0.131"
		if origin != phoneIP && origin != macIP {
			panic("error")
		}

		f(w, r)
	}
}

type HandlerTransactional func(http.ResponseWriter, *http.Request, *sqlx.Tx)

func (o *Endpoints) HandleTransactional(handlerFunc HandlerTransactional) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		tx, err := o.db.Beginx()

		Check(err)

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
				case ValidationErrors:
					o.Respond(w, e, http.StatusBadRequest)
				default:
					o.Respond(w, e, http.StatusInternalServerError)
				}
			}
		}()

		handlerFunc(w, r)
	}
}
