package db

import (
	"github.com/jmoiron/sqlx"
	"github.com/leandro-hl/beautyofstrength/back/util"
	"sync"
	"time"
)

var (
	stmtsMutex    sync.RWMutex
	dbMutex       sync.Mutex
	preparedStmts map[string]*sqlx.Stmt
)

func getTxPreparedStmt(db *sqlx.DB, tx *sqlx.Tx, query string) (*sqlx.Stmt, error) {
	stmtsMutex.RLock()
	stmt, ok := preparedStmts[query]
	stmtsMutex.RUnlock()

	if ok {
		if tx != nil {
			return tx.Stmtx(stmt), nil
		}
		return stmt, nil
	}

	// Double check locking
	stmtsMutex.Lock()
	// Check again if the statement was prepared while acquiring the lock
	stmt, ok = preparedStmts[query]
	if !ok {
		var err error
		dbMutex.Lock()
		stmt, err = db.Preparex(query)
		dbMutex.Unlock()
		if err != nil {
			return nil, err
		}
		preparedStmts[query] = stmt
	}
	stmtsMutex.Unlock()

	if tx != nil {
		return tx.Stmtx(stmt), nil
	}
	return stmt, nil
}

func Close(db *sqlx.DB) {
	stmtsMutex.Lock()
	defer stmtsMutex.Unlock()

	for _, stmt := range preparedStmts {
		stmt.Close()
	}
	db.Close()
}

func ListExerciseNames(db *sqlx.DB) []ListExerciseIdName {
	query := "select id, name from exercise"
	stmt, err := getTxPreparedStmt(db, nil, query)
	defer stmt.Close()
	var exercisesNames []ListExerciseIdName
	err = stmt.Select(&exercisesNames)
	util.Check(err)
	return exercisesNames
}

func GetPlanificationIdByName(db *sqlx.DB, tx *sqlx.Tx, userId int64, name string) *int64 {
	var des int64
	query := `select id from planification where creator_id=$1 and name=$2`
	stmt, _ := getTxPreparedStmt(db, tx, query)
	stmt.Get(&des, userId, name)

	if des == 0 {
		return nil
	}
	return &des
}

func ListMyPlanifications(db *sqlx.DB, tx *sqlx.Tx, userId int64) []ListPlanificationsQuery {
	query := `
		select 
		    p.id, 
		    p.name,
			CASE
			WHEN p.creator_id = u.useraccount_id THEN TRUE
			ELSE FALSE
			END as owner,
		    p.starred,
		    count(r.id) as routinescount
		from planification p
		inner join userplanification u on p.id = u.planification_id
		left join routine r on (p.id = r.planification_id and r.active=true)
		where u.useraccount_id = $1 
		group by p.id, p.starred, p.name, p.creator_id, u.useraccount_id 
		order by p.starred desc, owner desc, p.name`
	stmt, err := getTxPreparedStmt(db, tx, query)
	dest := make([]ListPlanificationsQuery, 0)
	err = stmt.Select(&dest, userId)
	util.Check(err)
	return dest
}

func GetRoutineHeader(db *sqlx.DB, tx *sqlx.Tx, routineId int64, userId int64, currentUserId int64) *GetRoutineHeaderQuery {
	query := `
		select
			r.id routineid,
			r.name routinename,
			r.difficulty,
			r.duration,
			count(uh.id) timesmarked,
			r.creator_id != p.creator_id as iscopy,
			u2.id is not null as alreadycopied
			from routine r
		inner join planification p on p.id = r.planification_id
		inner join userplanification u on r.planification_id = u.planification_id
		left join userroutinehistory uh on r.id = uh.routine_id
		left join userroutinecopy u2 on r.id = u2.routine_id and u2.useraccount_id=$3
		where r.active=true and r.id=$1 and u.useraccount_id=$2
		group by r.id, r.name, p.creator_id, u2.id`
	stmt, err := getTxPreparedStmt(db, tx, query)
	util.Check(err)
	var dest GetRoutineHeaderQuery
	err = stmt.Get(&dest, routineId, userId, currentUserId)
	util.Check(err)
	return &dest
}

