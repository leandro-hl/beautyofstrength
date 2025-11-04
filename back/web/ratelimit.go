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
	"net/http"
	"sync"
	"time"

	"golang.org/x/time/rate"
)

// RateLimiter manages rate limiting for API requests
type RateLimiter struct {
	visitors map[string]*rate.Limiter
	mu       sync.RWMutex
	r        rate.Limit
	b        int
}

// NewRateLimiter creates a new rate limiter
// r is the rate (requests per second)
// b is the burst size (max requests in a burst)
func NewRateLimiter(r rate.Limit, b int) *RateLimiter {
	return &RateLimiter{
		visitors: make(map[string]*rate.Limiter),
		r:        r,
		b:        b,
	}
}

// GetLimiter returns the rate limiter for a specific IP address
func (rl *RateLimiter) GetLimiter(ip string) *rate.Limiter {
	rl.mu.Lock()
	defer rl.mu.Unlock()

	limiter, exists := rl.visitors[ip]
	if !exists {
		limiter = rate.NewLimiter(rl.r, rl.b)
		rl.visitors[ip] = limiter
	}

	return limiter
}

// CleanupVisitors removes old entries from the visitors map
// This should be called periodically to prevent memory leaks
func (rl *RateLimiter) CleanupVisitors() {
	for {
		time.Sleep(5 * time.Minute)
		rl.mu.Lock()
		// In a production system, you'd track last access time
		// For simplicity, we just clear the map periodically
		rl.visitors = make(map[string]*rate.Limiter)
		rl.mu.Unlock()
	}
}

// Middleware returns an HTTP middleware that enforces rate limiting
func (rl *RateLimiter) Middleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Get the client IP address
		ip := getClientIP(r)

		// Get the limiter for this IP
		limiter := rl.GetLimiter(ip)

		// Check if the request is allowed
		if !limiter.Allow() {
			http.Error(w, "Rate limit exceeded. Please try again later.", http.StatusTooManyRequests)
			return
		}

		// Continue to the next handler
		next.ServeHTTP(w, r)
	})
}

// getClientIP extracts the client IP address from the request
// It checks X-Forwarded-For and X-Real-IP headers first
func getClientIP(r *http.Request) string {
	// Check X-Forwarded-For header
	forwarded := r.Header.Get("X-Forwarded-For")
	if forwarded != "" {
		// X-Forwarded-For can contain multiple IPs, take the first one
		return forwarded
	}

	// Check X-Real-IP header
	realIP := r.Header.Get("X-Real-IP")
	if realIP != "" {
		return realIP
	}

	// Fall back to RemoteAddr
	return r.RemoteAddr
}

// HandleRateLimit is a convenience function for single endpoints
func (o *Endpoints) HandleRateLimit(r rate.Limit, b int, handler http.HandlerFunc) http.HandlerFunc {
	limiter := NewRateLimiter(r, b)

	// Start cleanup goroutine
	go limiter.CleanupVisitors()

	return func(w http.ResponseWriter, req *http.Request) {
		ip := getClientIP(req)
		l := limiter.GetLimiter(ip)

		if !l.Allow() {
			http.Error(w, "Rate limit exceeded. Please try again later.", http.StatusTooManyRequests)
			return
		}

		handler(w, req)
	}
}
