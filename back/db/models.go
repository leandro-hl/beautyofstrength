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

type Planification struct {
	Id        *int    `json:"id"`
	Name      *string `json:"name"`
	CreatorId *int64  `json:"creator_id"`
}

type PlanificationSchedule struct {
	Id              *int64  `json:"id"`
	PlanificationId *int64  `json:"planification_id"`
	Days            *string `json:"days"`
}

type Routine struct {
	Id              *int    `json:"id"`
	Name            *string `json:"name"`
	PlanificationId *int64  `json:"planification_id"`
	Difficulty      *int    `json:"difficulty"`
}

type Exercise struct {
	Id                  *int      `json:"id"`
	Name                *string   `json:"name"`
	TechnicalComplexity *int      `json:"technicalcomplexity"`
	CreatedByUserId     *int64    `json:"createdbyuser_id"`
	CreatedDate         time.Time `json:"createddate"`
}

type BlockGroupGrouper struct {
	Id        *int64  `json:"id"`
	Name      *string `json:"name"`
	RoutineId *int64  `json:"routine_id"`
}

type BlockGroup struct {
	Id                  *int64  `json:"id"`
	Name                *string `json:"name"`
	Duration            *int    `json:"duration"`
	Laps                *int    `json:"laps"`
	Type                *string `json:"type"`
	LapRestInterval     *int    `json:"lapRestInterval"`
	ExeRestInterval     *int    `json:"exeRestInterval"`
	RoutineId           *int64  `json:"routine_id"`
	BlockGroupGrouperId *int64  `json:"blockgroupgrouper_id"`
}

type ExerciseBlockGroup struct {
	Id           *int64 `json:"id"`
	BlockGroupId *int64 `json:"blockgroup_id"`
	ExerciseId   *int   `json:"exercise_id"`
	Reps         *int   `json:"reps"`
	Secs         *int   `json:"secs"`
}

type AccountPlan struct {
	Id         *int    `json:"id"`
	Name       *string `json:"name"`
	Identifier *string `json:"identifier"`
}

type UserAccount struct {
	Id            *int64  `json:"id"`
	Name          *string `json:"name"`
	Username      *string `json:"username"`
	Email         *string `json:"email"`
	EmailVerified *bool   `json:"emailverified"`
	UserType      *string `json:"usertype"`
	Password      *string `json:"password"`
	PictureUrl    *string `json:"pictureurl"`
	Locale        *string `json:"locale"`
	AccountPlanId *int    `json:"accountplan_id"`
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
	IsValid         *bool     `json:"isvalid"`
}

type QueuePlanificationAccess struct {
	Id              *int64 `json:"id"`
	PlanificationId *int64 `json:"planification_id"`
	UserAccountId   *int64 `json:"useraccount_id"`
}