func GetRoutineById(db *sqlx.DB, tx *sqlx.Tx, routineId int64) *Routine {
	query := `select * from routine where id=$1`
	stmt, err := getTxPreparedStmt(db, tx, query)
	util.Check(err)
	var dest Routine
	stmt.Get(&dest, routineId)
	return &dest
}

func GetRoutineDetails(db *sqlx.DB, tx *sqlx.Tx, routineId int64, userId int64) []GetRoutineDetailsQuery {
	query := `
		select
		    bg.id grouperid,
		    bg.name groupername,
			b.id blockgroupid,
			b.name blockgroupname,
			b.duration blockgroupduration,
			b.laps,
			b.type,
			b.exerestinterval,
			b.laprestinterval,
			eb.reps,
			eb.secs,
			e.name exercisename,
			ie.video_code videocode
			from routine r
		inner join planification p on p.id = r.planification_id
		inner join userplanification u on r.planification_id = u.planification_id
		left join blockgroupgrouper bg on r.id = bg.routine_id
		left join blockgroup b on r.id = b.routine_id and bg.id=b.blockgroupgrouper_id
		left join exerciseblockgroup eb on b.id = eb.blockgroup_id
		left join exercise e on e.id = eb.exercise_id
		left join instructorexercise ie on e.id = ie.exercise_id and r.creator_id = ie.useraccount_id
		where r.active=true and r.id=$1 and u.useraccount_id=$2
		order by bg.id, b.id, eb.id`
	stmt, err := getTxPreparedStmt(db, tx, query)
	util.Check(err)
	dest := make([]GetRoutineDetailsQuery, 0)
	err = stmt.Select(&dest, routineId, userId)
	util.Check(err)

	return dest
}

func ListActiveRoutinesICreated(db *sqlx.DB, tx *sqlx.Tx, planificationId int64, userId int64) []ListRoutinesQuery {
	query := `
		select 
		    r.id, 
		    r.name, 
		    r.planification_id, 
		    r.difficulty,
		    r.duration,
		    count(distinct bg.id) as blockcount,
		    count(b.id) as workcount, 
		    u2.completed from routine r 
		inner join planification p on r.planification_id = p.id
	    inner join blockgroupgrouper bg on r.id = bg.routine_id
		inner join blockgroup b on r.id = b.routine_id and bg.id = b.blockgroupgrouper_id  
		left outer join userroutinehistory u2 on r.id = u2.routine_id and u2.useraccount_id = p.creator_id                                                                 
		where r.active=true and p.id = $1 and p.creator_id=$2
		group by r.id, u2.completed  order by r.id`
	stmt, err := getTxPreparedStmt(db, tx, query)
	util.Check(err)
	dest := make([]ListRoutinesQuery, 0)

	err = stmt.Select(&dest, planificationId, userId)
	util.Check(err)

	return dest
}

func ListActiveRoutines(db *sqlx.DB, tx *sqlx.Tx, planificationId, userId int64) []ListRoutinesQuery {
	query := `
		select 
		    r.id, 
		    r.name, 
		    r.planification_id, 
		    r.difficulty,
		    r.duration,
		    count(distinct bg.id) as blockcount,
		    count(b.id) as workcount, 
		    u2.completed from routine r 
		inner join planification p on r.planification_id = p.id
		inner join userplanification u on p.id = u.planification_id
		inner join blockgroupgrouper bg on r.id = bg.routine_id
		inner join blockgroup b on r.id = b.routine_id and bg.id = b.blockgroupgrouper_id  
		left outer join userroutinehistory u2 on r.id = u2.routine_id and u.useraccount_id = u2.useraccount_id                                                                
		where r.active=true and p.id = $1 and u.useraccount_id = $2
		group by r.id, u2.completed order by r.id`
	stmt, err := getTxPreparedStmt(db, tx, query)
	util.Check(err)

	dest := make([]ListRoutinesQuery, 0)
	err = stmt.Select(&dest, planificationId, userId)
	util.Check(err)

	return dest
}

