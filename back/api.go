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

func saveUserDevicePushNotificationSubscription(tx *sqlx.Tx, userId int64, vapiddata string, deviceName string) {
	var userDeviceId int64
	err := tx.Get(&userDeviceId, "select id from userdevice where useraccount_id = $1 and name = $2", userId, deviceName)
	if err == nil {
		tx.Exec("update userdevice set vapiddata = $1 where id = $2", vapiddata, userDeviceId)
	} else if err.Error() == "sql: no rows in result set" {
		Insert(tx, &UserDevice{
			Name:          &deviceName,
			VapidData:     &vapiddata,
			UserAccountId: &userId,
		})
	}
	err = tx.Commit()
	Check(err)
}

func retrieveUserDeviceNotifationSubscription(tx *sqlx.Tx, userId int64, deviceName string) string {
	var subscription string
	err := tx.Get(&subscription, "select vapiddata from userdevice where useraccount_id = $1 and name = $2", userId, deviceName)
	Check(err)
	return subscription
}
