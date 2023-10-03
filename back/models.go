package main

type Exercise struct {
	Id   *int    `json:"id"`
	Name *string `json:"name"`
}

type BlockGroup struct {
	Id              *int    `json:"id"`
	Name            *string `json:"name"`
	Laps            *int    `json:"laps"`
	LapRestInterval *int    `json:"lapRestInterval"`
	ExeRestInterval *int    `json:"exeRestInterval"`
}

type ExerciseBlockGroup struct {
	Id           *int64 `json:"id"`
	BlockGroupId *int64 `json:"blockgroup_id"`
	ExerciseId   *int   `json:"exercise_id"`
	Reps         *int   `json:"reps"`
}
