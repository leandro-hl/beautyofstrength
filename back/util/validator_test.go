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

package util

import (
	"testing"
)

type TestStruct struct {
	Email    string `validate:"required,email"`
	Name     string `validate:"required,min=2,max=50"`
	Age      int    `validate:"gte=0,lte=150"`
	Username string `validate:"required,alphanum,min=3,max=20"`
	Website  string `validate:"omitempty,url"`
}

func TestValidatorValidStruct(t *testing.T) {
	v := NewValidator()

	validStruct := TestStruct{
		Email:    "test@example.com",
		Name:     "John Doe",
		Age:      30,
		Username: "johndoe123",
		Website:  "https://example.com",
	}

	err := v.ValidateStruct(validStruct)
	if err != nil {
		t.Errorf("Expected no error for valid struct, got: %v", err)
	}
}

func TestValidatorInvalidEmail(t *testing.T) {
	v := NewValidator()

	invalidStruct := TestStruct{
		Email:    "invalid-email",
		Name:     "John Doe",
		Age:      30,
		Username: "johndoe123",
	}

	err := v.ValidateStruct(invalidStruct)
	if err == nil {
		t.Error("Expected validation error for invalid email")
	}

	validationErrors, ok := err.(ValidationErrors)
	if !ok {
		t.Fatalf("Expected ValidationErrors type, got %T", err)
	}

	if len(validationErrors.Errors) == 0 {
		t.Error("Expected at least one validation error")
	}

	// Check that error contains email field
	found := false
	for _, e := range validationErrors.Errors {
		if e.Field == "Email" {
			found = true
			break
		}
	}
	if !found {
		t.Error("Expected validation error for Email field")
	}
}

func TestValidatorRequiredField(t *testing.T) {
	v := NewValidator()

	invalidStruct := TestStruct{
		Email:    "test@example.com",
		Name:     "", // required but empty
		Age:      30,
		Username: "johndoe123",
	}

	err := v.ValidateStruct(invalidStruct)
	if err == nil {
		t.Error("Expected validation error for required field")
	}
}

func TestValidatorMinMaxLength(t *testing.T) {
	v := NewValidator()

	tests := []struct {
		name      string
		testCase  TestStruct
		wantError bool
	}{
		{
			name: "name too short",
			testCase: TestStruct{
				Email:    "test@example.com",
				Name:     "A", // min 2 characters
				Age:      30,
				Username: "johndoe123",
			},
			wantError: true,
		},
		{
			name: "name too long",
			testCase: TestStruct{
				Email:    "test@example.com",
				Name:     "This is a very long name that exceeds the maximum allowed length",
				Age:      30,
				Username: "johndoe123",
			},
			wantError: true,
		},
		{
			name: "username too short",
			testCase: TestStruct{
				Email:    "test@example.com",
				Name:     "John Doe",
				Age:      30,
				Username: "ab", // min 3 characters
			},
			wantError: true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			err := v.ValidateStruct(tt.testCase)
			if (err != nil) != tt.wantError {
				t.Errorf("ValidateStruct() error = %v, wantError %v", err, tt.wantError)
			}
		})
	}
}

func TestValidateEmail(t *testing.T) {
	tests := []struct {
		name      string
		email     string
		wantError bool
	}{
		{"valid email", "test@example.com", false},
		{"invalid email", "invalid", true},
		{"empty email", "", true},
		{"email without domain", "test@", true},
		{"email without @", "test.example.com", true},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			err := ValidateEmail(tt.email)
			if (err != nil) != tt.wantError {
				t.Errorf("ValidateEmail() error = %v, wantError %v", err, tt.wantError)
			}
		})
	}
}

func TestValidateLength(t *testing.T) {
	tests := []struct {
		name      string
		str       string
		min       int
		max       int
		wantError bool
	}{
		{"valid length", "hello", 2, 10, false},
		{"too short", "a", 2, 10, true},
		{"too long", "this is a very long string", 2, 10, true},
		{"exact min", "ab", 2, 10, false},
		{"exact max", "abcdefghij", 2, 10, false},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			err := ValidateLength(tt.str, tt.min, tt.max, "TestField")
			if (err != nil) != tt.wantError {
				t.Errorf("ValidateLength() error = %v, wantError %v", err, tt.wantError)
			}
		})
	}
}

func TestValidateRange(t *testing.T) {
	tests := []struct {
		name      string
		val       int
		min       int
		max       int
		wantError bool
	}{
		{"within range", 5, 1, 10, false},
		{"below range", 0, 1, 10, true},
		{"above range", 11, 1, 10, true},
		{"exact min", 1, 1, 10, false},
		{"exact max", 10, 1, 10, false},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			err := ValidateRange(tt.val, tt.min, tt.max, "TestField")
			if (err != nil) != tt.wantError {
				t.Errorf("ValidateRange() error = %v, wantError %v", err, tt.wantError)
			}
		})
	}
}

func TestValidationErrorsErrorMethod(t *testing.T) {
	errors := ValidationErrors{
		Errors: []ValidationError{
			{Field: "Email", Message: "Email is required"},
			{Field: "Name", Message: "Name must be at least 2 characters"},
		},
	}

	errMsg := errors.Error()
	if errMsg == "" {
		t.Error("Expected non-empty error message")
	}

	// Check that error message contains field names
	if !contains(errMsg, "Email") || !contains(errMsg, "Name") {
		t.Errorf("Error message should contain field names, got: %s", errMsg)
	}
}

func contains(str, substr string) bool {
	return len(str) >= len(substr) && (str == substr || len(substr) == 0 ||
		(len(str) > 0 && len(substr) > 0 && findSubstring(str, substr)))
}

func findSubstring(str, substr string) bool {
	for i := 0; i <= len(str)-len(substr); i++ {
		if str[i:i+len(substr)] == substr {
			return true
		}
	}
	return false
}
