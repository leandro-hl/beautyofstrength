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
	"io"
	"reflect"
)

const (
	Required = "required"
	Invalid  = "invalid"
)

type ValidationError struct {
	Field string `json:"field"`
	Key   string `json:"key"`
}

type ValidationErrors struct {
	Errors []ValidationError `json:"errors"`
}

type Validation struct {
	IsInvalid func() bool
	Key       string
	Field     string
}

func CheckValidations(validations []Validation) {
	errors := make([]ValidationError, 0)

	for _, v := range validations {
		if v.IsInvalid() {
			errors = append(errors, ValidationError{
				Field: v.Field,
				Key:   v.Key,
			})
		}
	}

	if len(errors) > 0 {
		panic(ValidationErrors{errors})
	}
}

func CheckValidation(isInvalid bool, key string, field string) {
	if isInvalid {
		panic(ValidationError{
			Field: field,
			Key:   key,
		})
	}
}

func RequiredFunc(field interface{}, fieldName string) Validation {
	return Validation{
		IsInvalid: func() bool {
			return reflect.ValueOf(field).IsNil()
		},
		Key:   Required,
		Field: fieldName,
	}
}

// ReadFinished return true if EOF
func ReadFinished(err error) bool {
	return err != nil && err == io.EOF
}
