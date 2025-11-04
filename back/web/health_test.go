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
	"net/http/httptest"
	"testing"
)

func TestVersionEndpoint(t *testing.T) {
	// Create a mock endpoints instance
	endpoints := &Endpoints{}

	// Create a request
	req, err := http.NewRequest("GET", "/api/version", nil)
	if err != nil {
		t.Fatal(err)
	}

	// Create a ResponseRecorder to record the response
	rr := httptest.NewRecorder()

	// Call the handler
	handler := http.HandlerFunc(endpoints.version)
	handler.ServeHTTP(rr, req)

	// Check status code
	if status := rr.Code; status != http.StatusOK {
		t.Errorf("handler returned wrong status code: got %v want %v", status, http.StatusOK)
	}

	// Check content type
	if contentType := rr.Header().Get("Content-Type"); contentType != "application/json" {
		t.Errorf("handler returned wrong content type: got %v want %v", contentType, "application/json")
	}

	// Parse response
	var response VersionResponse
	if err := json.Unmarshal(rr.Body.Bytes(), &response); err != nil {
		t.Fatalf("could not unmarshal response: %v", err)
	}

	// Check version fields
	if response.Version != Version {
		t.Errorf("handler returned wrong version: got %v want %v", response.Version, Version)
	}

	if response.BuildDate != BuildDate {
		t.Errorf("handler returned wrong build date: got %v want %v", response.BuildDate, BuildDate)
	}

	if response.GoVersion == "" {
		t.Error("handler returned empty GoVersion")
	}
}

func TestHealthEndpoint_WithoutDB(t *testing.T) {
	// Create a mock endpoints instance without database
	endpoints := &Endpoints{}

	// Create a request
	req, err := http.NewRequest("GET", "/api/health", nil)
	if err != nil {
		t.Fatal(err)
	}

	// Create a ResponseRecorder
	rr := httptest.NewRecorder()

	// Call the handler
	handler := http.HandlerFunc(endpoints.health)
	handler.ServeHTTP(rr, req)

	// Check that it doesn't panic even without DB
	// Status should be 503 (Service Unavailable) because DB is nil
	if status := rr.Code; status != http.StatusServiceUnavailable {
		t.Errorf("handler returned wrong status code: got %v want %v", status, http.StatusServiceUnavailable)
	}

	// Check content type
	if contentType := rr.Header().Get("Content-Type"); contentType != "application/json" {
		t.Errorf("handler returned wrong content type: got %v want %v", contentType, "application/json")
	}

	// Parse response
	var response HealthResponse
	if err := json.Unmarshal(rr.Body.Bytes(), &response); err != nil {
		t.Fatalf("could not unmarshal response: %v", err)
	}

	// Check status
	if response.Status != "error" {
		t.Errorf("handler returned wrong status: got %v want %v", response.Status, "error")
	}

	// Check timestamp is set
	if response.Timestamp.IsZero() {
		t.Error("handler returned zero timestamp")
	}
}