func GetPlanificationSchedule(db *sqlx.DB, tx *sqlx.Tx, planificationId int64) *PlanificationSchedule {
	query := `select * from planificationschedule where planification_id=$1`
	stmt, err := getTxPreparedStmt(db, tx, query)
	util.Check(err)

	var des PlanificationSchedule
	stmt.Get(&des, planificationId)
	return &des
}

func GetPlanificationScheduleByUser(db *sqlx.DB, tx *sqlx.Tx, planificationId, userId int64) *GetPlanificationScheduleQuery {
	query := `select 
		ps.*,
		u.accessuptoroutine,
		u.accesslastupdated 
		from planificationschedule ps
		inner join userplanification u on ps.planification_id = u.planification_id
		where ps.planification_id=$1 and u.useraccount_id = $2`
	stmt, err := getTxPreparedStmt(db, tx, query)
	util.Check(err)

	var des GetPlanificationScheduleQuery
	stmt.Get(&des, planificationId, userId)
	return &des
}

func UpdateUserPlanificationRoutineAccess(db *sqlx.DB, tx *sqlx.Tx, planificationId, userId int64, newUpToRoutineAccess int) {
	query := `update userplanification 
		set accessuptoroutine=$1, accesslastupdated=now() 
		where planification_id=$2 and useraccount_id=$3`
	stmt, err := getTxPreparedStmt(db, tx, query)
	util.Check(err)
	stmt.Exec(newUpToRoutineAccess, planificationId, userId)
}

func ListExercises(db *sqlx.DB, tx *sqlx.Tx, userId int64) []ListExerciseQuery {
	query := `
		SELECT 
		    e.id, 
		    e.name, 
		    u.name as createdbyuser,
		    ie.id is null as nocurrentuservideo
		FROM exercise e 
		inner join useraccount u on u.id = e.createdbyuser_id  
		left join instructorexercise ie on e.id = ie.exercise_id and ie.useraccount_id=$1
		ORDER BY e.name`
	stmt, err := getTxPreparedStmt(db, tx, query)
	util.Check(err)

	var dest []ListExerciseQuery
	err = stmt.Select(&dest, userId)
	util.Check(err)
	return dest
}

func ListActiveUserAccountSessions(db *sqlx.DB) []UserAccountSession {
	query := `SELECT * FROM useraccountsession`
	stmt, err := getTxPreparedStmt(db, nil, query)
	defer stmt.Close()
	util.Check(err)

	dest := make([]UserAccountSession, 0)
	err = stmt.Select(&dest)
	util.Check(err)
	return dest
}

func GetUserActiveSession(db *sqlx.DB, tx *sqlx.Tx, userId int64) *UserAccountSession {
	query := `SELECT * FROM useraccountsession where useraccount_id=$1`
	stmt, err := getTxPreparedStmt(db, tx, query)
	util.Check(err)

	var des UserAccountSession
	stmt.Get(&des, userId)
	return &des
}

func RemoveActiveSession(db *sqlx.DB, tx *sqlx.Tx, userId int64) {
	query := "delete from useraccountsession where useraccount_id=$1"
	stmt, err := getTxPreparedStmt(db, tx, query)
	util.Check(err)

	stmt.Exec(userId)
}

func SaveCreatedActiveSession(db *sqlx.DB, tx *sqlx.Tx, token string, userId int64) *int64 {
	RemoveActiveSession(db, tx, userId)
	id := Insert(
		tx,
		&UserAccountSession{
			Token:         &token,
			UserAccountId: &userId,
		})
	return id
}

func CountRoutinesInPlanification(db *sqlx.DB, tx *sqlx.Tx, planificationId int64) *int {
	query := "select count(1) from routine r where r.active=true and r.planification_id=$1"
	stmt, err := getTxPreparedStmt(db, tx, query)
	util.Check(err)

	var des int
	stmt.Get(&des, planificationId)
	return &des
}

