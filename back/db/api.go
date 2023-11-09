package db

import (
	"github.com/jmoiron/sqlx"
	"github.com/leandro-hl/beautyofstrength/back/util"
	"time"
)

func ListExerciseNames(db *sqlx.DB) []ListExerciseIdName {
	var exercisesNames []ListExerciseIdName
	err := db.Select(&exercisesNames, "select id, name from exercise")
	util.Check(err)
	return exercisesNames
}

func ListMyPlanifications(tx *sqlx.Tx, userId int64) []ListPlanificationsQuery {
	dest := make([]ListPlanificationsQuery, 0)
	err := tx.Select(&dest, `
		select 
		    p.id, 
		    p.name,
			CASE
			WHEN p.creator_id = u.useraccount_id THEN TRUE
			ELSE FALSE
			END as owner,
		    count(r.id) as routinescount
		from planification p
		inner join userplanification u on p.id = u.planification_id
		left join routine r on p.id = r.planification_id
		where u.useraccount_id = $1 
		group by p.id, p.starred, p.name, p.creator_id, u.useraccount_id 
		order by p.starred desc, owner desc, p.name`, userId)
	util.Check(err)
	return dest
}

func GetRoutineHeader(tx *sqlx.Tx, routineId int64, userId int64) *GetRoutineHeaderQuery {
	var dest GetRoutineHeaderQuery
	tx.Get(&dest, `
		select
			r.id routineid,
			r.name routinename,
			count(uh.id) timesmarked
			from routine r
		inner join planification p on p.id = r.planification_id
		inner join userplanification u on r.planification_id = u.planification_id
		left join userroutinehistory uh on r.id = uh.routine_id
		where r.id=$1 and u.useraccount_id=$2
		group by r.id, r.name`, routineId, userId)
	return &dest
}

func GetRoutineDetails(tx *sqlx.Tx, routineId int64, userId int64) []GetRoutineDetailsQuery {
	dest := make([]GetRoutineDetailsQuery, 0)

	err := tx.Select(&dest, `
		select
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
		inner join planification p on p.id = r.planification_id
		inner join userplanification u on r.planification_id = u.planification_id
		left join blockgroup b on r.id = b.routine_id
		left join exerciseblockgroup eb on b.id = eb.blockgroup_id
		left join exercise e on e.id = eb.exercise_id
		where r.id=$1 and u.useraccount_id=$2
		order by b.id, eb.id`, routineId, userId)
	util.Check(err)

	return dest
}

func ListActiveRoutinesICreated(tx *sqlx.Tx, planificationId int64, userId int64) []ListRoutinesQuery {
	dest := make([]ListRoutinesQuery, 0)

	err := tx.Select(&dest, `
		select 
		    r.id, 
		    r.name, 
		    r.planification_id, 
		    count(b.id) as blockcount, 
		    u2.completed from routine r 
		inner join planification p on r.planification_id = p.id
	    inner join blockgroup b on r.id = b.routine_id
		left outer join userroutinehistory u2 on r.id = u2.routine_id and u2.useraccount_id = p.creator_id                                                                 
		where p.id = $1 and p.creator_id=$2
		group by r.id, u2.completed  order by r.id`, planificationId, userId)
	util.Check(err)

	return dest
}

func ListActiveRoutines(tx *sqlx.Tx, planificationId, userId int64) []ListRoutinesQuery {
	dest := make([]ListRoutinesQuery, 0)

	err := tx.Select(&dest, `
		select 
		    r.id, 
		    r.name, 
		    r.planification_id, 
		    count(b.id) as blockcount, 
		    u2.completed from routine r 
		inner join planification p on r.planification_id = p.id
		inner join userplanification u on p.id = u.planification_id
		inner join blockgroup b on r.id = b.routine_id    
		left outer join userroutinehistory u2 on r.id = u2.routine_id and u.useraccount_id = u2.useraccount_id                                                                
		where p.id = $1 and u.useraccount_id = $2
		group by r.id, u2.completed order by r.id`, planificationId, userId)
	util.Check(err)

	return dest
}

