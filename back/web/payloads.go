package main

type SignUpRequest struct {
	Username *string `json:"username"`
	Password *string `json:"password"`
}

type SignInRequest struct {
	Username *string `json:"username"`
	Password *string `json:"password"`
}

type SaveExercisesBlockCptRequest struct {
	RoutineId         *int64            `json:"routineId"`
	PlanificationId   *int64            `json:"planificationId"`
	Exercises         []ExerciseRequest `json:"exercises"`
	Laps              *int              `json:"laps"`
	BlockName         *string           `json:"blockName"`
	NewBlockGroupId   *int64            `json:"newBlockGroupId"`
	NewBlockGroupName *string           `json:"newBlockGroupName"`
	WorkingInterval   *int              `json:"workingInterval"`
	RestingInteval    *int              `json:"restingInteval"`
}

type SaveExercisesBlockFreeRequest struct {
	RoutineId         *int64            `json:"routineId"`
	PlanificationId   *int64            `json:"planificationId"`
	Exercises         []ExerciseRequest `json:"exercises"`
	Laps              *int              `json:"laps"`
	BlockName         *string           `json:"blockName"`
	NewBlockGroupId   *int64            `json:"newBlockGroupId"`
	NewBlockGroupName *string           `json:"newBlockGroupName"`
	RestingInteval    *int              `json:"restingInteval"`
	ExeRestingInteval *int              `json:"exeRestingInteval"`
}

type SaveExercisesBlockAmrapRequest struct {
	RoutineId         *int64            `json:"routineId"`
	PlanificationId   *int64            `json:"planificationId"`
	Exercises         []ExerciseRequest `json:"exercises"`
	BlockDuration     *int              `json:"blockDuration"`
	BlockName         *string           `json:"blockName"`
	NewBlockGroupId   *int64            `json:"newBlockGroupId"`
	NewBlockGroupName *string           `json:"newBlockGroupName"`
}

type SaveExercisesBlockComboRequest struct {
	RoutineId         *int64            `json:"routineId"`
	PlanificationId   *int64            `json:"planificationId"`
	Exercises         []ExerciseRequest `json:"exercises"`
	BlockName         *string           `json:"blockName"`
	NewBlockGroupId   *int64            `json:"newBlockGroupId"`
	NewBlockGroupName *string           `json:"newBlockGroupName"`
	Laps              *int              `json:"laps"`
}

type SaveExercisesBlockComboResponse struct {
	RoutineId *int64 `json:"routineId"`
}

type SaveExercisesBlockPirRequest struct {
	RoutineId         *int64            `json:"routineId"`
	PlanificationId   *int64            `json:"planificationId"`
	Exercises         []ExerciseRequest `json:"exercises"`
	BlockName         *string           `json:"blockName"`
	NewBlockGroupId   *int64            `json:"newBlockGroupId"`
	NewBlockGroupName *string           `json:"newBlockGroupName"`
	Laps              *int              `json:"laps"`
}

type SaveExercisesBlockPirResponse struct {
	RoutineId *int64 `json:"routineId"`
}

type SaveExercisesBlockCptResponse struct {
	RoutineId *int64 `json:"routineId"`
}

type SaveExercisesBlockAmrapResponse struct {
	RoutineId *int64 `json:"routineId"`
}

type ExerciseRequest struct {
	Id   *int    `json:"id"`
	Name *string `json:"name"`
	Reps *int    `json:"reps"`
	Type *string `json:"type"`
}

type RestingTime struct {
	Interval *int `json:"interval"`
}

type SaveUserDevicePushNotificationSubscriptionRequest struct {
	Subscription *string `json:"subscription"`
}

type SaveUserTrainedTodayRequest struct {
	Answer bool `json:"answer"`
}

type GetRoutineDetailsResponse struct {
	Id                      *int64                          `json:"id"`
	Name                    *string                         `json:"name"`
	Difficulty              *int                            `json:"difficulty"`
	Duration                *string                         `json:"duration"`
	AlreadyMarkedByAthetles *bool                           `json:"alreadyMarkedByAthetles"`
	BlockGroupers           []GetRoutineDetailsBlockGrouper `json:"blockGroupers"`
}