func CreateUserAccount(db *sqlx.DB, tx *sqlx.Tx, user *UserAccount) *int64 {
	id := Insert(
		tx,
		user)
	return id
}

func CreateRoutineDefault(db *sqlx.DB, tx *sqlx.Tx, name string, planificationId, creatorId int64) *int64 {
	id := Insert(
		tx,
		&Routine{
			Name:            &name,
			PlanificationId: &planificationId,
			Difficulty:      util.PInt(1),
			Duration:        util.PString("01:00"),
			Active:          util.PBool(true),
			CreatorId:       &creatorId,
		})
	return id
}

func CreateRoutine(db *sqlx.DB, tx *sqlx.Tx, name string, planificationId, creatorId int64, difficulty int, duration string) *int64 {
	id := Insert(
		tx,
		&Routine{
			Name:            &name,
			PlanificationId: &planificationId,
			Difficulty:      &difficulty,
			Duration:        &duration,
			Active:          util.PBool(true),
			CreatorId:       &creatorId,
		})
	return id
}

func CreateBlockGrouper(db *sqlx.DB, tx *sqlx.Tx, name string, routineId int64) *int64 {
	id := Insert(
		tx,
		&BlockGroupGrouper{
			Name:      &name,
			RoutineId: &routineId,
		})
	return id
}

func CreateBlockGroup(
	db *sqlx.DB,
	tx *sqlx.Tx,
	blockType, name string,
	routineId, blockGroupId int64,
	duration, laps, lapRestInterval, exeRestInterval *int) *int64 {
	id := Insert(
		tx,
		&BlockGroup{
			Name:                &name,
			Duration:            duration,
			Laps:                laps,
			Type:                &blockType,
			LapRestInterval:     lapRestInterval,
			ExeRestInterval:     exeRestInterval,
			RoutineId:           &routineId,
			BlockGroupGrouperId: &blockGroupId,
		})
	return id
}

func CreateExerciseBlockGroup(db *sqlx.DB, tx *sqlx.Tx, blockId int64, exerciseId int, reps, secs *int) *int64 {
	id := Insert(
		tx,
		&ExerciseBlockGroup{
			BlockGroupId: &blockId,
			ExerciseId:   &exerciseId,
			Reps:         reps,
			Secs:         secs,
		})

	return id
}

