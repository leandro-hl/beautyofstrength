package db

import (
	"fmt"
	"github.com/jmoiron/sqlx"
	"github.com/leandro-hl/beautyofstrength/back/db/history"
	"github.com/leandro-hl/beautyofstrength/back/util"
	"sync"
	"time"
)

var (
	stmtsMutex    sync.RWMutex
	dbMutex       sync.Mutex
	preparedStmts map[string]*sqlx.Stmt
)

type PlanificationOperation string

const (
	PlanificationCopyMesocycle     PlanificationOperation = "PCM"
	PlanificationCopyWeek          PlanificationOperation = "PCW"
	TemplateRoutineToPlanification PlanificationOperation = "TRP"
)

type AppEvent string

const (
	RoutineTemplateDetails             AppEvent = "RoutineTemplateDetails"
	RoutineDetails                     AppEvent = "RoutineDetails"
	RoutineSharedDetails               AppEvent = "RoutineSharedDetails"
	UserAccountDetails                 AppEvent = "UserAccount"
	PlanificationDetails               AppEvent = "PlanificationDetails"
	ListEvents                         AppEvent = "ListEvents"
	ListRoutineTemplatess              AppEvent = "ListRoutineTemplates"
	ListMyAthletess                    AppEvent = "ListMyAthletes"
	ListPlanificationss                AppEvent = "ListPlanifications"
	ListExercisess                     AppEvent = "ListExercises"
	ListEquipments                     AppEvent = "ListEquipment"
	ListUserRM                         AppEvent = "ListUserRM"
	SaveNewRM                          AppEvent = "SaveNewRM"
	SaveRoutineExecution               AppEvent = "SaveRoutineExecution"
	SaveSharedRoutine                  AppEvent = "SaveSharedRoutine"
	ListLastUserRmHistoryStats         AppEvent = "ListLastUserRmHistoryStats"
	ActionatedRoutine                  AppEvent = "ActionatedRoutine"
	SaveRoutineEditions                AppEvent = "SaveRoutineEditions"
	SaveRoutineTemplateEditions        AppEvent = "SaveRoutineTemplateEditions"
	CreateRoutineTemplate              AppEvent = "CreateRoutineTemplate"
	CreateRoutinee                     AppEvent = "CreateRoutine"
	SaveExercisesBlockk                AppEvent = "SaveExercisesBlockk"
	AddToMyEquipment                   AppEvent = "AddToMyEquipment"
	CreatePlanificationn               AppEvent = "CreatePlanification"
	DeletePlanification                AppEvent = "DeletePlanification"
	SavePlanificationDays              AppEvent = "SavePlanificationDays"
	ManifestTrainer                    AppEvent = "ManifestTrainer"
	ManifestDefault                    AppEvent = "ManifestDefault"
	FetchLogo                          AppEvent = "FetchLogo"
	AccountCreated                     AppEvent = "AccountCreated"
	SignIn                             AppEvent = "SignIn"
	SignOut                            AppEvent = "SignOut"
	ShareRoutine                       AppEvent = "ShareRoutine"
	RequestAccessToSharedPlanification AppEvent = "RequestAccessToSharedPlanification"
	AcceptPlanificationAccessRequestt  AppEvent = "AcceptPlanificationAccessRequest"
	DeclinePlanificationAccessRequestt AppEvent = "DeclinePlanificationAccessRequestt"
	SavePlanificationEditions          AppEvent = "SavePlanificationEditions"
	CreateNewExercise                  AppEvent = "CreateNewExercise"
	CopyTemplateRoutineToPlanification AppEvent = "CopyTemplateRoutineToPlanification"
	UploadExerciseVideoLink            AppEvent = "UploadExerciseVideoLink"
	RepeatLastMesocycle                AppEvent = "RepeatLastMesocycle"
	RepeatLastWeek                     AppEvent = "RepeatLastWeek"
	InviteAthletesToAssociateWithMe    AppEvent = "InviteAthletesToAssociateWithMe"
	AcceptInstructorInvite             AppEvent = "AcceptInstructorInvite"
	SharePlanification                 AppEvent = "SharePlanification"
)

func getTxPreparedStmt(db *DB, tx *sqlx.Tx, query string) (*sqlx.Stmt, error) {
	stmtsMutex.RLock()
	key := string(db.Serial) + query
	stmt, ok := preparedStmts[key]
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
	stmt, ok = preparedStmts[key]
	if !ok {
		var err error
		dbMutex.Lock()
		stmt, err = db.Db.Preparex(query)
		dbMutex.Unlock()
		if err != nil {
			return nil, err
		}
		preparedStmts[key] = stmt
	}
	stmtsMutex.Unlock()

	if tx != nil {
		return tx.Stmtx(stmt), nil
	}
	return stmt, nil
}

func Close(db *DB) {
	stmtsMutex.Lock()
	defer stmtsMutex.Unlock()

	for _, stmt := range preparedStmts {
		stmt.Close()
	}
	db.Db.Close()
}

func ListExerciseNames(db *DB) []ListExerciseIdName {
	query := "select id, name from exercise"
	stmt, err := getTxPreparedStmt(db, nil, query)
	defer stmt.Close()
	var exercisesNames []ListExerciseIdName
	err = stmt.Select(&exercisesNames)
	util.Check(err)
	return exercisesNames
}

func GetPlanificationIdByName(db *DB, tx *sqlx.Tx, userId int64, name string) *int64 {
	var des int64
	query := `select id from planification where creator_id=$1 and name=$2 and active=true`
	stmt, _ := getTxPreparedStmt(db, tx, query)
	stmt.Get(&des, userId, name)

	if des == 0 {
		return nil
	}
	return &des
}

