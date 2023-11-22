package db

import "time"

type ListExerciseIdName struct {
	Id   *int    `json:"id"`
	Name *string `json:"name"`
}

type ListExerciseQuery struct {
	Id   *int    `json:"id"`
	Name *string `json:"name"`
	//CreatedByUser      *string `json:"createdbyuser"`
	NoCurrentUserVideo *bool `json:"nocurrentuservideo"`
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
	Starred       *bool   `json:"starred"`
	RoutinesCount *int    `json:"routinescount"`
}

type GetUserAccountDetailsQuery struct {
	Name        *string `json:"name"`
	Email       *string `json:"email"`
	PictureUrl  *string `json:"pictureurl"`
	AccountType *string `json:"accounttype"`
}

type GetRoutineHeaderQuery struct {
	Routineid     *int64  `json:"routineid"`
	Routinename   *string `json:"routinename"`
	Difficulty    *int    `json:"difficulty"`
	Duration      *string `json:"duration"`
	TimesMarked   *int    `json:"timesmarked"`
	IsCopy        *bool   `json:"iscopy"`
	AlreadyCopied *bool   `json:"alreadycopied"`
}

type GetRoutineDetailsQuery struct {
	GrouperId       *int64  `json:"grouperid"`
	GrouperName     *string `json:"groupername"`
	GrouperOrder    *int    `json:"grouperorder"`
	Blockgroupid    *int64  `json:"blockgroupid"`
	Blockgroupname  *string `json:"blockgroupname"`
	BlockDuration   *int    `json:"blockgroupduration"`
	Laps            *int    `json:"laps"`
	Type            *string `json:"type"`
	Exerestinterval *int    `json:"exerestinterval"`
	Laprestinterval *int    `json:"laprestinterval"`
	Reps            *int    `json:"reps"`
	Secs            *int    `json:"secs"`
	ExerciseBGID    *int64  `json:"exercisebgid"`
	Exercisename    *string `json:"exercisename"`
	VideoCode       *string `json:"videocode"`
}

type ListRoutinesQuery struct {
	Id              *int    `json:"id"`
	Name            *string `json:"name"`
	PlanificationId *int64  `json:"planification_id"`
	Difficulty      *int    `json:"difficulty"`
	Duration        *string `json:"duration"`
	BlockCount      *int    `json:"blockcount"`
	WorkCount       *int    `json:"workcount"`
	Completed       *bool   `json:"completed"`
}

type GetPlanificationScheduleQuery struct {
	Id                *int64    `json:"id"`
	PlanificationId   *int64    `json:"planification_id"`
	Days              *string   `json:"days"`
	AccessUpToRoutine *int      `json:"accessuptoroutine"`
	AccessLastUpdated time.Time `json:"accesslastupdated"`
}

type ListLatestEventsByQuery struct {
	SenderName        *string        `json:"sendername"`
	PlanificationName *string        `json:"planificationname"`
	RoutineName       *string        `json:"routinename"`
	Type              *EventUserType `json:"type"`
}
