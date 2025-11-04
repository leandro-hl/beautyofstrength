// Copyright 2025 Leandro Herenu - BOS (Beauty Of Strength)
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

package main

import (
	"encoding/json"
	"net/http"
	"time"
)

const (
	// Version should be updated with each release
	Version = "0.1.0"
	// BuildDate should ideally be set during build with -ldflags
	BuildDate = "2025-01-04"
)

type HealthResponse struct {
	Status    string    `json:"status"`
	Timestamp time.Time `json:"timestamp"`
	Database  string    `json:"database"`
}

type VersionResponse struct {
	Version   string `json:"version"`
	BuildDate string `json:"buildDate"`
	GoVersion string `json:"goVersion"`
}

// health handles health check requests
// Returns 200 OK if the service is running and database is accessible
func (o *Endpoints) health(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	// Check database connectivity
	dbStatus := "ok"
	err := o.db.Ping()
	if err != nil {
		dbStatus = "error"
		w.WriteHeader(http.StatusServiceUnavailable)
	} else {
		w.WriteHeader(http.StatusOK)
	}

	response := HealthResponse{
		Status:    dbStatus,
		Timestamp: time.Now(),
		Database:  dbStatus,
	}

	json.NewEncoder(w).Encode(response)
}

// version handles version information requests
// Returns the current version and build information
func (o *Endpoints) version(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)

	response := VersionResponse{
		Version:   Version,
		BuildDate: BuildDate,
		GoVersion: "1.20",
	}

	json.NewEncoder(w).Encode(response)
}
