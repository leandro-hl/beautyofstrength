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

package history

import "time"

type Routine struct {
	Id            *int64    `json:"id"`
	UserAccountId *int64    `json:"useraccount_id"`
	RoutineId     *int64    `json:"routine_id"`
	Date          time.Time `json:"date"`
	Rpe           *int      `json:"rpe"`
	Pwr           *int      `json:"pwr"`
}

type Exercise struct {
	Id            *int64    `json:"id"`
	UserAccountId *int64    `json:"useraccount_id"`
	RoutineId     *int64    `json:"routine_id"`
	HistoryId     *int64    `json:"history_id"`
	Date          time.Time `json:"date"`
	ExerciseId    *int64    `json:"exercise_id"`
	Reps          *int      `json:"reps"`
	EffectiveReps *int      `json:"effectivereps"`
	Kg            *int      `json:"kg"`
}
