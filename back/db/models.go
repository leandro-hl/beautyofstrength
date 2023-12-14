package db

import "time"

type UserPlanificationRelationshipType rune

const (
	Creator UserPlanificationRelationshipType = 'c'
	Student UserPlanificationRelationshipType = 's'
)

type AccountPlanType rune

const (
	Professor      AccountPlanType = 'p'
	StudentFree    AccountPlanType = 's'
	StudentPremium AccountPlanType = 'z'
)

type EventUserType string

const (
	SavedCopyOfRoutine     EventUserType = "scr"
	LastMesocycleGenerated               = "pcm"
)

type EventUser struct {
	Id              *int64         `json:"id"`
	Type            *EventUserType `json:"type"`
	ReceiverId      *int64         `json:"receiver_id"`
	SenderId        *int64         `json:"sender_id"`
	PlanificationId *int64         `json:"planification_id"`
	RoutineId       *int64         `json:"routine_id"`
	CreatedDate     time.Time      `json:"createddate"`
}

type Planification struct {
	Id                      *int64     `json:"id"`
	Name                    *string    `json:"name"`
	Starred                 *bool      `json:"starred"`
	Mesocycle               *int       `json:"mesocycle"`
	CreatorId               *int64     `json:"creator_id"`
	Active                  *bool      `json:"active"`
	LastMesocycleCopiedDate *time.Time `json:"lastmesocyclecopieddate"`
	LastUpdatedDate         time.Time  `json:"lastupdateddate"`
}

type PlanificationSchedule struct {
	Id              *int64  `json:"id"`
	PlanificationId *int64  `json:"planification_id"`
	Days            *string `json:"days"`
}

type Equipment struct {
	Id              *int64    `json:"id"`
	Name            *string   `json:"name"`
	AddedWeight     *bool     `json:"addedweight"`
	CreatedDate     time.Time `json:"createddate"`
	LastUpdatedDate time.Time `json:"lastupdateddate"`
}

type ExerciseEquipment struct {
	Id              *int64    `json:"id"`
	EquipmentId     *int64    `json:"equipment_id"`
	ExerciseId      *int      `json:"exercise_id"`
	Occurrences     *int      `json:"occurrences"`
	Required        *bool     `json:"required"`
	CreatedDate     time.Time `json:"createddate"`
	LastUpdatedDate time.Time `json:"lastupdateddate"`
}

type Routine struct {
	Id              *int64    `json:"id"`
	Name            *string   `json:"name"`
	PlanificationId *int64    `json:"planification_id"`
	Difficulty      *int      `json:"difficulty"`
	Duration        *string   `json:"duration"`
	Active          *bool     `json:"active"`
	CreatorId       *int64    `json:"creator_id"`
	LastUpdatedDate time.Time `json:"lastupdateddate"`
}

type Exercise struct {
	Id                  *int      `json:"id"`
	Name                *string   `json:"name"`
	TechnicalComplexity *int      `json:"technicalcomplexity"`
	CreatedByUserId     *int64    `json:"createdbyuser_id"`
	CreatedDate         time.Time `json:"createddate"`
}

type BlockGroupGrouper struct {
	Id              *int64    `json:"id"`
	Name            *string   `json:"name"`
	RoutineId       *int64    `json:"routine_id"`
	Order           *int      `json:"order"`
	LastUpdatedDate time.Time `json:"lastupdateddate"`
	Active          *bool     `json:"active"`
}

type BlockGroup struct {
	Id                  *int64    `json:"id"`
	Name                *string   `json:"name"`
	Duration            *int      `json:"duration"`
	Laps                *int      `json:"laps"`
	LapRestInterval     *int      `json:"laprestinterval"`
	ExeRestInterval     *int      `json:"exerestinterval"`
	Type                *string   `json:"type"`
	RoutineId           *int64    `json:"routine_id"`
	BlockGroupGrouperId *int64    `json:"blockgroupgrouper_id"`
	LastUpdatedDate     time.Time `json:"lastupdateddate"`
	Active              *bool     `json:"active"`
}

type ExerciseBlockGroup struct {
	Id              *int64    `json:"id"`
	BlockGroupId    *int64    `json:"blockgroup_id"`
	ExerciseId      *int      `json:"exercise_id"`
	Reps            *int      `json:"reps"`
	Secs            *int      `json:"secs"`
	LastUpdatedDate time.Time `json:"lastupdateddate"`
	Active          *bool     `json:"active"`
	Order           *int      `json:"order"`
}

