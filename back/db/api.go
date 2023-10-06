package db

import (
	"github.com/jmoiron/sqlx"
	"github.com/leandro-hl/beautyofstrength/back/util"
	"time"
)

func ListExercises(tx *sqlx.Tx) []Exercise {
	var dest []Exercise

	err := tx.Select(&dest, `SELECT * FROM exercise ORDER BY name`)
	util.Check(err)

	return dest
}

func SaveExercisesBlock(tx *sqlx.Tx, laps, lapRestInterval, exeRestInterval int, exercises []ExerciseBlockGroup) *int64 {
	id := Insert(
		tx,
		&BlockGroup{
			Name:            nil,
			Laps:            &laps,
			LapRestInterval: &lapRestInterval,
			ExeRestInterval: &exeRestInterval,
		})

	for _, ex := range exercises {
		Insert(
			tx,
			&ExerciseBlockGroup{
				BlockGroupId: id,
				ExerciseId:   ex.ExerciseId,
				Reps:         ex.Reps,
			})
	}

	err := tx.Commit()
	util.Check(err)
	return id
}

func SaveUserDevicePushNotificationSubscription(tx *sqlx.Tx, userId int64, vapiddata string, deviceName string) {
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
	util.Check(err)
}

func SaveUserTrainedToday(tx *sqlx.Tx, userId int64, answer bool) {
	Insert(tx, &UserTrainingHistory{
		Date:          time.Now(),
		Answer:        &answer,
		UserAccountId: &userId,
	})
	err := tx.Commit()
	util.Check(err)
}

func GetUserLoadedTrainingToday(tx *sqlx.Tx, userId int64) bool {
	var lastTime time.Time
	tx.Get(&lastTime, "select date from usertraininghistory where useraccount_id=$1 order by id desc limit 1", userId)
	lastYear, lastMonth, lastDay := lastTime.Date()
	year, month, day := time.Now().Date()
	return lastYear == year && lastMonth == month && lastDay == day
}

func GetUserIdByUserName(tx *sqlx.Tx, userName string) int64 {
	var userId int64
	err := tx.Get(&userId, "select id from useraccount where username=$1", userName)
	util.Check(err)
	return userId
}

func RetrieveUserDeviceNotifationSubscription(tx *sqlx.Tx, userId int64, deviceName string) string {
	var subscription string
	err := tx.Get(&subscription, "select vapiddata from userdevice where useraccount_id = $1 and name = $2", userId, deviceName)
	util.Check(err)
	return subscription
}

func SelectAllUserDeviceSubscriptions(db *sqlx.DB) []UserDevice {
	var subs []UserDevice
	db.Select(&subs, "select * from userdevice")
	return subs
}
