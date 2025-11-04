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
	"errors"
	"testing"
)

func TestCheckValidation(t *testing.T) {
	tests := []struct {
		name      string
		check     bool
		errorMsg  string
		wantPanic bool
	}{
		{
			name:      "valid check passes",
			check:     true,
			errorMsg:  "should not panic",
			wantPanic: false,
		},
		{
			name:      "invalid check panics",
			check:     false,
			errorMsg:  "validation failed",
			wantPanic: true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			defer func() {
				r := recover()
				if (r != nil) != tt.wantPanic {
					t.Errorf("CheckValidation() panic = %v, wantPanic %v", r != nil, tt.wantPanic)
				}
				if r != nil {
					if err, ok := r.(error); ok {
						if err.Error() != tt.errorMsg {
							t.Errorf("CheckValidation() panic message = %v, want %v", err.Error(), tt.errorMsg)
						}
					}
				}
			}()

			CheckValidation(tt.check, tt.errorMsg)
		})
	}
}

func TestCheckValidations(t *testing.T) {
	tests := []struct {
		name      string
		checks    []bool
		errorMsgs []string
		wantPanic bool
	}{
		{
			name:      "all valid checks pass",
			checks:    []bool{true, true, true},
			errorMsgs: []string{"error1", "error2", "error3"},
			wantPanic: false,
		},
		{
			name:      "first invalid check panics",
			checks:    []bool{false, true, true},
			errorMsgs: []string{"error1", "error2", "error3"},
			wantPanic: true,
		},
		{
			name:      "middle invalid check panics",
			checks:    []bool{true, false, true},
			errorMsgs: []string{"error1", "error2", "error3"},
			wantPanic: true,
		},
		{
			name:      "empty checks passes",
			checks:    []bool{},
			errorMsgs: []string{},
			wantPanic: false,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			defer func() {
				r := recover()
				if (r != nil) != tt.wantPanic {
					t.Errorf("CheckValidations() panic = %v, wantPanic %v", r != nil, tt.wantPanic)
				}
			}()

			CheckValidations(tt.checks, tt.errorMsgs)
		})
	}
}

func TestCheck(t *testing.T) {
	tests := []struct {
		name      string
		err       error
		wantPanic bool
	}{
		{
			name:      "nil error does not panic",
			err:       nil,
			wantPanic: false,
		},
		{
			name:      "non-nil error panics",
			err:       errors.New("test error"),
			wantPanic: true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			defer func() {
				r := recover()
				if (r != nil) != tt.wantPanic {
					t.Errorf("Check() panic = %v, wantPanic %v", r != nil, tt.wantPanic)
				}
			}()

			Check(tt.err)
		})
	}
}