type AccountPlan struct {
	Id         *int    `json:"id"`
	Name       *string `json:"name"`
	Identifier *string `json:"identifier"`
}

type UserAccount struct {
	Id            *int64    `json:"id"`
	Name          *string   `json:"name"`
	Username      *string   `json:"username"`
	Email         *string   `json:"email"`
	EmailVerified *bool     `json:"emailverified"`
	UserType      *string   `json:"usertype"`
	Password      *string   `json:"password"`
	PictureUrl    *string   `json:"pictureurl"`
	Locale        *string   `json:"locale"`
	AccountPlanId *int      `json:"accountplan_id"`
	CreatedDate   time.Time `json:"createddate"`
}

type UserAccountSession struct {
	Id            *int64  `json:"id"`
	Token         *string `json:"token"`
	UserAccountId *int64  `json:"useraccount_id"`
}

type UserDevice struct {
	Id            *int64  `json:"id"`
	Name          *string `json:"name"`
	VapidData     *string `json:"vapiddata"`
	UserAccountId *int64  `json:"useraccount_id"`
}

type UserTrainingHistory struct {
	Id            *int64    `json:"id"`
	Date          time.Time `json:"date"`
	Answer        *bool     `json:"answer"`
	UserAccountId *int64    `json:"useraccount_id"`
}

type UserPlanification struct {
	Id                *int64    `json:"id"`
	PlanificationId   *int64    `json:"planification_id"`
	UserAccountId     *int64    `json:"useraccount_id"`
	AccessUpToRoutine *int      `json:"accessuptoroutine"`
	AccessLastUpdated time.Time `json:"accesslastupdated"`
}

type UserRoutineHistory struct {
	Id              *int64    `json:"id"`
	PlanificationId *int64    `json:"planification_id"`
	RoutineId       *int64    `json:"routine_id"`
	UserAccountId   *int64    `json:"useraccount_id"`
	Completed       *bool     `json:"completed"`
	CreatedDate     time.Time `json:"createddate"`
}

type WebPushNotificationSubscription struct {
	Endpoint       *string    `json:"endpoint"`
	ExpirationTime *time.Time `json:"expirationTime"`
	Keys           *struct {
		P256dh *string `json:"p256dh"`
		Auth   *string `json:"auth"`
	} `json:"keys"`
}

type UserSharingToken struct {
	Id              *int64    `json:"id"`
	Creationdate    time.Time `json:"creationdate"`
	CreatorId       *int64    `json:"creator_id"`
	RoutineId       *int64    `json:"routine_id"`
	PlanificationId *int64    `json:"planification_id"`
	CanBeSaved      *bool     `json:"canbesaved"`
	IsValid         *bool     `json:"isvalid"`
}

type QueuePlanificationAccess struct {
	Id              *int64 `json:"id"`
	PlanificationId *int64 `json:"planification_id"`
	UserAccountId   *int64 `json:"useraccount_id"`
}

type UserRoutineCopy struct {
	Id            *int64    `json:"id"`
	RoutineId     *int64    `json:"routine_id"`
	UserAccountId *int64    `json:"useraccount_id"`
	CreatedDate   time.Time `json:"createddate"`
}

type UserExerciseRM struct {
	Id            *int64    `json:"id"`
	ExerciseId    *int      `json:"exercise_id"`
	UserAccountId *int64    `json:"useraccount_id"`
	Rm            *int      `json:"rm"`
	Grouper       *int      `json:"grouper"`
	Order         *int      `json:"order"`
	CreatedDate   time.Time `json:"createddate"`
}

type UserExerciseRMHistory struct {
	Id          *int64    `json:"id"`
	UeId        *int64    `json:"userexerciserm_id"`
	Rm          *int      `json:"rm"`
	CreatedDate time.Time `json:"createddate"`
}

type QueuePlanificationOperation struct {
	Id              *int64                  `json:"id"`
	UserAccountId   *int64                  `json:"useraccount_id"`
	PlanificationId *int64                  `json:"planification_id"`
	Operation       *PlanificationOperation `json:"operation"`
	Completed       *bool                   `json:"completed"`
	CreatedDate     time.Time               `json:"createddate"`
	LastUpdatedDate time.Time               `json:"lastupdateddate"`
}
