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
	"context"
	"errors"
	"fmt"
	"strconv"
	"time"

	"github.com/redis/go-redis/v9"
)

// RedisSessionStore is a Redis-backed session store that persists sessions
type RedisSessionStore struct {
	client     *redis.Client
	ctx        context.Context
	expiration time.Duration
}

// NewRedisSessionStore creates a new Redis-backed session store
func NewRedisSessionStore(addr string, password string, db int, expiration time.Duration) (*RedisSessionStore, error) {
	client := redis.NewClient(&redis.Options{
		Addr:     addr,
		Password: password,
		DB:       db,
	})

	ctx := context.Background()

	// Test connection
	if err := client.Ping(ctx).Err(); err != nil {
		return nil, fmt.Errorf("failed to connect to Redis: %w", err)
	}

	return &RedisSessionStore{
		client:     client,
		ctx:        ctx,
		expiration: expiration,
	}, nil
}

// Read retrieves the user ID associated with a session token
func (r *RedisSessionStore) Read(token string) (int64, error) {
	val, err := r.client.Get(r.ctx, r.sessionKey(token)).Result()
	if err == redis.Nil {
		return -1, errors.New("invalid session token")
	}
	if err != nil {
		return -1, fmt.Errorf("failed to read session: %w", err)
	}

	userID, err := strconv.ParseInt(val, 10, 64)
	if err != nil {
		return -1, fmt.Errorf("invalid session data: %w", err)
	}

	// Refresh expiration on read
	r.client.Expire(r.ctx, r.sessionKey(token), r.expiration)

	return userID, nil
}

// Write stores a session token with the associated user ID
func (r *RedisSessionStore) Write(token string, id int64) {
	r.client.Set(r.ctx, r.sessionKey(token), id, r.expiration)
}

// Revoke removes a session token
func (r *RedisSessionStore) Revoke(token string) {
	r.client.Del(r.ctx, r.sessionKey(token))
}

// Close closes the Redis connection
func (r *RedisSessionStore) Close() error {
	return r.client.Close()
}

// sessionKey generates the Redis key for a session token
func (r *RedisSessionStore) sessionKey(token string) string {
	return fmt.Sprintf("session:%s", token)
}

// LoadSessionsFromDB loads active sessions from the database into Redis
// This is useful for migrating from in-memory to Redis or on startup
func (r *RedisSessionStore) LoadSessionsFromDB(sessions []struct {
	Token         *string
	UserAccountId *int64
}) {
	for _, s := range sessions {
		if s.Token != nil && s.UserAccountId != nil {
			r.Write(*s.Token, *s.UserAccountId)
		}
	}
}

// SessionStoreInterface defines the interface that both in-memory and Redis stores implement
type SessionStoreInterface interface {
	Read(token string) (int64, error)
	Write(token string, id int64)
	Revoke(token string)
}

// Verify that both implementations satisfy the interface
var _ SessionStoreInterface = (*SessionManager)(nil)
var _ SessionStoreInterface = (*RedisSessionStore)(nil)
