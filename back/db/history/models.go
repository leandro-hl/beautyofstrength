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