func GetPlanificationSchedule(tx *sqlx.Tx, planificationId int64) *PlanificationSchedule {
	var des PlanificationSchedule
	tx.Get(&des, `select * from planificationschedule where planification_id=$1`, planificationId)
	return &des
}

func GetPlanificationScheduleByUser(tx *sqlx.Tx, planificationId, userId int64) *GetPlanificationScheduleQuery {
	var des GetPlanificationScheduleQuery
	tx.Get(&des, `select 
		ps.*,
		u.accessuptoroutine,
		u.accesslastupdated 
		from planificationschedule ps
		inner join userplanification u on ps.planification_id = u.planification_id
		where ps.planification_id=$1 and u.useraccount_id = $2`, planificationId, userId)
	return &des
}

func UpdateUserPlanificationRoutineAccess(tx *sqlx.Tx, planificationId, userId int64, newUpToRoutineAccess int) {
	tx.Exec(`update userplanification 
		set accessuptoroutine=$1, accesslastupdated=now() 
		where planification_id=$2 and useraccount_id=$3`, newUpToRoutineAccess, planificationId, userId)
}

func ListExercises(tx *sqlx.Tx) []ListExercise {
	var dest []ListExercise
	err := tx.Select(&dest, `SELECT e.id, e.name, u.name as createdbyuser FROM exercise e inner join useraccount u on u.id = e.createdbyuser_id  ORDER BY e.name`)
	util.Check(err)
	return dest
}

func ListActiveUserAccountSessions(db *sqlx.DB) []UserAccountSession {
	dest := make([]UserAccountSession, 0)
	err := db.Select(&dest, `SELECT * FROM useraccountsession`)
	util.Check(err)
	return dest
}

func GetUserActiveSession(tx *sqlx.Tx, userId int64) *UserAccountSession {
	var des UserAccountSession
	tx.Get(&des, `SELECT * FROM useraccountsession where useraccount_id=$1`, userId)
	return &des
}

func RemoveActiveSession(tx *sqlx.Tx, userId int64) {
	tx.Exec("delete from useraccountsession where useraccount_id=$1", userId)
}

func SaveCreatedActiveSession(tx *sqlx.Tx, token string, userId int64) *int64 {
	RemoveActiveSession(tx, userId)
	id := Insert(
		tx,
		&UserAccountSession{
			Token:         &token,
			UserAccountId: &userId,
		})
	return id
}

func CountRoutinesInPlanification(tx *sqlx.Tx, planificationId int64) *int {
	var des int
	tx.Get(&des, "select count(1) from routine where planification_id=$1", planificationId)
	return &des
}