func CreatePlanification(db *sqlx.DB, tx *sqlx.Tx, userId int64, name string, starred bool) *int64 {
	id := Insert(
		tx,
		&Planification{
			Name:      &name,
			CreatorId: &userId,
			Starred:   &starred,
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

func InsertPlanificationDays(db *sqlx.DB, tx *sqlx.Tx, planificationId int64, days string) {
	Insert(
		tx,
		&PlanificationSchedule{
			PlanificationId: &planificationId,
			Days:            &days,
		})
}

func UpdatePlanificationDays(db *sqlx.DB, tx *sqlx.Tx, planificationId int64, days string) {
	query := `update planificationschedule set days=$1 where planification_id=$2`
	stmt, err := getTxPreparedStmt(db, tx, query)
	util.Check(err)

	stmt.Exec(days, planificationId)
}

func UpdateGrouperNames(db *sqlx.DB, tx *sqlx.Tx, planificationId, routineId, grouperId int64, name string) {
	query := `
		update blockgroupgrouper bg set name=$1 
		from routine r
		where bg.id=$4 
		  and bg.routine_id = r.id 
		  and r.id=$2 and r.planification_id=$3 and r.active=true`
	stmt, err := getTxPreparedStmt(db, tx, query)
	util.Check(err)

	stmt.Exec(name, routineId, planificationId, grouperId)
}

func CreateExercise(db *sqlx.DB, tx *sqlx.Tx, name string, userAccountId int64) *int {
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

func CountExercisesCreatedByUser(db *sqlx.DB, tx *sqlx.Tx, userAccountId int64) *int {
	query := "select count(1) from exercise where createdbyuser_id=$1"
	stmt, err := getTxPreparedStmt(db, tx, query)
	util.Check(err)

	var des int
	stmt.Get(&des, userAccountId)
	return &des
}

func SaveExercisesBlock(db *sqlx.DB, tx *sqlx.Tx,
	routineId int64,
	blockType, name string,
	duration, laps, lapRestInterval, exeRestInterval *int,
	exercises []ExerciseBlockGroup,
	blockGroupName string, blockGroupId *int64) *int64 {

	if blockGroupId == nil {
		blockGroupId = Insert(tx, &BlockGroupGrouper{
			Name:      &blockGroupName,
			RoutineId: &routineId,
		})
	}

	id := Insert(
		tx,
		&BlockGroup{
			Name:                &name,
			Duration:            duration,
			Laps:                laps,
			Type:                &blockType,
			LapRestInterval:     lapRestInterval,
			ExeRestInterval:     exeRestInterval,
			RoutineId:           &routineId,
			BlockGroupGrouperId: blockGroupId,
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

func SaveUserDevicePushNotificationSubscription(db *sqlx.DB, tx *sqlx.Tx, userId int64, vapiddata string, deviceName string) {
	query := "select id from userdevice where useraccount_id = $1 and name = $2"
	stmt, err := getTxPreparedStmt(db, tx, query)
	util.Check(err)

	var userDeviceId int64
	err = stmt.Get(&userDeviceId, userId, deviceName)
	if err == nil {
		q2 := "update userdevice set vapiddata = $1 where id = $2"
		stmt2, err := getTxPreparedStmt(db, tx, q2)
		util.Check(err)
		stmt2.Exec(vapiddata, userDeviceId)
	} else if err.Error() == "sql: no rows in result set" {
		Insert(tx, &UserDevice{
			Name:          &deviceName,
			VapidData:     &vapiddata,
			UserAccountId: &userId,
		})
	}
}

func SaveUserTrainedToday(db *sqlx.DB, tx *sqlx.Tx, userId int64, answer bool) {
	Insert(tx, &UserTrainingHistory{
		Date:          time.Now(),
		Answer:        &answer,
		UserAccountId: &userId,
	})
}

func GetUserLoadedTrainingToday(db *sqlx.DB, tx *sqlx.Tx, userId int64) bool {
	query := "select date from usertraininghistory where useraccount_id=$1 order by id desc limit 1"
	stmt, err := getTxPreparedStmt(db, tx, query)
	util.Check(err)

	var lastTime time.Time
	stmt.Get(&lastTime, userId)
	lastYear, lastMonth, lastDay := lastTime.Date()
	year, month, day := time.Now().Date()
	return lastYear == year && lastMonth == month && lastDay == day
}

func CalculateUserOwnsRoutine(db *sqlx.DB, tx *sqlx.Tx, userId, planificationId, routineId int64) bool {
	query := `
		select count(1) from planification p 
		inner join routine r on p.id = r.planification_id 
		where r.active=true and p.creator_id=$1 and r.planification_id=$2 and r.id=$3 and r.creator_id=$1`
	stmt, err := getTxPreparedStmt(db, tx, query)
	util.Check(err)

	var des int
	stmt.Get(&des, userId, planificationId, routineId)
	return des > 0
}

func CalculateUserOwnsPlanification(db *sqlx.DB, tx *sqlx.Tx, userId, planificationId int64) bool {
	query := "select count(1) from planification p where p.creator_id=$1 and p.id=$2"
	stmt, err := getTxPreparedStmt(db, tx, query)
	util.Check(err)

	var des int
	stmt.Get(&des, userId, planificationId)
	return des > 0
}

func CalculateRoutineBlocksAmount(db *sqlx.DB, tx *sqlx.Tx, routineId int64) int {
	query := `select count(1) from blockgroup where routine_id=$1`
	stmt, err := getTxPreparedStmt(db, tx, query)
	util.Check(err)

	var des int
	stmt.Get(&des, routineId)
	return des
}

func CalculateUserAlreadyCopiedRoutine(db *sqlx.DB, tx *sqlx.Tx, userId, routineId int64) bool {
	query := "select count(1) from userroutinecopy where useraccount_id=$1 and routine_id=$2"
	stmt, err := getTxPreparedStmt(db, tx, query)
	util.Check(err)

	var des int
	stmt.Get(&des, userId, routineId)
	return des > 0
}

func GetUserIdByUserName(db *sqlx.DB, tx *sqlx.Tx, userName string) int64 {
	query := "select id from useraccount where username=$1"
	stmt, err := getTxPreparedStmt(db, tx, query)
	util.Check(err)

	var userId int64
	err = stmt.Get(&userId, userName)
	util.Check(err)
	return userId
}

func GetUserIdByUserNameNoError(db *sqlx.DB, tx *sqlx.Tx, userName string) *int64 {
	query := "select id from useraccount where username=$1"
	stmt, err := getTxPreparedStmt(db, tx, query)
	util.Check(err)

	var userId *int64
	stmt.Get(&userId, userName)
	return userId
}

func GetAccountPlanIdByIdentifier(db *sqlx.DB, tx *sqlx.Tx, iden AccountPlanType) *int {
	query := "select id from accountplan where identifier=$1"
	stmt, err := getTxPreparedStmt(db, tx, query)
	util.Check(err)

	var id *int
	stmt.Get(&id, string(iden))
	return id
}

func GetAccountPlanIdentifierByUserId(db *sqlx.DB, tx *sqlx.Tx, userId int64) *AccountPlanType {
	query := `
		select identifier from accountplan
		inner join useraccount u on accountplan.id = u.accountplan_id
	    where u.id=$1`
	stmt, err := getTxPreparedStmt(db, tx, query)
	util.Check(err)

	var des string
	stmt.Get(&des, userId)
	id := AccountPlanType(des[0])
	return &id
}

func GetUserAccountDetails(db *sqlx.DB, tx *sqlx.Tx, userId int64) *GetUserAccountDetailsQuery {
	query := `
	   select u.name, u.email, u.pictureurl, a.name as accounttype from useraccount u
	   inner join accountplan a on u.accountplan_id = a.id
	   where u.id=$1`
	stmt, err := getTxPreparedStmt(db, tx, query)
	util.Check(err)

	var des GetUserAccountDetailsQuery
	stmt.Get(&des, userId)
	return &des
}

func RetrieveUserDeviceNotifationSubscription(db *sqlx.DB, tx *sqlx.Tx, userId int64, deviceName string) string {
	query := "select vapiddata from userdevice where useraccount_id = $1 and name = $2"
	stmt, err := getTxPreparedStmt(db, tx, query)
	util.Check(err)

	var subscription string
	err = stmt.Get(&subscription, userId, deviceName)
	util.Check(err)
	return subscription
}

func SelectAllUserDeviceSubscriptions(db *sqlx.DB) []UserDevice {
	query := "select * from userdevice"
	stmt, err := getTxPreparedStmt(db, nil, query)
	defer stmt.Close()
	util.Check(err)

	var subs []UserDevice
	stmt.Select(&subs)
	return subs
}

func SaveUserSharingToken(db *sqlx.DB, tx *sqlx.Tx, planificationId, userId int64, routineId *int64, canBeSaved bool) {
	Insert(tx, &UserSharingToken{
		Creationdate:    time.Now(),
		CreatorId:       &userId,
		RoutineId:       routineId,
		PlanificationId: &planificationId,
		CanBeSaved:      &canBeSaved,
		IsValid:         util.PBool(true),
	})
}

func InvalidateSharingTokenForRoutine(db *sqlx.DB, tx *sqlx.Tx, planificationId, routineId, userId int64) {
	query := `update usersharingtoken 
		set isvalid = false 
		where creator_id = $1 and routine_id is not null and routine_id=$2 and planification_id=$3`
	stmt, err := getTxPreparedStmt(db, tx, query)
	util.Check(err)

	stmt.Exec(userId, routineId, planificationId)
}

func GetRoutineUserSharingToken(db *sqlx.DB, tx *sqlx.Tx, planificationId, routineId, userId int64) UserSharingToken {
	query := `
		select * from usersharingtoken 
		where creator_id = $1 and routine_id is not null and routine_id=$2 and planification_id=$3 and isvalid=true`
	stmt, err := getTxPreparedStmt(db, tx, query)
	util.Check(err)

	var des UserSharingToken
	stmt.Get(&des, userId, routineId, planificationId)
	return des
}

func GetRoutineUserSharingTokenBy(db *sqlx.DB, tx *sqlx.Tx, routineId int64) UserSharingToken {
	query := `
		select * from usersharingtoken 
		where routine_id is not null and routine_id=$1 and isvalid=true`
	stmt, err := getTxPreparedStmt(db, tx, query)
	util.Check(err)

	var des UserSharingToken
	stmt.Get(&des, routineId)
	return des
}

func GetPlanificationUserSharingToken(db *sqlx.DB, tx *sqlx.Tx, planificationId, userId int64) UserSharingToken {
	query := `
		select * from usersharingtoken 
		where creator_id = $1 and planification_id=$2 and isvalid=true`
	stmt, err := getTxPreparedStmt(db, tx, query)
	util.Check(err)

	var des UserSharingToken
	stmt.Get(&des, userId, planificationId)
	return des
}

func UserAlreadyRequestedAccessToSharedPlanification(db *sqlx.DB, tx *sqlx.Tx, planificationId, userId int64) bool {
	query := `
		select count(1) from queueplanificationaccess 
		where useraccount_id=$1 and planification_id=$2`
	stmt, err := getTxPreparedStmt(db, tx, query)
	util.Check(err)

	var des int
	stmt.Get(&des, userId, planificationId)
	return des > 0
}

func QueueAccessRequestToSharedPlanification(db *sqlx.DB, tx *sqlx.Tx, planificationId, userId int64) {
	Insert(
		tx,
		&QueuePlanificationAccess{
			PlanificationId: &planificationId,
			UserAccountId:   &userId,
		})
}

func ListQueuedPlanificationAccessRequests(db *sqlx.DB, tx *sqlx.Tx, userId int64) []ListQueuedPlanificationAccessRequestsQuery {
	query := `
		select
			u.name as requestername,
			p.name as planificationname,
			q.planification_id,
			q.useraccount_id from planification p
		inner join queueplanificationaccess q on p.id = q.planification_id
		inner join useraccount u on q.useraccount_id = u.id
		where p.creator_id=$1`
	stmt, err := getTxPreparedStmt(db, tx, query)
	util.Check(err)

	dest := make([]ListQueuedPlanificationAccessRequestsQuery, 0)
	stmt.Select(&dest, userId)
	return dest
}

func CalculateUserHasNoAccessToPlanification(db *sqlx.DB, tx *sqlx.Tx, planificationId, userId int64) bool {
	query := "select count(1) from userplanification u where u.planification_id=$1 and u.useraccount_id=$2"
	stmt, err := getTxPreparedStmt(db, tx, query)
	util.Check(err)

	var des int
	stmt.Get(&des, planificationId, userId)
	return des == 0
}

func CalculateUserAlreadyActionatedARoutineToday(db *sqlx.DB, tx *sqlx.Tx, planificationId, userId int64) bool {
	query := `
		select count(1) from userroutinehistory u 
		where u.planification_id=$1 and u.useraccount_id=$2 and u.createddate::date = CURRENT_DATE`
	stmt, err := getTxPreparedStmt(db, tx, query)
	util.Check(err)

	var des int
	stmt.Get(&des, planificationId, userId)
	return des > 0
}

func CalculatePlanificationAlreadyExecutedBySomeone(db *sqlx.DB, tx *sqlx.Tx, planificationId int64) bool {
	query := `
		select count(1) from userroutinehistory u 
		where u.planification_id=$1`
	stmt, err := getTxPreparedStmt(db, tx, query)
	util.Check(err)

	var des int
	stmt.Get(&des, planificationId)
	return des > 0
}

func InsertUserRoutineHistory(db *sqlx.DB, tx *sqlx.Tx, completed bool, planificationId, routineId, userId int64) {
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

func InsertUserRoutineCopy(db *sqlx.DB, tx *sqlx.Tx, userId, routineId int64) {
	Insert(tx, &UserRoutineCopy{
		RoutineId:     &routineId,
		UserAccountId: &userId,
		CreatedDate:   time.Now(),
	})
}

func AcceptPlanificationAccessRequest(db *sqlx.DB, tx *sqlx.Tx, planificationId, requesterUserId, userId int64, plan *AccountPlanType) {
	query := "delete from queueplanificationaccess where useraccount_id=$1 and planification_id=$2"
	stmt, err := getTxPreparedStmt(db, tx, query)
	util.Check(err)

	stmt.Exec(requesterUserId, planificationId)
	accessUpTo := 1
	if *plan == StudentPremium || *plan == Professor {
		schedule := GetPlanificationSchedule(db, tx, planificationId)
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

func DeclinePlanificationAccessRequest(db *sqlx.DB, tx *sqlx.Tx, planificationId, requesterUserId, userId int64) {
	query := "delete from queueplanificationaccess where useraccount_id=$1 and planification_id=$2"
	stmt, err := getTxPreparedStmt(db, tx, query)
	util.Check(err)
	stmt.Exec(requesterUserId, planificationId)
}

func DeleteRoutine(db *sqlx.DB, tx *sqlx.Tx, routineId int64) {
	query := "update routine set active=false where id=$1"
	stmt, err := getTxPreparedStmt(db, tx, query)
	util.Check(err)
	stmt.Exec(routineId)
}

func ListBlockGroupGrouperByRoutineId(db *sqlx.DB, tx *sqlx.Tx, routineId int64) []BlockGroupGrouper {
	query := `select * from blockgroupgrouper where routine_id=$1 order by id`
	stmt, err := getTxPreparedStmt(db, tx, query)
	util.Check(err)
	var des []BlockGroupGrouper
	stmt.Select(&des, routineId)
	return des
}

func ListBlockGroupByRoutineId(db *sqlx.DB, tx *sqlx.Tx, routineId, bgId int64) []BlockGroup {
	query := `select * from blockgroup where routine_id=$1 and blockgroupgrouper_id=$2 order by id`
	stmt, err := getTxPreparedStmt(db, tx, query)
	util.Check(err)
	var des []BlockGroup
	err = stmt.Select(&des, routineId, bgId)
	util.Check(err)
	return des
}

func ListBlockGroupExerciseByBlockId(db *sqlx.DB, tx *sqlx.Tx, blockId int64) []ExerciseBlockGroup {
	query := `select * from exerciseblockgroup where blockgroup_id=$1 order by id`
	stmt, err := getTxPreparedStmt(db, tx, query)
	util.Check(err)
	var des []ExerciseBlockGroup
	stmt.Select(&des, blockId)
	return des
}

func InsertEventUser(
	db *sqlx.DB,
	tx *sqlx.Tx,
	t EventUserType,
	receiverId, senderId int64,
	planificationId, routineId *int64) {
	Insert(
		tx,
		&EventUser{
			Type:            &t,
			ReceiverId:      &receiverId,
			SenderId:        &senderId,
			PlanificationId: planificationId,
			RoutineId:       routineId,
			CreatedDate:     time.Now(),
		})
}

func ListLatestEventsBy(db *sqlx.DB, tx *sqlx.Tx, receiverId int64) []ListLatestEventsByQuery {
	query := `
		select eu.type, u.name as sendername, p.name as planificationname, r.name as routinename from eventuser eu
		inner join useraccount u on eu.sender_id = u.id
		left join routine r on eu.routine_id = r.id
		left join planification p on eu.planification_id = p.id		
        where receiver_id=$1 and eu.createddate >= CURRENT_DATE - INTERVAL '1 month' limit 50`
	stmt, err := getTxPreparedStmt(db, tx, query)
	util.Check(err)
	var des []ListLatestEventsByQuery
	stmt.Select(&des, receiverId)
	return des
}