type GetRoutineDetailsBlockGrouper struct {
	Id     *int64                   `json:"id"`
	Name   *string                  `json:"name"`
	Blocks []GetRoutineDetailsBlock `json:"blocks"`
}

type GetRoutineDetailsBlock struct {
	Id              *int64                           `json:"id"`
	Name            *string                          `json:"name"`
	Duration        *int                             `json:"duration"`
	Type            *string                          `json:"type"`
	Laps            *int                             `json:"laps"`
	Exerestinterval *int                             `json:"exerestinterval"`
	Laprestinterval *int                             `json:"laprestinterval"`
	Exercises       []GetRoutineDetailsBlockExercise `json:"exercises"`
}

type GetRoutineDetailsBlockExercise struct {
	Reps      *int    `json:"reps"`
	Secs      *int    `json:"secs"`
	Name      *string `json:"name"`
	VideoCode *string `json:"videoCode"`
}

type ShareRoutineRequest struct {
	RoutineId       *int64 `json:"routineId"`
	PlanificationId *int64 `json:"planificationId"`
}

type ShareEncrypted struct {
	RoutineId       int64
	PlanificationId int64
	CreatorId       int64
}

type SharePlanificationRequest struct {
	PlanificationId *int64 `json:"planificationId"`
}

type RequestAccessToSharedPlanificationRequest struct {
	SharedPlanification *string `json:"sharedPlanification"`
}

type CreatePlanificationRequest struct {
	Name *string `json:"name"`
}

type CreatePlanificationResponse struct {
	Id *int64 `json:"id"`
}

type SavePlanificationDaysRequest struct {
	PlanificationId *int64  `json:"planificationId"`
	Days            *string `json:"days"`
}

type AcceptPlanificationAccessRequest struct {
	PlanificationId *int64 `json:"planificationId"`
	RequesterUserId *int64 `json:"requesterUserId"`
}

type DeclinePlanificationAccessRequest struct {
	PlanificationId *int64 `json:"planificationId"`
	RequesterUserId *int64 `json:"requesterUserId"`
}

type SavePlanificationEditionsRequest struct {
	PlanificationId  *int64   `json:"planificationId"`
	RoutinesToDelete []int64  `json:"routinesToDelete"`
	Week             []string `json:"week"`
}

type ActionateRoutineRequest struct {
	PlanificationId         *int64  `json:"planificationId"`
	ActionatedRoutineId     *int64  `json:"actionatedRoutineId"`
	ActionatedRoutineAction *string `json:"actionatedRoutineAction"`
}

type SavePlanificationDaysResponse struct {
	Id *int64 `json:"id"`
}

type GoogleSignInRequest struct {
	ClientId  *string `json:"clientId"`
	ClientId2 *string `json:"client_id"`
	JWTToken  *string `json:"credential"`
	SelectBy  *string `json:"select_by"`
	CSRFToken *string `json:"g_csrf_token"`
}

type ListRoutinesResponse struct {
	IsEditable *bool                         `json:"isEditable"`
	Week       *string                       `json:"week"`
	Routines   []ListRoutinesRoutineResponse `json:"routines"`
}

type ListRoutinesRoutineResponse struct {
	Id              *int    `json:"id"`
	Name            *string `json:"name"`
	PlanificationId *int64  `json:"planificationId"`
	BlockCount      *int    `json:"blockCount"`
	WorkCount       *int    `json:"workCount"`
	Completed       *bool   `json:"completed"`
	Duration        *string `json:"duration"`
	IsActionable    bool    `json:"isActionable"`
	IsStartOfWeek   bool    `json:"isStartOfWeek"`
}

type EditRoutineRequest struct {
	PlanificationId *int64 `json:"planificationId"`
	RoutineId       *int64 `json:"routineId"`
	NewGrouperNames []struct {
		Id   *int64  `json:"id"`
		Name *string `json:"name"`
	} `json:"newGrouperNames"`
}
