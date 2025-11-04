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

	"github.com/leandro-hl/beautyofstrength/back/util"
)

// validator is the global validator instance
var validatorInstance = util.NewValidator()

// ValidateRequest validates the request body against a struct with validation tags
// Example usage:
//
//	type CreateExerciseRequest struct {
//	    Name        string `json:"name" validate:"required,min=3,max=100"`
//	    Description string `json:"description" validate:"max=500"`
//	    Complexity  string `json:"complexity" validate:"required,oneof=Beginner Intermediate Advanced"`
//	}
//
//	func (o *Endpoints) createExercise(w http.ResponseWriter, r *http.Request) {
//	    var req CreateExerciseRequest
//	    if !ValidateRequest(w, r, &req) {
//	        return // validation failed, error already sent
//	    }
//	    // proceed with valid request
//	}
func ValidateRequest(w http.ResponseWriter, r *http.Request, target interface{}) bool {
	// Decode JSON body
	if err := json.NewDecoder(r.Body).Decode(target); err != nil {
		writeValidationError(w, http.StatusBadRequest, "Invalid request body: "+err.Error())
		return false
	}

	// Validate struct
	if err := validatorInstance.ValidateStruct(target); err != nil {
		validationErrors, ok := err.(util.ValidationErrors)
		if ok {
			writeValidationErrors(w, validationErrors)
		} else {
			writeValidationError(w, http.StatusBadRequest, err.Error())
		}
		return false
	}

	return true
}

// writeValidationErrors writes structured validation errors as JSON
func writeValidationErrors(w http.ResponseWriter, errors util.ValidationErrors) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusBadRequest)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"error":  "Validation failed",
		"errors": errors.Errors,
	})
}

// writeValidationError writes a simple validation error message
func writeValidationError(w http.ResponseWriter, statusCode int, message string) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(statusCode)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"error": message,
	})
}

// Example validation structs for common endpoints

// GoogleSignInRequest validates Google OAuth sign-in request
type GoogleSignInRequest struct {
	Token string `json:"token" validate:"required"`
}

// CreatePlanificationRequest validates planification creation
type CreatePlanificationRequest struct {
	Name        string `json:"name" validate:"required,min=1,max=100"`
	Description string `json:"description" validate:"max=500"`
}

// CreateExerciseRequest validates exercise creation
type CreateExerciseRequest struct {
	Name       string `json:"name" validate:"required,min=3,max=100"`
	Complexity string `json:"complexity" validate:"required,oneof=Beginner Intermediate Advanced"`
}

// SaveRoutineRequest validates routine save request
type SaveRoutineRequest struct {
	RoutineID int64  `json:"routineId" validate:"required,gt=0"`
	Name      string `json:"name" validate:"required,min=1,max=100"`
}

// SaveRMRequest validates RM (Repetition Maximum) save request
type SaveRMRequest struct {
	ExerciseID int64   `json:"exerciseId" validate:"required,gt=0"`
	RM         float64 `json:"rm" validate:"required,gte=0"`
	Unit       string  `json:"unit" validate:"required,oneof=kg lb"`
}