func ListMyPlanifications(db *DB, tx *sqlx.Tx, userId int64) []ListPlanificationsQuery {
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
		where u.useraccount_id = $1 and p.active=true
		group by p.id, p.starred, p.name, p.creator_id, u.useraccount_id 
		order by p.starred desc, owner desc, p.name`
	stmt, err := getTxPreparedStmt(db, tx, query)
	dest := make([]ListPlanificationsQuery, 0)
	err = stmt.Select(&dest, userId)
	util.Check(err)
	return dest
}

func GetRoutineHeader(db *DB, tx *sqlx.Tx, routineId int64, userId int64, currentUserId int64) *GetRoutineHeaderQuery {
	query := `
		select
			r.id routineid,
			r.name routinename,
			r.difficulty,
			r.duration,
			r.cover,
			r.coverimageurl,
			r.coverimagepath,
			r.coverurlexpirationdate,
			ua.code as owner,
			count(uh.id) timesmarked,
			SUM(CASE WHEN uh.useraccount_id = $3 THEN 1 ELSE 0 END) AS timesimarkedit,
			r.creator_id != p.creator_id as iscopy,
			u2.id is not null as alreadycopied
			from routine r
		inner join planification p on p.id = r.planification_id
		inner join userplanification u on r.planification_id = u.planification_id
		inner join useraccount ua on r.creator_id=ua.id
		left join userroutinehistory uh on r.id = uh.routine_id
		left join userroutinecopy u2 on r.id = u2.routine_id and u2.useraccount_id=$3
		where p.active=true and r.active=true and r.id=$1 and u.useraccount_id=$2
		group by r.id, r.name, p.creator_id, u2.id, ua.code`
	stmt, err := getTxPreparedStmt(db, tx, query)
	util.Check(err)
	var dest GetRoutineHeaderQuery
	err = stmt.Get(&dest, routineId, userId, currentUserId)
	util.Check(err)
	return &dest
}

func GetRoutineHeaderTemplate(db *DB, tx *sqlx.Tx, routineId int64, userId int64) *GetRoutineHeaderQuery {
	query := `
		select
			r.id routineid,
			r.name routinename,
			r.difficulty,
			r.duration,
			r.cover,
			r.coverimageurl,
			r.coverimagepath,
			r.coverurlexpirationdate,
			u.code as owner,
			0 timesmarked,
			0 timesimarkedit,
			false as iscopy,
			false as alreadycopied
			from template.routine r
			inner join useraccount u on r.creator_id = u.id
		where r.active=true and r.id=$1 and r.creator_id=$2`
	stmt, err := getTxPreparedStmt(db, tx, query)
	util.Check(err)
	var dest GetRoutineHeaderQuery
	err = stmt.Get(&dest, routineId, userId)
	util.Check(err)
	return &dest
}

func GetRoutineById(db *DB, tx *sqlx.Tx, routineId int64) *Routine {
	query := `select * from routine where id=$1 and active=true`
	stmt, err := getTxPreparedStmt(db, tx, query)
	util.Check(err)
	var dest Routine
	stmt.Get(&dest, routineId)
	return &dest
}

func ListExercisesByRoutineId(db *DB, tx *sqlx.Tx, routineId int64, userId int64) []ListExercisesByRoutineIdQuery {
	query := `
		select
			eb.reps,
			eb.exercise_id
		from exerciseblockgroup eb
		inner join blockgroup b on eb.blockgroup_id = b.id and b.active=true
		inner join blockgroupgrouper bg on b.blockgroupgrouper_id = bg.id and bg.active=true
		inner join routine r on bg.routine_id = r.id
		inner join userplanification u on r.planification_id = u.planification_id
		where eb.active=true and b.routine_id=$1 and u.useraccount_id=$2 and eb.reps is not null
		order by bg."order", bg.id, b.id, eb."order", eb.id`
	stmt, err := getTxPreparedStmt(db, tx, query)
	util.Check(err)
	dest := make([]ListExercisesByRoutineIdQuery, 0)
	err = stmt.Select(&dest, routineId, userId)
	util.Check(err)

	return dest
}

func GetRoutineDetails(db *DB, tx *sqlx.Tx, routineId int64, userId int64) []GetRoutineDetailsQuery {
	query := `
		select
		    bg.id grouperid,
		    bg.name groupername,
			bg."order" grouperorder,
			b.id blockgroupid,
			b.name blockgroupname,
			b.duration blockgroupduration,
			b.laps,
			b.type,
			b.exerestinterval,
			b.laprestinterval,
			eb.reps,
			eb.secs,
			eb.id exercisebgid,
			e.id exerciseid,
			e.name exercisename,
			ie.video_code videocode,
			ie.link
			from routine r
		inner join planification p on p.id = r.planification_id
		inner join userplanification u on r.planification_id = u.planification_id
		left join blockgroupgrouper bg on r.id = bg.routine_id and bg.active=true
		left join blockgroup b on r.id = b.routine_id and bg.id=b.blockgroupgrouper_id and b.active=true
		left join exerciseblockgroup eb on b.id = eb.blockgroup_id and eb.active=true
		left join exercise e on e.id = eb.exercise_id
		left join instructorexercise ie on e.id = ie.exercise_id and r.creator_id = ie.useraccount_id
		where 
		    p.active=true 
		  and r.active=true 
		  and r.id=$1 
		  and u.useraccount_id=$2
		order by bg."order", bg.id, b.id, eb."order", eb.id`
	stmt, err := getTxPreparedStmt(db, tx, query)
	util.Check(err)
	dest := make([]GetRoutineDetailsQuery, 0)
	err = stmt.Select(&dest, routineId, userId)
	util.Check(err)

	return dest
}

func GetRoutineDetailsTemplate(db *DB, tx *sqlx.Tx, routineId int64, userId int64) []GetRoutineDetailsQuery {
	query := `
		select
		    bg.id grouperid,
		    bg.name groupername,
			bg."order" grouperorder,
			b.id blockgroupid,
			b.name blockgroupname,
			b.duration blockgroupduration,
			b.laps,
			b.type,
			b.exerestinterval,
			b.laprestinterval,
			eb.reps,
			eb.secs,
			eb.id exercisebgid,
			e.name exercisename,
			ie.video_code videocode,
			ie.link
			from template.routine r
		left join template.blockgroupgrouper bg on r.id = bg.routine_id and bg.active=true
		left join template.blockgroup b on r.id = b.routine_id and bg.id=b.blockgroupgrouper_id and b.active=true
		left join template.exerciseblockgroup eb on b.id = eb.blockgroup_id and eb.active=true
		left join exercise e on e.id = eb.exercise_id
		left join instructorexercise ie on e.id = ie.exercise_id and r.creator_id = ie.useraccount_id
		where 
		    r.active=true 
		  and r.id=$1 
		  and r.creator_id=$2
		order by bg."order", bg.id, b.id, eb."order", eb.id`
	stmt, err := getTxPreparedStmt(db, tx, query)
	util.Check(err)
	dest := make([]GetRoutineDetailsQuery, 0)
	err = stmt.Select(&dest, routineId, userId)
	util.Check(err)

	return dest
}

func ListLastRoutinesByPlanificationIdUpTo(db *DB, tx *sqlx.Tx, planificationId, userId int64, upto int) []Routine {
	query := `select * from routine where planification_id=$1 and creator_id=$2 and active=true order by id desc limit $3`
	stmt, err := getTxPreparedStmt(db, tx, query)
	util.Check(err)
	dest := make([]Routine, 0)
	err = stmt.Select(&dest, planificationId, userId, upto)
	util.Check(err)
	return dest
}

func ListRoutineTemplates(db *DB, tx *sqlx.Tx, userId int64) []ListRoutineTemplatesQuery {
	query := `
		select 
		    r.id, 
		    r.name, 
		    r.difficulty,
		    r.duration,
		    count(distinct bg.id) as blockcount,
		    count(b.id) as workcount from template.routine r 
	    left join template.blockgroupgrouper bg on r.id = bg.routine_id and bg.active=true
		left join template.blockgroup b on r.id = b.routine_id and bg.id = b.blockgroupgrouper_id and b.active=true                                                               
		where r.active=true and r.creator_id=$1
		group by r.id, r.name order by r.name`
	stmt, err := getTxPreparedStmt(db, tx, query)
	util.Check(err)
	dest := make([]ListRoutineTemplatesQuery, 0)

	err = stmt.Select(&dest, userId)
	util.Check(err)

	return dest
}

func ListMyAthletes(db *DB, tx *sqlx.Tx, userId int64) []ListMyAthletesQuery {
	query := `
	select u.name, a.name plan 
	from useraccount u 
    inner join accountplan a on u.accountplan_id = a.id
    where u.trainer=$1`
	stmt, err := getTxPreparedStmt(db, tx, query)
	util.Check(err)
	dest := make([]ListMyAthletesQuery, 0)

	err = stmt.Select(&dest, userId)
	util.Check(err)

	return dest
}

func ListWorkoutTemplates(db *DB, tx *sqlx.Tx, userId int64) []ListWorkoutTemplatesQuery {
	query := `
		select 
		    bg.id, 
		    bg.name 
		from template.blockgroupgrouper bg                                                            
		where bg.active=true and bg.creator_id=$1 and bg.routine_id is null
		order by bg.name`
	stmt, err := getTxPreparedStmt(db, tx, query)
	util.Check(err)
	dest := make([]ListWorkoutTemplatesQuery, 0)

	err = stmt.Select(&dest, userId)
	util.Check(err)

	return dest
}

func ListActiveRoutinesICreated(db *DB, tx *sqlx.Tx, planificationId int64, userId int64) []ListRoutinesQuery {
	query := `
		select 
		    r.id, 
		    r.name, 
		    r.planification_id, 
		    r.difficulty,
		    r.duration,
		    r.cover,
			r.coverimageurl,
			r.coverimagepath,
			r.coverurlexpirationdate,
			ua.code as owner,
		    count(distinct bg.id) as blockcount,
		    count(b.id) as workcount, 
		    u2.completed from routine r 
		inner join planification p on r.planification_id = p.id
		inner join userplanification u on r.planification_id = u.planification_id
		inner join useraccount ua on r.creator_id=ua.id
	    left join blockgroupgrouper bg on r.id = bg.routine_id and bg.active=true
		left join blockgroup b on r.id = b.routine_id and bg.id = b.blockgroupgrouper_id and b.active=true
		left outer join userroutinehistory u2 on r.id = u2.routine_id and u2.useraccount_id = p.creator_id                                                                 
		where p.active=true and r.active=true and p.id = $1 and p.creator_id=$2
		group by r.id, u2.completed, ua.code  order by r.id`
	stmt, err := getTxPreparedStmt(db, tx, query)
	util.Check(err)
	dest := make([]ListRoutinesQuery, 0)

	err = stmt.Select(&dest, planificationId, userId)
	util.Check(err)

	return dest
}

func ListActiveRoutines(db *DB, tx *sqlx.Tx, planificationId, userId int64) []ListRoutinesQuery {
	query := `
		select 
		    r.id, 
		    r.name, 
		    r.planification_id, 
		    r.difficulty,
		    r.duration,
		    r.cover,
			r.coverimageurl,
			r.coverimagepath,
			r.coverurlexpirationdate,
			ua.code as owner,
		    count(distinct bg.id) as blockcount,
		    count(b.id) as workcount, 
		    u2.completed from routine r 
		inner join planification p on r.planification_id = p.id
		inner join userplanification u on p.id = u.planification_id
		inner join useraccount ua on r.creator_id=ua.id
		left join blockgroupgrouper bg on r.id = bg.routine_id and bg.active=true
		left join blockgroup b on r.id = b.routine_id and bg.id = b.blockgroupgrouper_id and b.active=true  
		left outer join userroutinehistory u2 on r.id = u2.routine_id and u.useraccount_id = u2.useraccount_id                                                                
		where p.active=true and r.active=true and p.id = $1 and u.useraccount_id = $2
		group by r.id, u2.completed, ua.code order by r.id`
	stmt, err := getTxPreparedStmt(db, tx, query)
	util.Check(err)

	dest := make([]ListRoutinesQuery, 0)
	err = stmt.Select(&dest, planificationId, userId)
	util.Check(err)

	return dest
}

func GetPlanificationById(db *DB, tx *sqlx.Tx, planificationId int64) *Planification {
	query := `select * from planification where id=$1`
	stmt, err := getTxPreparedStmt(db, tx, query)
	util.Check(err)

	var des Planification
	err = stmt.Get(&des, planificationId)
	util.Check(err)
	return &des
}

func GetPlanificationSchedule(db *DB, tx *sqlx.Tx, planificationId int64) *PlanificationSchedule {
	query := `select * from planificationschedule where planification_id=$1`
	stmt, err := getTxPreparedStmt(db, tx, query)
	util.Check(err)

	var des PlanificationSchedule
	stmt.Get(&des, planificationId)
	return &des
}

func GetPlanificationScheduleByUser(db *DB, tx *sqlx.Tx, planificationId, userId int64) *GetPlanificationScheduleQuery {
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

func UpdateUserPlanificationRoutineAccess(db *DB, tx *sqlx.Tx, planificationId, userId int64, newUpToRoutineAccess int) {
	query := `update userplanification 
		set accessuptoroutine=$1, accesslastupdated=now() 
		where planification_id=$2 and useraccount_id=$3`
	stmt, err := getTxPreparedStmt(db, tx, query)
	util.Check(err)
	stmt.Exec(newUpToRoutineAccess, planificationId, userId)
}

func UpdateUserAccountInstructor(db *DB, tx *sqlx.Tx, userId, instructorId int64) {
	query := `update useraccount set trainer=$1 where id=$2 and trainer is null`
	stmt, err := getTxPreparedStmt(db, tx, query)
	util.Check(err)
	stmt.Exec(instructorId, userId)
}

func ListExercises(db *DB, tx *sqlx.Tx, userId int64) []ListExerciseQuery {
	query := `
		SELECT 
		    e.id, 
		    e.name, 
			--u.name as createdbyuser,
		    ie.link is null as nocurrentuservideo,
		    ie.video_code as code,
		    ie.link
		FROM exercise e 
		left join instructorexercise ie on e.id = ie.exercise_id and ie.useraccount_id=$1
		ORDER BY e.name`
	stmt, err := getTxPreparedStmt(db, tx, query)
	util.Check(err)

	var dest []ListExerciseQuery
	err = stmt.Select(&dest, userId)
	util.Check(err)
	return dest
}

func ListEquipment(db *DB, tx *sqlx.Tx) []ListEquipmentQuery {
	query := `
		SELECT id,name FROM equipment e ORDER BY e.name`
	stmt, err := getTxPreparedStmt(db, tx, query)
	util.Check(err)

	var dest []ListEquipmentQuery
	err = stmt.Select(&dest)
	util.Check(err)
	return dest
}

func ListActiveUserAccountSessions(db *DB) []UserAccountSession {
	query := `SELECT * FROM useraccountsession`
	stmt, err := getTxPreparedStmt(db, nil, query)
	defer stmt.Close()
	util.Check(err)

	dest := make([]UserAccountSession, 0)
	err = stmt.Select(&dest)
	util.Check(err)
	return dest
}

func GetUserActiveSession(db *DB, tx *sqlx.Tx, userId int64) *UserAccountSession {
	query := `SELECT * FROM useraccountsession where useraccount_id=$1`
	stmt, err := getTxPreparedStmt(db, tx, query)
	util.Check(err)

	var des UserAccountSession
	stmt.Get(&des, userId)
	return &des
}

func RemoveActiveSession(db *DB, tx *sqlx.Tx, userId int64) {
	query := "delete from useraccountsession where useraccount_id=$1"
	stmt, err := getTxPreparedStmt(db, tx, query)
	util.Check(err)

	_, err = stmt.Exec(userId)
	util.Check(err)
}

func SaveCreatedActiveSession(db *DB, tx *sqlx.Tx, token string, userId int64) *int64 {
	RemoveActiveSession(db, tx, userId)
	id := Insert(
		tx,
		&UserAccountSession{
			Token:         &token,
			UserAccountId: &userId,
		})
	return id
}

func CountRoutinesInPlanification(db *DB, tx *sqlx.Tx, planificationId int64) *int {
	query := "select count(1) from routine r where r.active=true and r.planification_id=$1"
	stmt, err := getTxPreparedStmt(db, tx, query)
	util.Check(err)

	var des int
	stmt.Get(&des, planificationId)
	return &des
}

func CreateUserAccount(db *DB, tx *sqlx.Tx, user *UserAccount) *int64 {
	id := Insert(
		tx,
		user)
	return id
}

func CreateRoutineDefault(db *DB, tx *sqlx.Tx, name string, planificationId, creatorId int64) *int64 {
	id := Insert(
		tx,
		&Routine{
			Name:            &name,
			PlanificationId: &planificationId,
			Difficulty:      util.PInt(1),
			Duration:        util.PString("01:00"),
			Active:          util.PBool(true),
			Cover:           util.PBool(false),
			CreatorId:       &creatorId,
			LastUpdatedDate: time.Now(),
		})
	return id
}

func CreateRoutineTemplateDefault(db *DB, tx *sqlx.Tx, name string, creatorId int64) *int64 {
	id := InsertSchema(
		tx,
		&Routine{
			Name:            &name,
			Difficulty:      util.PInt(1),
			Duration:        util.PString("01:00"),
			Active:          util.PBool(true),
			CreatorId:       &creatorId,
			Cover:           util.PBool(false),
			LastUpdatedDate: time.Now(),
		}, "template")
	return id
}

func CreateRoutine(db *DB, tx *sqlx.Tx, name string,
	planificationId, creatorId int64,
	difficulty int, duration string,
	cover bool,
	coverPath *string,
	coverUrl *string,
	coverUrlExpDate *time.Time) *int64 {
	id := Insert(
		tx,
		&Routine{
			Name:                   &name,
			PlanificationId:        &planificationId,
			Difficulty:             &difficulty,
			Duration:               &duration,
			Active:                 util.PBool(true),
			Cover:                  &cover,
			CoverImagePath:         coverPath,
			CoverImageUrl:          coverUrl,
			CoverUrlExpirationDate: coverUrlExpDate,
			CreatorId:              &creatorId,
			LastUpdatedDate:        time.Now(),
		})
	return id
}

func CreateBlockGrouper(db *DB, tx *sqlx.Tx, name string, routineId int64, order int) *int64 {
	id := Insert(
		tx,
		&BlockGroupGrouper{
			Name:            &name,
			RoutineId:       &routineId,
			Order:           &order,
			Active:          util.PBool(true),
			LastUpdatedDate: time.Now(),
			CreatorId:       nil,
		})
	return id
}

func CreateBlockGroup(
	db *DB,
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
			LastUpdatedDate:     time.Now(),
			Active:              util.PBool(true),
		})
	return id
}

func CreateExerciseBlockGroup(db *DB, tx *sqlx.Tx, blockId int64, exerciseId, order int, reps, secs *int, schema string) *int64 {
	id := InsertSchema(
		tx,
		&ExerciseBlockGroup{
			BlockGroupId:    &blockId,
			ExerciseId:      &exerciseId,
			Reps:            reps,
			Secs:            secs,
			Order:           &order,
			Active:          util.PBool(true),
			LastUpdatedDate: time.Now(),
		}, schema)

	return id
}

func CreatePlanification(db *DB, tx *sqlx.Tx, userId int64, name string, starred bool, mesocycle int) *int64 {
	id := Insert(
		tx,
		&Planification{
			Name:                    &name,
			CreatorId:               &userId,
			Starred:                 &starred,
			Mesocycle:               &mesocycle,
			LastMesocycleCopiedDate: util.PTime(time.Now().Add(-1 * time.Hour * 24)),
			Active:                  util.PBool(true),
			LastUpdatedDate:         time.Now(),
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

func DeletePlanificationById(db *DB, tx *sqlx.Tx, userId, planificationId int64) {
	query := "update planification set active=false, lastupdateddate=now() where id=$1 and creator_id=$2"
	stmt, err := getTxPreparedStmt(db, tx, query)
	util.Check(err)
	stmt.Exec(planificationId, userId)
}

func InsertPlanificationDays(db *DB, tx *sqlx.Tx, planificationId int64, days string) {
	Insert(
		tx,
		&PlanificationSchedule{
			PlanificationId: &planificationId,
			Days:            &days,
		})
}

func UpdateRoutineName(db *DB, tx *sqlx.Tx, routineId int64, name, schema string) {
	query := fmt.Sprintf(`
		update %sroutine r set name=$1, lastupdateddate=now() 
		where r.id=$2 and r.active=true`, schema)
	stmt, err := getTxPreparedStmt(db, tx, query)
	util.Check(err)

	stmt.Exec(name, routineId)
}

func UpdatePlanificationMesocycle(db *DB, tx *sqlx.Tx, planificationId int64, newMesocycle int) {
	query := `update planification set mesocycle=$1 where id=$2`
	stmt, err := getTxPreparedStmt(db, tx, query)
	util.Check(err)

	stmt.Exec(newMesocycle, planificationId)
}

func UpdatePlanificationObjective(db *DB, tx *sqlx.Tx, planificationId int64, newObjective string) {
	query := `update planification set objective=$1 where id=$2`
	stmt, err := getTxPreparedStmt(db, tx, query)
	util.Check(err)

	stmt.Exec(newObjective, planificationId)
}

func UpdatePlanificationMesocycleCopiedDate(db *DB, tx *sqlx.Tx, planificationId int64) {
	query := `update planification set lastmesocyclecopieddate=now() where id=$1`
	stmt, err := getTxPreparedStmt(db, tx, query)
	util.Check(err)

	stmt.Exec(planificationId)
}

func UpdatePlanificationDays(db *DB, tx *sqlx.Tx, planificationId int64, days string) {
	query := `update planificationschedule set days=$1 where planification_id=$2`
	stmt, err := getTxPreparedStmt(db, tx, query)
	util.Check(err)

	stmt.Exec(days, planificationId)
}

func UpdateGrouperNames(db *DB, tx *sqlx.Tx, routineId, grouperId int64, name, schema string) {
	query := fmt.Sprintf(`
		update %sblockgroupgrouper bg set name=$1, lastupdateddate=now() 
		from %sroutine r
		where bg.id=$3
		  and bg.routine_id = r.id 
		  and r.id=$2 and r.active=true and bg.active=true`, schema, schema)
	stmt, err := getTxPreparedStmt(db, tx, query)
	util.Check(err)

	stmt.Exec(name, routineId, grouperId)
}

func UpdateWorkout(db *DB, tx *sqlx.Tx,
	routineId, grouperId, workoutId int64,
	laps, exeInterval, lapInterval *int,
	schema string) {
	query := fmt.Sprintf(`
		update %sblockgroup set laps=$4, exerestinterval=$5, laprestinterval=$6, lastupdateddate=now() 
		where id=$1 and blockgroupgrouper_id=$2 and routine_id=$3`, schema)

	stmt, err := getTxPreparedStmt(db, tx, query)
	util.Check(err)

	stmt.Exec(workoutId, grouperId, routineId, laps, exeInterval, lapInterval)
}

//func UpdateExercisesBlockGroupOrderingByRoutine(db *DB, tx *sqlx.Tx, routineId int64) {
//	query := `
//		WITH Ordered AS (
//		SELECT
//			ebg.id,
//			ROW_NUMBER() OVER (PARTITION BY ebg.blockgroup_id ORDER BY ebg."order") AS order
//		FROM exerciseblockgroup ebg
//		inner join blockgroup b on ebg.blockgroup_id = b.id
//		where b.routine_id=$1 and ebg.active=true and b.active=true
//	)
//	UPDATE exerciseblockgroup eg
//	SET "order" = Ordered.order
//	FROM Ordered
//	WHERE eg.id = Ordered.id;`
//	stmt, err := getTxPreparedStmt(db, tx, query)
//	util.Check(err)
//
//	stmt.Exec(routineId)
//}

func CreateExercise(db *DB, tx *sqlx.Tx, name string, userAccountId int64) *int {
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

func AssociateExerciseEquipment(db *DB, tx *sqlx.Tx, exerciseId int, equipment []CreateExerciseEquipment) {
	for _, e := range equipment {
		Insert(
			tx,
			&ExerciseEquipment{
				EquipmentId:     e.Id,
				ExerciseId:      &exerciseId,
				Occurrences:     e.Occurrences,
				Required:        util.PBool(true),
				CreatedDate:     time.Now(),
				LastUpdatedDate: time.Now(),
			})
	}
}

func CountExercisesCreatedByUser(db *DB, tx *sqlx.Tx, userAccountId int64) *int {
	query := "select count(1) from exercise where createdbyuser_id=$1"
	stmt, err := getTxPreparedStmt(db, tx, query)
	util.Check(err)

	var des int
	stmt.Get(&des, userAccountId)
	return &des
}

func SaveExercisesBlock(db *DB, tx *sqlx.Tx,
	routineId int64,
	blockType, name string,
	duration, laps, lapRestInterval, exeRestInterval *int,
	exercises []ExerciseBlockGroup,
	blockGroupName string, blockGroupId *int64,
	order int,
	isTemplate bool,
	userId int64) *int64 {

	schema := ""
	var usrId *int64
	if isTemplate {
		schema = "template"
		usrId = &userId
	}

	if blockGroupId == nil {
		blockGroupId = InsertSchema(tx, &BlockGroupGrouper{
			Name:            &blockGroupName,
			RoutineId:       &routineId,
			Order:           &order,
			Active:          util.PBool(true),
			LastUpdatedDate: time.Now(),
			CreatorId:       usrId,
		}, schema)
	}

	id := InsertSchema(
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
			Active:              util.PBool(true),
			LastUpdatedDate:     time.Now(),
		}, schema)

	for i, ex := range exercises {
		CreateExerciseBlockGroup(db, tx, *id, *ex.ExerciseId, i, ex.Reps, ex.Secs, schema)
	}

	RegisterEvent(db, tx, userId, SaveExercisesBlockk)
	return id
}

func RegisterAnonymousEvent(db *DB, tx *sqlx.Tx, event AppEvent) {
	InsertSchema(tx, &Event{
		UserAccountId:   nil,
		LastUpdatedDate: time.Now(),
		Event:           util.PString(string(event)),
	}, "app")
}

func RegisterEvent(db *DB, tx *sqlx.Tx, userId int64, event AppEvent) {
	InsertSchema(tx, &Event{
		UserAccountId:   &userId,
		LastUpdatedDate: time.Now(),
		Event:           util.PString(string(event)),
	}, "app")
}

func SaveUserDevicePushNotificationSubscription(db *DB, tx *sqlx.Tx, userId int64, vapiddata string, deviceName string) {
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

func SaveUserTrainedToday(db *DB, tx *sqlx.Tx, userId int64, answer bool) {
	Insert(tx, &UserTrainingHistory{
		Date:          time.Now(),
		Answer:        &answer,
		UserAccountId: &userId,
	})
}

func GetUserLoadedTrainingToday(db *DB, tx *sqlx.Tx, userId int64) bool {
	query := "select date from usertraininghistory where useraccount_id=$1 order by id desc limit 1"
	stmt, err := getTxPreparedStmt(db, tx, query)
	util.Check(err)

	var lastTime time.Time
	stmt.Get(&lastTime, userId)
	lastYear, lastMonth, lastDay := lastTime.Date()
	year, month, day := time.Now().Date()
	return lastYear == year && lastMonth == month && lastDay == day
}

func GetUserIdByCode(db *DB, tx *sqlx.Tx, code string) int64 {
	query := "select id from useraccount where code=$1"
	stmt, err := getTxPreparedStmt(db, tx, query)
	util.Check(err)

	var userId int64
	err = stmt.Get(&userId, code)
	util.Check(err)
	return userId
}

func GetUserIdByUserNameNoError(db *DB, tx *sqlx.Tx, userName string) *int64 {
	query := "select id from useraccount where username=$1"
	stmt, err := getTxPreparedStmt(db, tx, query)
	util.Check(err)

	var userId *int64
	stmt.Get(&userId, userName)
	return userId
}

func GetAccountPlanIdByIdentifier(db *DB, tx *sqlx.Tx, iden AccountPlanType) *int {
	query := "select id from accountplan where identifier=$1"
	stmt, err := getTxPreparedStmt(db, tx, query)
	util.Check(err)

	var id *int
	stmt.Get(&id, string(iden))
	return id
}

func GetAccountPlanIdentifierByUserId(db *DB, tx *sqlx.Tx, userId int64) *AccountPlanType {
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

func GetUserAccountDetails(db *DB, tx *sqlx.Tx, userId int64) *GetUserAccountDetailsQuery {
	query := `
	   select u.name, u.email, u.pictureurl, a.name as accounttype, u.trainer, u.code from useraccount u
	   inner join accountplan a on u.accountplan_id = a.id
	   where u.id=$1`
	stmt, err := getTxPreparedStmt(db, tx, query)
	util.Check(err)

	var des GetUserAccountDetailsQuery
	stmt.Get(&des, userId)
	return &des
}

func RetrieveUserDeviceNotifationSubscription(db *DB, tx *sqlx.Tx, userId int64, deviceName string) string {
	query := "select vapiddata from userdevice where useraccount_id = $1 and name = $2"
	stmt, err := getTxPreparedStmt(db, tx, query)
	util.Check(err)

	var subscription string
	err = stmt.Get(&subscription, userId, deviceName)
	util.Check(err)
	return subscription
}

func SelectAllUserDeviceSubscriptions(db *DB) []UserDevice {
	query := "select * from userdevice"
	stmt, err := getTxPreparedStmt(db, nil, query)
	defer stmt.Close()
	util.Check(err)

	var subs []UserDevice
	stmt.Select(&subs)
	return subs
}

func SaveUserSharingToken(db *DB, tx *sqlx.Tx, planificationId, userId int64, routineId *int64, canBeSaved bool) {
	Insert(tx, &UserSharingToken{
		Creationdate:    time.Now(),
		CreatorId:       &userId,
		RoutineId:       routineId,
		PlanificationId: &planificationId,
		CanBeSaved:      &canBeSaved,
		IsValid:         util.PBool(true),
	})
}

func InvalidateSharingTokenForRoutine(db *DB, tx *sqlx.Tx, planificationId, routineId, userId int64) {
	query := `update usersharingtoken 
		set isvalid = false 
		where creator_id = $1 and routine_id is not null and routine_id=$2 and planification_id=$3`
	stmt, err := getTxPreparedStmt(db, tx, query)
	util.Check(err)

	stmt.Exec(userId, routineId, planificationId)
}

func GetRoutineUserSharingToken(db *DB, tx *sqlx.Tx, planificationId, routineId, userId int64) UserSharingToken {
	query := `
		select * from usersharingtoken 
		where creator_id = $1 and routine_id is not null and routine_id=$2 and planification_id=$3 and isvalid=true`
	stmt, err := getTxPreparedStmt(db, tx, query)
	util.Check(err)

	var des UserSharingToken
	stmt.Get(&des, userId, routineId, planificationId)
	return des
}

func GetRoutineUserSharingTokenBy(db *DB, tx *sqlx.Tx, routineId int64) UserSharingToken {
	query := `
		select * from usersharingtoken 
		where routine_id is not null and routine_id=$1 and isvalid=true`
	stmt, err := getTxPreparedStmt(db, tx, query)
	util.Check(err)

	var des UserSharingToken
	stmt.Get(&des, routineId)
	return des
}

func GetPlanificationUserSharingToken(db *DB, tx *sqlx.Tx, planificationId, userId int64) UserSharingToken {
	query := `
		select * from usersharingtoken 
		where creator_id = $1 and planification_id=$2 and isvalid=true`
	stmt, err := getTxPreparedStmt(db, tx, query)
	util.Check(err)

	var des UserSharingToken
	stmt.Get(&des, userId, planificationId)
	return des
}

func UserAlreadyRequestedAccessToSharedPlanification(db *DB, tx *sqlx.Tx, planificationId, userId int64) bool {
	query := `
		select count(1) from queueplanificationaccess 
		where useraccount_id=$1 and planification_id=$2`
	stmt, err := getTxPreparedStmt(db, tx, query)
	util.Check(err)

	var des int
	stmt.Get(&des, userId, planificationId)
	return des > 0
}

func QueueAccessRequestToSharedPlanification(db *DB, tx *sqlx.Tx, planificationId, userId int64) {
	Insert(
		tx,
		&QueuePlanificationAccess{
			PlanificationId: &planificationId,
			UserAccountId:   &userId,
		})
}

func ListQueuedPlanificationAccessRequests(db *DB, tx *sqlx.Tx, userId int64) []ListQueuedPlanificationAccessRequestsQuery {
	query := `
		select
			u.name as requestername,
			p.name as planificationname,
			q.planification_id,
			q.useraccount_id from planification p
		inner join queueplanificationaccess q on p.id = q.planification_id
		inner join useraccount u on q.useraccount_id = u.id
		where p.creator_id=$1 and p.active=true`
	stmt, err := getTxPreparedStmt(db, tx, query)
	util.Check(err)

	dest := make([]ListQueuedPlanificationAccessRequestsQuery, 0)
	stmt.Select(&dest, userId)
	return dest
}

func CalculateUserHasNoAccessToPlanification(db *DB, tx *sqlx.Tx, planificationId, userId int64) bool {
	query := "select count(1) from userplanification u where u.planification_id=$1 and u.useraccount_id=$2"
	stmt, err := getTxPreparedStmt(db, tx, query)
	util.Check(err)

	var des int
	stmt.Get(&des, planificationId, userId)
	return des == 0
}

func CalculateUserAlreadyActionatedARoutineToday(db *DB, tx *sqlx.Tx, planificationId, userId int64) bool {
	query := `
		select count(1) from userroutinehistory u 
		where u.planification_id=$1 and u.useraccount_id=$2 and u.createddate::date = CURRENT_DATE`
	stmt, err := getTxPreparedStmt(db, tx, query)
	util.Check(err)

	var des int
	stmt.Get(&des, planificationId, userId)
	return des > 0
}

func CalculatePlanificationAlreadyExecutedBySomeone(db *DB, tx *sqlx.Tx, planificationId int64) bool {
	query := `
		select count(1) from userroutinehistory u 
		where u.planification_id=$1`
	stmt, err := getTxPreparedStmt(db, tx, query)
	util.Check(err)

	var des int
	stmt.Get(&des, planificationId)
	return des > 0
}

func CalculateUserOwnsRoutine(db *DB, tx *sqlx.Tx, userId, planificationId, routineId int64) bool {
	query := `
		select count(1) from planification p 
		inner join routine r on p.id = r.planification_id 
		where p.active=true and r.active=true and p.creator_id=$1 and r.planification_id=$2 and r.id=$3 and r.creator_id=$1`
	stmt, err := getTxPreparedStmt(db, tx, query)
	util.Check(err)

	var des int
	stmt.Get(&des, userId, planificationId, routineId)
	return des > 0
}

func CalculateUserOwnsRoutineTemplate(db *DB, tx *sqlx.Tx, userId, routineId int64) bool {
	query := `
		select count(1) from template.routine r
		where r.active=true and r.creator_id=$1 and r.id=$2`
	stmt, err := getTxPreparedStmt(db, tx, query)
	util.Check(err)

	var des int
	stmt.Get(&des, userId, routineId)
	return des > 0
}

func CalculateUserOwnsPlanification(db *DB, tx *sqlx.Tx, userId, planificationId int64) bool {
	query := "select count(1) from planification p where p.creator_id=$1 and p.id=$2 and p.active=true"
	stmt, err := getTxPreparedStmt(db, tx, query)
	util.Check(err)

	var des int
	stmt.Get(&des, userId, planificationId)
	return des > 0
}

func CalculateUserCanCopyMesocyclePlanification(db *DB, tx *sqlx.Tx, userId, planificationId int64) bool {
	query := `select count(1) from planification p 
                where p.creator_id=$1 
                  and p.id=$2 
                  and p.active=true
                  and (lastmesocyclecopieddate is null or EXTRACT(DAY FROM (now() - lastmesocyclecopieddate)) > 0)`
	stmt, err := getTxPreparedStmt(db, tx, query)
	util.Check(err)

	var des int
	stmt.Get(&des, userId, planificationId)
	return des > 0
}

func CalculateRoutineBlocksAmount(db *DB, tx *sqlx.Tx, routineId int64) int {
	query := `select count(1) from blockgroup where routine_id=$1 and active=true`
	stmt, err := getTxPreparedStmt(db, tx, query)
	util.Check(err)

	var des int
	stmt.Get(&des, routineId)
	return des
}

func CalculateRoutineNumber(db *DB, tx *sqlx.Tx, userId int64) int {
	query := `select count(1) from template.routine where active=true and creator_id=$1`
	stmt, err := getTxPreparedStmt(db, tx, query)
	util.Check(err)

	var des int
	stmt.Get(&des, userId)
	return des
}

func CalculateUserAlreadyCopiedRoutine(db *DB, tx *sqlx.Tx, userId, routineId int64) bool {
	query := "select count(1) from userroutinecopy where useraccount_id=$1 and routine_id=$2"
	stmt, err := getTxPreparedStmt(db, tx, query)
	util.Check(err)

	var des int
	stmt.Get(&des, userId, routineId)
	return des > 0
}

func CalculateGrouperWorkoutBelongToRoutine(db *DB, tx *sqlx.Tx, routineId, grouperId, workoutId int64, schema string) bool {
	query := fmt.Sprintf(`
		select count(1) 
		from %sblockgroupgrouper bg 
		inner join %sblockgroup b on bg.id = b.blockgroupgrouper_id
		where bg.routine_id=$1 and bg.id=$2 and b.id=$3 and bg.active=true and b.active=true`, schema, schema)
	stmt, err := getTxPreparedStmt(db, tx, query)
	util.Check(err)

	var des int
	stmt.Get(&des, routineId, grouperId, workoutId)
	return des == 1
}

func CalculateRmBelongToUser(db *DB, tx *sqlx.Tx, userId, rmId int64) bool {
	query := `
		select count(1) 
		from userexerciserm ue 
		where ue.id=$1 and ue.useraccount_id=$2`
	stmt, err := getTxPreparedStmt(db, tx, query)
	util.Check(err)

	var des int
	stmt.Get(&des, rmId, userId)
	return des == 1
}

func ListLast7UserRmHistory(db *DB, tx *sqlx.Tx, userId int64) []ListLast7UserRmHistoryQuery {
	query := `
		WITH ranked_data AS (
			SELECT
				ue.id,
				u.rm,
				u.createddate,
				ROW_NUMBER() OVER (PARTITION BY u.userexerciserm_id ORDER BY u.createddate DESC) as rn
			FROM userexerciserm ue
			left join userexercisermhistory u on ue.id = u.userexerciserm_id
			where ue.useraccount_id=$1 order by ue.grouper, ue."order", u.createddate
		)
		SELECT
			id,
			rm,
			createddate as date
		FROM ranked_data
		WHERE rn <= 7`
	stmt, err := getTxPreparedStmt(db, tx, query)
	util.Check(err)
	var des []ListLast7UserRmHistoryQuery
	stmt.Select(&des, userId)
	return des
}

func ListUserAccountEquipment(db *DB, tx *sqlx.Tx, userId int64) []ListUserAccountEquipmentQuery {
	query := `
		SELECT
			e.name,
			u.weight, 
			u.height, 
			u.width, 
			u.units
		FROM useraccountequipment u 
		inner join equipment e on u.equipment_id = e.id
		where u.useraccount_id=$1 order by e.name, u.weight`
	stmt, err := getTxPreparedStmt(db, tx, query)
	util.Check(err)
	des := make([]ListUserAccountEquipmentQuery, 0)
	stmt.Select(&des, userId)
	return des
}

func InsertUserRoutineHistory(db *DB, tx *sqlx.Tx, completed bool, planificationId *int64, routineId, userId int64) {
	Insert(
		tx,
		&UserRoutineHistory{
			PlanificationId: planificationId,
			RoutineId:       &routineId,
			UserAccountId:   &userId,
			Completed:       &completed,
			CreatedDate:     time.Now(),
		})
}

func InsertUserRoutineCopy(db *DB, tx *sqlx.Tx, userId, routineId int64) {
	Insert(tx, &UserRoutineCopy{
		RoutineId:     &routineId,
		UserAccountId: &userId,
		CreatedDate:   time.Now(),
	})
}

func InsertNewUserRmHistory(db *DB, tx *sqlx.Tx, rmId int64, rm int) {
	Insert(tx, &UserExerciseRMHistory{
		UeId:        &rmId,
		Rm:          &rm,
		CreatedDate: time.Now(),
	})
}

func InsertNewRoutineHistory(db *DB, tx *sqlx.Tx, routineId, userId int64, rpe int) *int64 {
	return InsertSchema(tx, &history.Routine{
		UserAccountId: &userId,
		RoutineId:     &routineId,
		Date:          time.Now(),
		Rpe:           &rpe,
	}, "history")
}

func InsertNewExerciseHistory(db *DB, tx *sqlx.Tx, routineId, historyId, userId, exerciseId int64, reps, effectiveReps, kg int) {
	InsertSchema(tx, &history.Exercise{
		UserAccountId: &userId,
		RoutineId:     &routineId,
		HistoryId:     &historyId,
		Date:          time.Now(),
		ExerciseId:    &exerciseId,
		Reps:          &reps,
		EffectiveReps: &effectiveReps,
		Kg:            &kg,
	}, "history")
}

func InsertUserAccountEquipment(
	db *DB, tx *sqlx.Tx,
	userId, equipmentId int64,
	units int,
	weight, height, width *float32) {
	Insert(tx, &UserAccountEquipment{
		EquipmentId:         &equipmentId,
		UserAccountId:       &userId,
		Weightmeasureunit:   util.PInt8(1),
		Distancemeasureunit: util.PInt8(1),
		Units:               &units,
		Weight:              weight,
		Height:              height,
		Width:               width,
	})
}

func InsertInstructorVideoLink(
	db *DB, tx *sqlx.Tx,
	userId, exerciseId int64,
	link string) {
	Insert(tx, &InstructorExercise{
		ExerciseId:    &exerciseId,
		UserAccountId: &userId,
		VideoCode:     util.PString(""),
		Link:          &link,
	})
}

func GenerateUserExerciseRm(db *DB, tx *sqlx.Tx, userId int64) {
	data := []struct {
		Name    string
		Grouper int
		Order   int
	}{
		{"Dominada", 0, 0},
		{"Fondo", 0, 1},
		{"Peso Muerto", 1, 0},
		{"Press de Banca", 1, 1},
		{"Sentadilla", 1, 2},
	}
	query := `
		insert into userexerciserm(useraccount_id, exercise_id, rm, grouper, "order", lastupdateddate)
		values($1, (select id from exercise where name = $2), 0, $3, $4, now())`
	stmt, err := getTxPreparedStmt(db, tx, query)
	util.Check(err)
	for _, d := range data {
		_, err = stmt.Exec(userId, d.Name, d.Grouper, d.Order)
		util.Check(err)
	}
}

func UpdateUserRmSummary(db *DB, tx *sqlx.Tx, rmId int64, rm int) {
	query := "update userexerciserm set rm=$2, lastupdateddate=now() where id=$1"
	stmt, err := getTxPreparedStmt(db, tx, query)
	util.Check(err)
	stmt.Exec(rmId, rm)
}

func AcceptPlanificationAccessRequest(db *DB, tx *sqlx.Tx, planificationId, requesterUserId, userId int64, plan *AccountPlanType) {
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

func DeclinePlanificationAccessRequest(db *DB, tx *sqlx.Tx, planificationId, requesterUserId, userId int64) {
	query := "delete from queueplanificationaccess where useraccount_id=$1 and planification_id=$2"
	stmt, err := getTxPreparedStmt(db, tx, query)
	util.Check(err)
	stmt.Exec(requesterUserId, planificationId)
}

func UpdateRoutineCoverUrl(db *DB, tx *sqlx.Tx, schema string, routineId int64, path, preSigUrl string, expiration time.Time) {
	query := fmt.Sprintf(`update %sroutine 
	set cover=true, coverimageurl=$3, coverimagepath=$4, 
    coverurlexpirationdate=$2, lastupdateddate=now() where id=$1`, schema)
	stmt, err := getTxPreparedStmt(db, tx, query)
	util.Check(err)
	stmt.Exec(routineId, expiration, preSigUrl, path)
}

func DeleteRoutine(db *DB, tx *sqlx.Tx, routineId int64) {
	query := "update routine set active=false, lastupdateddate=now() where id=$1"
	stmt, err := getTxPreparedStmt(db, tx, query)
	util.Check(err)
	stmt.Exec(routineId)
}

func DeleteBlockGrouper(db *DB, tx *sqlx.Tx, routineId, grouperId int64, schema string) {
	query := fmt.Sprintf("update %sblockgroupgrouper set active=false, lastupdateddate=now() where id=$1 and routine_id=$2", schema)
	stmt, err := getTxPreparedStmt(db, tx, query)
	util.Check(err)
	stmt.Exec(grouperId, routineId)
}

func DeleteWorkoutsByGrouperId(db *DB, tx *sqlx.Tx, routineId, grouperId int64, schema string) {
	query := fmt.Sprintf("update %sblockgroup set active=false, lastupdateddate=now() where routine_id=$1 and blockgroupgrouper_id=$2", schema)
	stmt, err := getTxPreparedStmt(db, tx, query)
	util.Check(err)
	stmt.Exec(routineId, grouperId)
}

func DeleteExerciseBlockGroupByGrouperId(db *DB, tx *sqlx.Tx, routineId, grouperId int64, schema string) {
	query := fmt.Sprintf(`
		update %sexerciseblockgroup eb
		set active=false, lastupdateddate=now() 
		from %sblockgroup b 
		where b.id = eb.blockgroup_id and b.routine_id=$1 and b.blockgroupgrouper_id=$2`, schema, schema)
	stmt, err := getTxPreparedStmt(db, tx, query)
	util.Check(err)
	stmt.Exec(routineId, grouperId)
}

func DeleteExerciseBlockGroupByWorkoutId(db *DB, tx *sqlx.Tx, routineId, grouperId, workoutId int64, schema string) {
	query := fmt.Sprintf(`
		update %sexerciseblockgroup eb
		set active=false, lastupdateddate=now() 
		from %sblockgroup b 
		where b.id = eb.blockgroup_id and eb.blockgroup_id=$1  and b.routine_id=$2 and b.blockgroupgrouper_id=$3`, schema, schema)
	stmt, err := getTxPreparedStmt(db, tx, query)
	util.Check(err)
	stmt.Exec(workoutId, routineId, grouperId)
}

func DeleteExerciseBlockGroup(db *DB, tx *sqlx.Tx, routineId, grouperId, workoutId int64, exerciseId int, schema string) {
	query := fmt.Sprintf(`
		update %sexerciseblockgroup eb
		set active=false, lastupdateddate=now() 
		from %sblockgroup b 
		where b.id = eb.blockgroup_id and eb.blockgroup_id=$1 and eb.id=$2 and b.routine_id=$3 and b.blockgroupgrouper_id=$4`, schema, schema)
	stmt, err := getTxPreparedStmt(db, tx, query)
	util.Check(err)
	stmt.Exec(workoutId, exerciseId, routineId, grouperId)
}

func DeleteWorkout(db *DB, tx *sqlx.Tx, routineId, grouperId, workoutId int64, schema string) {
	query := fmt.Sprintf("update %sblockgroup set active=false, lastupdateddate=now() where id=$1 and routine_id=$2 and blockgroupgrouper_id=$3", schema)
	stmt, err := getTxPreparedStmt(db, tx, query)
	util.Check(err)
	stmt.Exec(workoutId, routineId, grouperId)
}

func ListBlockGroupGrouperByRoutineId(db *DB, tx *sqlx.Tx, routineId int64, schema string) []BlockGroupGrouper {
	query := fmt.Sprintf(`select * from %sblockgroupgrouper where routine_id=$1 and active=true order by id`, schema)
	stmt, err := getTxPreparedStmt(db, tx, query)
	util.Check(err)
	var des []BlockGroupGrouper
	stmt.Select(&des, routineId)
	return des
}

func ListBlockGroupByRoutineId(db *DB, tx *sqlx.Tx, routineId, bgId int64, schema string) []BlockGroup {
	query := fmt.Sprintf(`select * from 
             %sblockgroup where routine_id=$1 and blockgroupgrouper_id=$2 and active=true order by id`, schema)
	stmt, err := getTxPreparedStmt(db, tx, query)
	util.Check(err)
	var des []BlockGroup
	err = stmt.Select(&des, routineId, bgId)
	util.Check(err)
	return des
}

func ListBlockGroupExerciseByBlockId(db *DB, tx *sqlx.Tx, blockId int64, schema string) []ExerciseBlockGroup {
	query := fmt.Sprintf(`select * from %sexerciseblockgroup where blockgroup_id=$1 and active=true order by "order"`, schema)
	stmt, err := getTxPreparedStmt(db, tx, query)
	util.Check(err)
	var des []ExerciseBlockGroup
	stmt.Select(&des, blockId)
	return des
}

func ListUserExerciseRmByUserId(db *DB, tx *sqlx.Tx, userId int64) []ListUserExerciseRmQuery {
	query := `
		select ue.id, e.name, ue.rm, ue.lastupdateddate, ue.grouper, ue."order" from userexerciserm ue
		 inner join exercise e on ue.exercise_id = e.id
		 where ue.useraccount_id=$1 order by ue.grouper, ue."order"`
	stmt, err := getTxPreparedStmt(db, tx, query)
	util.Check(err)
	var des []ListUserExerciseRmQuery
	stmt.Select(&des, userId)
	return des
}

func InsertEventUser(
	db *DB,
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

func ListLatestEventsBy(db *DB, tx *sqlx.Tx, receiverId int64) []ListLatestEventsByQuery {
	query := `
		select eu.type, u.name as sendername, p.name as planificationname, r.name as routinename from eventuser eu
		inner join useraccount u on eu.sender_id = u.id
		left join routine r on eu.routine_id = r.id
		left join planification p on eu.planification_id = p.id		
        where receiver_id=$1 and eu.createddate >= CURRENT_DATE - INTERVAL '1 month' order by eu.id desc limit 50`
	stmt, err := getTxPreparedStmt(db, tx, query)
	util.Check(err)
	var des []ListLatestEventsByQuery
	stmt.Select(&des, receiverId)
	return des
}

func EnqueuePlanificationOperation(db *DB, tx *sqlx.Tx,
	userId, planificationId int64,
	operation PlanificationOperation,
	routineId *int64,
	isTemplate bool) {
	query := `insert into queue.planificationoperation(
		 useraccount_id, planification_id, routineid, istemplate, operation, completed, createddate, lastupdateddate) 
		values($1, $2, $3, $4, $5, false, now(), now())`
	stmt, err := getTxPreparedStmt(db, tx, query)
	util.Check(err)
	stmt.Exec(userId, planificationId, routineId, isTemplate, operation)
}

func MarkPlanificationOperationCompleted(db *DB, tx *sqlx.Tx, operationId int64) {
	query := `update queue.planificationoperation set completed=true, lastupdateddate=now() where id=$1`
	stmt, err := getTxPreparedStmt(db, tx, query)
	util.Check(err)
	stmt.Exec(operationId)
}

func ListQueuedPlanificationOperations(db *DB) []QueuePlanificationOperation {
	des := make([]QueuePlanificationOperation, 0)
	query := `select * from queue.planificationoperation where completed=false`
	stmt, err := getTxPreparedStmt(db, nil, query)
	util.Check(err)
	stmt.Select(&des)
	return des
}

func ListOverduePaidEliteAthleteAccounts(db *DB) []int64 {
	des := make([]int64, 0)
	query := `select id from useraccount where accountplan_id=2 and EXTRACT(DAY FROM (now() - lastpaymentdate)) > 30`
	stmt, err := getTxPreparedStmt(db, nil, query)
	util.Check(err)
	stmt.Select(&des)
	return des
}

func UpdateAccountToAthleteBasic(db *DB) {
	query := `update useraccount set accountplan_id=1, usertype='s' 
                   where accountplan_id=2 and EXTRACT(DAY FROM (now() - lastpaymentdate)) > 30`
	stmt, err := getTxPreparedStmt(db, nil, query)
	util.Check(err)
	stmt.Exec()
}
