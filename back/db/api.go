package db

import (
	"github.com/jmoiron/sqlx"
	"github.com/leandro-hl/beautyofstrength/back/util"
	"time"
)

func ListPlanifications(tx *sqlx.Tx, userId int64) []Planification {
	dest := make([]Planification, 0)

	err := tx.Select(&dest, `
		select p.* from planification p
		inner join userplanification u on p.id = u.planification_id
		where u.useraccount_id = $1`, userId)
	util.Check(err)

	return dest
}

func GetRoutineDetails(tx *sqlx.Tx, routineId int64) []GetRoutineDetailsQuery {
	dest := make([]GetRoutineDetailsQuery, 0)

	err := tx.Select(&dest, `
		select
			r.id routineid,
			r.name routinename,
			b.id blockgroupid,
			b.name blockgroupname,
			b.duration blockgroupduration,
			b.laps,
			b.type,
			b.exerestinterval,
			b.laprestinterval,
			eb.reps,
			eb.secs,
			e.name exercisename
			from routine r
		inner join blockgroup b on r.id = b.routine_id
		inner join exerciseblockgroup eb on b.id = eb.blockgroup_id
		inner join exercise e on e.id = eb.exercise_id
		where r.id=$1
		order by b.id, eb.id;`, routineId)
	util.Check(err)

	return dest
}

func ListRoutines(tx *sqlx.Tx, planificationId int64) []Routine {
	dest := make([]Routine, 0)

	err := tx.Select(&dest, `
		select r.* from routine r 
		inner join planification p on r.planification_id = p.id
		where p.id = $1
		order by r.id`, planificationId)
	util.Check(err)

	return dest
}

func ListExercises(tx *sqlx.Tx) []Exercise {
	var dest []Exercise

	err := tx.Select(&dest, `SELECT * FROM exercise ORDER BY name, id`)
	util.Check(err)

	return dest
}

func CountRoutinesInPlanification(tx *sqlx.Tx, planificationId int64) *int {
	var des int
	tx.Get(&des, "select count(1) from routine where planification_id=$1", planificationId)
	return &des
}

func CreateRoutine(tx *sqlx.Tx, name string, planificationId int64) *int64 {
	id := Insert(
		tx,
		&Routine{
			Name:            &name,
			PlanificationId: &planificationId,
		})
	return id
}

func SaveExercisesBlock(tx *sqlx.Tx, routineId int64, blockType, name string, duration, laps, lapRestInterval, exeRestInterval *int, exercises []ExerciseBlockGroup) *int64 {
	id := Insert(
		tx,
		&BlockGroup{
			Name:            &name,
			Duration:        duration,
			Laps:            laps,
			Type:            &blockType,
			LapRestInterval: lapRestInterval,
			ExeRestInterval: exeRestInterval,
			RoutineId:       &routineId,
		})

	for _, ex := range exercises {
		Insert(
			tx,
			&ExerciseBlockGroup{
				BlockGroupId: id,
				ExerciseId:   ex.ExerciseId,
				Reps:         ex.Reps,
				Secs:         ex.Secs,
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
