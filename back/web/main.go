package main

import (
	"context"
	"flag"
	"github.com/gorilla/handlers"
	"github.com/leandro-hl/beautyofstrength/back/util"
	"log"
	"net/http"
	"os"
	"os/signal"
	"time"
)

type Config struct {
	VapidPublicKey *string `json:"vapidPublicKey"`
	//VapidPrivateKey *string `json:"vapidPrivateKey"`
	VapidDataKey                     *string  `json:"vapidDataKey"`
	DatasourceName                   *string  `json:"datasourceName"`
	AllowedOrigins                   []string `json:"allowedOrigins"`
	Address                          *string  `json:"address"`
	CustomExercisesPerUserLimit      *int     `json:"customExercisesPerUserLimit"`
	CustomExerciseNameCharacterLimit *int     `json:"customExerciseNameCharacterLimit"`
}

func main() {
	confSpec := util.FlagString("conf", "back/web/conf.json", "Config")
	flag.Parse()

	config := Config{}
	util.LoadConfig(*confSpec, &config)
	//config.Validate()
	/*db := postgres.InitDB()
	//postgres.Deploy(db)
	postgres.PatchByGit(db)*/
	l := log.New(os.Stdout, "api:", log.LstdFlags)

	o := NewEndpoints(&config)

	headers := handlers.AllowedHeaders([]string{"ngrok-skip-browser-warning", "Content-type", "Accept", "Content-Length", "Accept-Encoding", "X-CSRF-Token", "Authorization"})
	origins := handlers.AllowedOrigins(config.AllowedOrigins)
	methods := handlers.AllowedMethods([]string{"GET", "HEAD", "POST", "PUT", "OPTIONS"})
	s := &http.Server{
		Addr:         *config.Address,
		Handler:      handlers.CORS(headers, origins, methods)(o.Handle()),
		ErrorLog:     l,
		ReadTimeout:  5 * time.Second,
		WriteTimeout: 10 * time.Second,
		IdleTimeout:  120 * time.Second, // Max time for connections using TCP keep-alive.
	}

	// Start server
	go func() {
		l.Println("Starting server at port 3001...")

		//err := s.ListenAndServeTLS("cert.pem", "key_no_pass.pem")
		err := s.ListenAndServe()

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
