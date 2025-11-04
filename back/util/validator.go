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
	"fmt"
	"strings"

	"github.com/go-playground/validator/v10"
)

// Validator wraps the go-playground validator for request validation
type Validator struct {
	validate *validator.Validate
}

// ValidationError represents a field validation error
type ValidationError struct {
	Field   string `json:"field"`
	Message string `json:"message"`
	Tag     string `json:"tag"`
	Value   interface{} `json:"value,omitempty"`
}

// ValidationErrors is a collection of validation errors
type ValidationErrors struct {
	Errors []ValidationError `json:"errors"`
}

// Error implements the error interface
func (v ValidationErrors) Error() string {
	var messages []string
	for _, err := range v.Errors {
		messages = append(messages, fmt.Sprintf("%s: %s", err.Field, err.Message))
	}
	return strings.Join(messages, "; ")
}

// NewValidator creates a new validator instance
func NewValidator() *Validator {
	v := validator.New()

	// Register custom validators here if needed
	// v.RegisterValidation("custom", customValidatorFunc)

	return &Validator{
		validate: v,
	}
}

// ValidateStruct validates a struct and returns user-friendly errors
func (v *Validator) ValidateStruct(s interface{}) error {
	err := v.validate.Struct(s)
	if err == nil {
		return nil
	}

	validationErrors, ok := err.(validator.ValidationErrors)
	if !ok {
		return err
	}

	var errors []ValidationError
	for _, fieldErr := range validationErrors {
		errors = append(errors, ValidationError{
			Field:   fieldErr.Field(),
			Message: v.formatErrorMessage(fieldErr),
			Tag:     fieldErr.Tag(),
			Value:   fieldErr.Value(),
		})
	}

	return ValidationErrors{Errors: errors}
}

// formatErrorMessage returns a human-readable error message
func (v *Validator) formatErrorMessage(fe validator.FieldError) string {
	field := fe.Field()

	switch fe.Tag() {
	case "required":
		return fmt.Sprintf("%s is required", field)
	case "email":
		return fmt.Sprintf("%s must be a valid email address", field)
	case "min":
		return fmt.Sprintf("%s must be at least %s characters", field, fe.Param())
	case "max":
		return fmt.Sprintf("%s must be at most %s characters", field, fe.Param())
	case "len":
		return fmt.Sprintf("%s must be exactly %s characters", field, fe.Param())
	case "gte":
		return fmt.Sprintf("%s must be greater than or equal to %s", field, fe.Param())
	case "lte":
		return fmt.Sprintf("%s must be less than or equal to %s", field, fe.Param())
	case "gt":
		return fmt.Sprintf("%s must be greater than %s", field, fe.Param())
	case "lt":
		return fmt.Sprintf("%s must be less than %s", field, fe.Param())
	case "alpha":
		return fmt.Sprintf("%s must contain only letters", field)
	case "alphanum":
		return fmt.Sprintf("%s must contain only letters and numbers", field)
	case "numeric":
		return fmt.Sprintf("%s must be a number", field)
	case "url":
		return fmt.Sprintf("%s must be a valid URL", field)
	case "uri":
		return fmt.Sprintf("%s must be a valid URI", field)
	case "oneof":
		return fmt.Sprintf("%s must be one of [%s]", field, fe.Param())
	default:
		return fmt.Sprintf("%s failed validation on '%s'", field, fe.Tag())
	}
}

// ValidateVar validates a single variable
func (v *Validator) ValidateVar(field interface{}, tag string) error {
	return v.validate.Var(field, tag)
}

// Common validation helpers

// ValidateEmail validates an email address
func ValidateEmail(email string) error {
	v := NewValidator()
	return v.ValidateVar(email, "required,email")
}

// ValidateRequired validates that a field is not empty
func ValidateRequired(field interface{}, fieldName string) error {
	v := NewValidator()
	err := v.ValidateVar(field, "required")
	if err != nil {
		return fmt.Errorf("%s is required", fieldName)
	}
	return nil
}

// ValidateLength validates string length
func ValidateLength(str string, min, max int, fieldName string) error {
	v := NewValidator()
	tag := fmt.Sprintf("min=%d,max=%d", min, max)
	err := v.ValidateVar(str, tag)
	if err != nil {
		return fmt.Errorf("%s must be between %d and %d characters", fieldName, min, max)
	}
	return nil
}

// ValidateRange validates a numeric value is within a range
func ValidateRange(val interface{}, min, max int, fieldName string) error {
	v := NewValidator()
	tag := fmt.Sprintf("gte=%d,lte=%d", min, max)
	err := v.ValidateVar(val, tag)
	if err != nil {
		return fmt.Errorf("%s must be between %d and %d", fieldName, min, max)
	}
	return nil
}

// ValidateOneOf validates that a value is one of the allowed values
func ValidateOneOf(val, allowedValues, fieldName string) error {
	v := NewValidator()
	tag := fmt.Sprintf("oneof=%s", allowedValues)
	err := v.ValidateVar(val, tag)
	if err != nil {
		return fmt.Errorf("%s must be one of: %s", fieldName, allowedValues)
	}
	return nil
}
