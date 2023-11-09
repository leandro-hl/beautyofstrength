package db

import "time"

type ListExerciseIdName struct {
	Id   *int    `json:"id"`
	Name *string `json:"name"`
}

type ListExercise struct {
	Id            *int    `json:"id"`
	Name          *string `json:"name"`
	CreatedByUser *string `json:"createdbyuser"`
}

type ListQueuedPlanificationAccessRequestsQuery struct {
	RequesterName     *string `json:"requestername"`
	PlanificationName *string `json:"planificationname"`
	PlanificationId   *int64  `json:"planification_id"`
	UserAccountId     *int64  `json:"useraccount_id"`
}

type ListPlanificationsQuery struct {
	Id            *int    `json:"id"`
	Name          *string `json:"name"`
	Owner         *bool   `json:"owner"`
	RoutinesCount *int    `json:"routinescount"`
}

type GetUserAccountDetailsQuery struct {
	Name        *string `json:"name"`
	Email       *string `json:"email"`
	PictureUrl  *string `json:"pictureurl"`
	AccountType *string `json:"accounttype"`
}

type GetRoutineDetailsQuery struct {
	Routineid       *int64  `json:"routineid"`
	Routinename     *string `json:"routinename"`
	Blockgroupid    *int64  `json:"blockgroupid"`
	Blockgroupname  *string `json:"blockgroupname"`
	BlockDuration   *int    `json:"blockgroupduration"`
	Laps            *int    `json:"laps"`
	Type            *string `json:"type"`
	Exerestinterval *int    `json:"exerestinterval"`
	Laprestinterval *int    `json:"laprestinterval"`
	Reps            *int    `json:"reps"`
	Secs            *int    `json:"secs"`
	Exercisename    *string `json:"exercisename"`
}

type ListRoutinesQuery struct {
	Id              *int    `json:"id"`
	Name            *string `json:"name"`
	PlanificationId *int64  `json:"planification_id"`
	BlockCount      *int    `json:"blockcount"`
	Completed       *bool   `json:"completed"`
	IsActionable    bool    `json:"isActionable"`
	IsStartOfWeek   bool    `json:"isStartOfWeek"`
}

type GetPlanificationScheduleQuery struct {
	Id                *int64    `json:"id"`
	PlanificationId   *int64    `json:"planification_id"`
	Days              *string   `json:"days"`
	AccessUpToRoutine *int      `json:"accessuptoroutine"`
	AccessLastUpdated time.Time `json:"accesslastupdated"`
}