func CreateUserAccount(tx *sqlx.Tx, user *UserAccount) *int64 {
	id := Insert(
		tx,
		user)
	return id
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

func CreatePlanification(tx *sqlx.Tx, userId int64, name string) *int64 {
	id := Insert(
		tx,
		&Planification{
			Name:      &name,
			CreatorId: &userId,
		})

	Insert(
		tx,
		&UserPlanification{
			PlanificationId:   id,
			UserAccountId:     &userId,
			AccessUpToRoutine: util.PInt(30),
			AccessLastUpdated: time.Now(),
		})
	return id
}

func SavePlanificationDays(tx *sqlx.Tx, planificationId int64, days string) {
	Insert(
		tx,
		&PlanificationSchedule{
			PlanificationId: &planificationId,
			Days:            &days,
		})
}

func CreateExercise(tx *sqlx.Tx, name string, userAccountId int64) *int {
	id := Insert(
		tx,
		&Exercise{
			Name:                &name,
			TechnicalComplexity: util.PInt(0),
			CreatedByUserId:     &userAccountId,
			CreatedDate:         time.Now(),
		})
	return util.PInt(int(*id))
}

func CountExercisesCreatedByUser(tx *sqlx.Tx, userAccountId int64) *int {
	var des int
	tx.Get(&des, "select count(1) from exercise where createdbyuser_id=$1", userAccountId)
	return &des
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
}

func SaveUserTrainedToday(tx *sqlx.Tx, userId int64, answer bool) {
	Insert(tx, &UserTrainingHistory{
		Date:          time.Now(),
		Answer:        &answer,
		UserAccountId: &userId,
	})
}

func GetUserLoadedTrainingToday(tx *sqlx.Tx, userId int64) bool {
	var lastTime time.Time
	tx.Get(&lastTime, "select date from usertraininghistory where useraccount_id=$1 order by id desc limit 1", userId)
	lastYear, lastMonth, lastDay := lastTime.Date()
	year, month, day := time.Now().Date()
	return lastYear == year && lastMonth == month && lastDay == day
}

func CalculateUserOwnsRoutine(tx *sqlx.Tx, userId, planificationId, routineId int64) bool {
	var des int
	tx.Get(&des, `
	select count(1) from planification p 
    inner join routine r on p.id = r.planification_id 
	where p.creator_id=$1 and r.planification_id=$2 and r.id=$3`, userId, planificationId, routineId)
	return des > 0
}

func CalculateUserOwnsPlanification(tx *sqlx.Tx, userId, planificationId int64) bool {
	var des int
	tx.Get(&des, "select count(1) from planification p where p.creator_id=$1 and p.id=$2", userId, planificationId)
	return des > 0
}

func CalculateRoutineBlocksAmount(tx *sqlx.Tx, routineId int64) int {
	var des int
	tx.Get(&des, `select count(1) from blockgroup where routine_id=$1`, routineId)
	return des
}

func GetUserIdByUserName(tx *sqlx.Tx, userName string) int64 {
	var userId int64
	err := tx.Get(&userId, "select id from useraccount where username=$1", userName)
	util.Check(err)
	return userId
}

func GetUserIdByUserNameNoError(tx *sqlx.Tx, userName string) *int64 {
	var userId *int64
	tx.Get(&userId, "select id from useraccount where username=$1", userName)
	return userId
}

func GetAccountPlanIdByIdentifier(tx *sqlx.Tx, iden AccountPlanType) *int {
	var id *int
	tx.Get(&id, "select id from accountplan where identifier=$1", string(iden))
	return id
}

func GetAccountPlanIdentifierByUserId(tx *sqlx.Tx, userId int64) *AccountPlanType {
	var des string
	tx.Get(&des, `
		select identifier from accountplan
		inner join useraccount u on accountplan.id = u.accountplan_id
	    where u.id=$1`, userId)
	id := AccountPlanType(des[0])
	return &id
}

func GetUserAccountDetails(tx *sqlx.Tx, userId int64) *GetUserAccountDetailsQuery {
	var des GetUserAccountDetailsQuery
	tx.Get(&des, `
	   select u.name, u.email, u.pictureurl, a.name as accounttype from useraccount u
	   inner join accountplan a on u.accountplan_id = a.id
	   where u.id=$1`, userId)
	return &des
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

func SaveUserSharingToken(tx *sqlx.Tx, planificationId, userId int64, routineId *int64) {
	Insert(tx, &UserSharingToken{
		Creationdate:    time.Now(),
		CreatorId:       &userId,
		RoutineId:       routineId,
		PlanificationId: &planificationId,
		IsValid:         util.PBool(true),
	})
}

func InvalidateSharingTokenForRoutine(tx *sqlx.Tx, planificationId, routineId, userId int64) {
	tx.Exec(`update usersharingtoken 
		set isvalid = false 
		where creator_id = $1 and routine_id is not null and routine_id=$2 and planification_id=$3`, userId, routineId, planificationId)
}

func GetRoutineUserSharingToken(tx *sqlx.Tx, planificationId, routineId, userId int64) UserSharingToken {
	var des UserSharingToken
	tx.Get(&des, `
		select * from usersharingtoken 
		where creator_id = $1 and routine_id is not null and routine_id=$2 and planification_id=$3 and isvalid=true`, userId, routineId, planificationId)
	return des
}

func GetPlanificationUserSharingToken(tx *sqlx.Tx, planificationId, userId int64) UserSharingToken {
	var des UserSharingToken
	tx.Get(&des, `
		select * from usersharingtoken 
		where creator_id = $1 and planification_id=$2 and isvalid=true`, userId, planificationId)
	return des
}

func UserAlreadyRequestedAccessToSharedPlanification(tx *sqlx.Tx, planificationId, userId int64) bool {
	var des int
	tx.Get(&des, `
	select count(1) from queueplanificationaccess 
	where useraccount_id=$1 and planification_id=$2`, userId, planificationId)
	return des > 0
}

func QueueAccessRequestToSharedPlanification(tx *sqlx.Tx, planificationId, userId int64) {
	Insert(
		tx,
		&QueuePlanificationAccess{
			PlanificationId: &planificationId,
			UserAccountId:   &userId,
		})
}

func ListQueuedPlanificationAccessRequests(tx *sqlx.Tx, userId int64) []ListQueuedPlanificationAccessRequestsQuery {
	dest := make([]ListQueuedPlanificationAccessRequestsQuery, 0)
	tx.Select(&dest, `
		select
			u.name as requestername,
			p.name as planificationname,
			q.planification_id,
			q.useraccount_id from planification p
		inner join queueplanificationaccess q on p.id = q.planification_id
		inner join useraccount u on q.useraccount_id = u.id
		where p.creator_id=$1`, userId)
	return dest
}

func CalculateUserHasNoAccessToPlanification(tx *sqlx.Tx, planificationId, userId int64) bool {
	var des int
	tx.Get(&des, "select count(1) from userplanification u where u.planification_id=$1 and u.useraccount_id=$2", planificationId, userId)
	return des == 0
}

func CalculateUserAlreadyActionatedARoutineToday(tx *sqlx.Tx, planificationId, userId int64) bool {
	var des int
	tx.Get(&des, `
		select count(1) from userroutinehistory u 
		where u.planification_id=$1 and u.useraccount_id=$2 and u.createddate::date = CURRENT_DATE`,
		planificationId, userId)
	return des > 0
}

func InsertUserRoutineHistory(tx *sqlx.Tx, completed bool, planificationId, routineId, userId int64) {
	Insert(
		tx,
		&UserRoutineHistory{
			PlanificationId: &planificationId,
			RoutineId:       &routineId,
			UserAccountId:   &userId,
			Completed:       &completed,
			CreatedDate:     time.Now(),
		})
}

func AcceptPlanificationAccessRequest(tx *sqlx.Tx, planificationId, requesterUserId, userId int64, plan *AccountPlanType) {
	tx.Exec("delete from queueplanificationaccess where useraccount_id=$1 and planification_id=$2", requesterUserId, planificationId)
	accessUpTo := 1
	if *plan == StudentPremium || *plan == Professor {
		schedule := GetPlanificationSchedule(tx, planificationId)
		accessUpTo = len(*schedule.Days)
	}

	Insert(
		tx,
		&UserPlanification{
			PlanificationId:   &planificationId,
			UserAccountId:     &requesterUserId,
			AccessUpToRoutine: &accessUpTo,
			AccessLastUpdated: time.Now(),
		})
}

func DeclinePlanificationAccessRequest(tx *sqlx.Tx, planificationId, requesterUserId, userId int64) {
	tx.Exec("delete from queueplanificationaccess where useraccount_id=$1 and planification_id=$2", requesterUserId, planificationId)
}
