package main

import (
	"context"
	"crypto/rsa"
	"encoding/json"
	"flag"
	"github.com/golang-jwt/jwt"
	"github.com/gorilla/handlers"
	"github.com/leandro-hl/beautyofstrength/back/util"
	"log"
	"net/http"
	"os"
	"os/signal"
	"strings"
	"time"
)

type Config struct {
	VapidPublicKey *string `json:"vapidPublicKey"`
	//VapidPrivateKey *string `json:"vapidPrivateKey"`
	VapidDataKey                         *string         `json:"vapidDataKey"`
	LinkSharingKey                       *string         `json:"linkSharingKey"`
	LinkSharingExpirationDays            *int            `json:"linkSharingExpirationDays"`
	DatasourceName                       *string         `json:"datasourceName"`
	AllowedOrigins                       []string        `json:"allowedOrigins"`
	Address                              *string         `json:"address"`
	AddressUi                            *string         `json:"addressUi"`
	WhiteListedIPs                       []string        `json:"whiteListedIPs"`
	CustomExercisesPerUserLimit          *int            `json:"customExercisesPerUserLimit"`
	CustomExerciseNameCharacterLimit     *int            `json:"customExerciseNameCharacterLimit"`
	ExercisesPerBlockLimit               *int            `json:"exercisesPerBlockLimit"`
	StudentFreeAccountRoutineBlocksLimit *int            `json:"studentFreeAccountRoutineBlocksLimit"`
	GoogleClientId                       *string         `json:"googleClientId"`
	GooglePEMCertsURL                    *string         `json:"googlePEMCertsUrl"`
	GoogleTokenValidIssuers              map[string]bool `json:"googleTokenValidIssuers"`
	GooglePEMPublicKeys                  map[string]*rsa.PublicKey
}

func (o *Config) IsDevelopment() bool {
	return strings.HasPrefix(*o.Address, "http://localhost")
}

func (o *Config) Validate() {
}

func main() {
	env := os.Getenv("ENV")
	var config Config
	if env == "PROD" {
		confStr := os.Getenv("CONFIG")
		err := json.Unmarshal([]byte(confStr), &config)
		util.Check(err)
	} else {
		confSpec := util.FlagString("conf", "back/web/conf.json", "Config")
		flag.Parse()
		util.LoadConfig(*confSpec, &config)
	}
	config.Validate()
	l := log.New(os.Stdout, "app:", log.LstdFlags)

	func() {
		req, err := http.NewRequest(http.MethodGet, *config.GooglePEMCertsURL, nil)
		util.Check(err)
		res, err := http.DefaultClient.Do(req)
		util.Check(err)
		defer res.Body.Close()

		var v map[string]string
		json.NewDecoder(res.Body).Decode(&v)
		config.GooglePEMPublicKeys = make(map[string]*rsa.PublicKey, 0)
		for id, k := range v {
			key, err := jwt.ParseRSAPublicKeyFromPEM([]byte(k))
			util.Check(err)
			config.GooglePEMPublicKeys[id] = key
		}
	}()

	o := NewEndpoints(&config)
	allowedHeaders := []string{"Content-type", "Accept", "Content-Length", "Accept-Encoding", "X-CSRF-Token", "Authorization"}
	if config.IsDevelopment() {
		allowedHeaders = append(allowedHeaders, "ngrok-skip-browser-warning")
	}

	headers := handlers.AllowedHeaders(allowedHeaders)
	origins := handlers.AllowedOrigins(config.AllowedOrigins)
	methods := handlers.AllowedMethods([]string{"GET", "HEAD", "POST", "PUT", "OPTIONS"})
	s := &http.Server{
		Addr:         strings.TrimPrefix(*config.Address, "http://"),
		Handler:      handlers.CORS(headers, origins, methods)(o.Handle()),
		ErrorLog:     l,
		ReadTimeout:  5 * time.Second,
		WriteTimeout: 10 * time.Second,
		IdleTimeout:  120 * time.Second, // Max time for connections using TCP keep-alive.
	}

	// Start server
	go func() {
		l.Println("Starting server.")

		var err error
		err = s.ListenAndServe()
		//if config.IsDevelopment() {
		//	err = s.ListenAndServe()
		//} else {
		//	err = s.ListenAndServeTLS("cert.pem", "key_no_pass.pem")
		//}

		if err != nil {
			l.Printf("Error starting server: %s\n", err)
			os.Exit(1)
		}
	}()

	// trap sigterm or interrupt and gracefully shutdown the server
	// buffered channel with capacity for 1 event
	c := make(chan os.Signal, 1)

	// Channel listens for Interrupt or Kill events
	signal.Notify(c, os.Interrupt)
	signal.Notify(c, os.Kill)

	// Block until a signal is received.
	sig := <-c
	log.Println("Got signal: ", sig)

	// Gracefully shutdown the server, waiting max 30 seconds for the current operations to complete.
	ctx, _ := context.WithTimeout(context.Background(), 30*time.Second)
	s.Shutdown(ctx)
}
