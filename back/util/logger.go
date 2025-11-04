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
	"os"
	"time"

	"github.com/rs/zerolog"
	"github.com/rs/zerolog/log"
)

// Logger wraps zerolog for application-wide structured logging
type Logger struct {
	logger zerolog.Logger
}

// NewLogger creates a new logger instance
func NewLogger(isDevelopment bool) *Logger {
	// Configure zerolog for human-readable output in development
	if isDevelopment {
		log.Logger = log.Output(zerolog.ConsoleWriter{
			Out:        os.Stdout,
			TimeFormat: time.RFC3339,
		})
	} else {
		// JSON output for production
		zerolog.TimeFieldFormat = zerolog.TimeFormatUnix
	}

	// Set global log level
	zerolog.SetGlobalLevel(zerolog.InfoLevel)

	return &Logger{
		logger: log.Logger,
	}
}

// WithComponent returns a logger with a component field
func (l *Logger) WithComponent(component string) *Logger {
	return &Logger{
		logger: l.logger.With().Str("component", component).Logger(),
	}
}

// WithRequestID returns a logger with a request ID field
func (l *Logger) WithRequestID(requestID string) *Logger {
	return &Logger{
		logger: l.logger.With().Str("request_id", requestID).Logger(),
	}
}

// WithUserID returns a logger with a user ID field
func (l *Logger) WithUserID(userID int64) *Logger {
	return &Logger{
		logger: l.logger.With().Int64("user_id", userID).Logger(),
	}
}

// Debug logs a debug message
func (l *Logger) Debug(msg string, fields ...map[string]interface{}) {
	event := l.logger.Debug()
	if len(fields) > 0 {
		event = event.Fields(fields[0])
	}
	event.Msg(msg)
}

// Info logs an info message
func (l *Logger) Info(msg string, fields ...map[string]interface{}) {
	event := l.logger.Info()
	if len(fields) > 0 {
		event = event.Fields(fields[0])
	}
	event.Msg(msg)
}

// Warn logs a warning message
func (l *Logger) Warn(msg string, fields ...map[string]interface{}) {
	event := l.logger.Warn()
	if len(fields) > 0 {
		event = event.Fields(fields[0])
	}
	event.Msg(msg)
}

// Error logs an error message
func (l *Logger) Error(msg string, err error, fields ...map[string]interface{}) {
	event := l.logger.Error().Err(err)
	if len(fields) > 0 {
		event = event.Fields(fields[0])
	}
	event.Msg(msg)
}

// Fatal logs a fatal message and exits
func (l *Logger) Fatal(msg string, err error, fields ...map[string]interface{}) {
	event := l.logger.Fatal().Err(err)
	if len(fields) > 0 {
		event = event.Fields(fields[0])
	}
	event.Msg(msg)
}

// Panic logs a panic message and panics
func (l *Logger) Panic(msg string, err error, fields ...map[string]interface{}) {
	event := l.logger.Panic().Err(err)
	if len(fields) > 0 {
		event = event.Fields(fields[0])
	}
	event.Msg(msg)
}
