package main

import (
	"github.com/jmoiron/sqlx"
)

func listExercises(tx *sqlx.Tx) []Exercise {
	var dest []Exercise

	err := tx.Select(&dest, `SELECT * FROM exercise ORDER BY name`)
	Check(err)

	return dest
}

func saveExercisesBlock(tx *sqlx.Tx, r SaveExercisesBlockRequest) *int64 {
	id := Insert(
		tx,
		&BlockGroup{
			Name:            nil,
			Laps:            r.Laps,
			LapRestInterval: r.LapRest.Interval,
			ExeRestInterval: r.ExeRest.Interval,
		})

	for _, ex := range r.Exercises {
		Insert(
			tx,
			&ExerciseBlockGroup{
				BlockGroupId: id,
				ExerciseId:   ex.Id,
				Reps:         ex.Reps,
			})
	}

	err := tx.Commit()
	Check(err)
	return id
}
