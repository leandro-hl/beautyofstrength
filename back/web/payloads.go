package main

import (
	"github.com/leandro-hl/beautyofstrength/back/db"
)

type SignUpRequest struct {
	Username *string `json:"username"`
	Password *string `json:"password"`
}

type SignInRequest struct {
	Username *string `json:"username"`
	Password *string `json:"password"`
}

type StartJourneyRequest struct {
	As *string `json:"as"`
}

type CopyTemplateRoutineToPlanificationRequest struct {
	RoutineId       *int64 `json:"templateRoutineId"`
	PlanificationId *int64 `json:"planificationId"`
}

type UploadExerciseVideoLinkRequest struct {
	Id   *int64  `json:"id"`
	Link *string `json:"link"`
}

type UploadExerciseVideoLinkResponse struct {
	Link *string `json:"link"`
}

type SaveExercisesBlockCptRequest struct {
	RoutineId          *int64            `json:"routineId"`
	PlanificationId    *int64            `json:"planificationId"`
	Exercises          []ExerciseRequest `json:"exercises"`
	Laps               *int              `json:"laps"`
	BlockName          *string           `json:"blockName"`
	NewBlockGroupId    *int64            `json:"newBlockGroupId"`
	NewBlockGroupName  *string           `json:"newBlockGroupName"`
	NewBlockGroupOrder *int              `json:"newBlockGroupOrder"`
	WorkingInterval    *int              `json:"workingInterval"`
	RestingInteval     *int              `json:"restingInteval"`
	IsTemplate         bool              `json:"isTemplate"`
}

type SaveExercisesBlockFreeRequest struct {
	RoutineId          *int64            `json:"routineId"`
	PlanificationId    *int64            `json:"planificationId"`
	BlockType          *string           `json:"blockType"`
	Exercises          []ExerciseRequest `json:"exercises"`
	Laps               *int              `json:"laps"`
	BlockName          *string           `json:"blockName"`
	NewBlockGroupId    *int64            `json:"newBlockGroupId"`
	NewBlockGroupName  *string           `json:"newBlockGroupName"`
	NewBlockGroupOrder *int              `json:"newBlockGroupOrder"`
	RestingInteval     *int              `json:"restingInteval"`
	ExeRestingInteval  *int              `json:"exeRestingInteval"`
	IsTemplate         bool              `json:"isTemplate"`
}

type SaveExercisesBlockAmrapRequest struct {
	RoutineId          *int64            `json:"routineId"`
	PlanificationId    *int64            `json:"planificationId"`
	Exercises          []ExerciseRequest `json:"exercises"`
	BlockDuration      *int              `json:"blockDuration"`
	BlockName          *string           `json:"blockName"`
	NewBlockGroupId    *int64            `json:"newBlockGroupId"`
	NewBlockGroupName  *string           `json:"newBlockGroupName"`
	NewBlockGroupOrder *int              `json:"newBlockGroupOrder"`
	IsTemplate         bool              `json:"isTemplate"`
}

type SaveExercisesBlockComboRequest struct {
	RoutineId          *int64            `json:"routineId"`
	PlanificationId    *int64            `json:"planificationId"`
	Exercises          []ExerciseRequest `json:"exercises"`
	BlockName          *string           `json:"blockName"`
	NewBlockGroupId    *int64            `json:"newBlockGroupId"`
	NewBlockGroupName  *string           `json:"newBlockGroupName"`
	NewBlockGroupOrder *int              `json:"newBlockGroupOrder"`
	Laps               *int              `json:"laps"`
	IsTemplate         bool              `json:"isTemplate"`
}

type SaveExercisesBlockPirRequest struct {
	RoutineId          *int64            `json:"routineId"`
	PlanificationId    *int64            `json:"planificationId"`
	Exercises          []ExerciseRequest `json:"exercises"`
	BlockName          *string           `json:"blockName"`
	NewBlockGroupId    *int64            `json:"newBlockGroupId"`
	NewBlockGroupName  *string           `json:"newBlockGroupName"`
	NewBlockGroupOrder *int              `json:"newBlockGroupOrder"`
	Laps               *int              `json:"laps"`
	IsTemplate         bool              `json:"isTemplate"`
}

type SaveExercisesBlockComboResponse struct {
	RoutineId *int64 `json:"routineId"`
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
	CoverImageUrl           *string                         `json:"coverImageUrl"`
	CanBeSaved              *bool                           `json:"canBeSaved"`
	IsCopy                  *bool                           `json:"isCopy"`
	AlreadyCopied           *bool                           `json:"alreadyCopied"`
	Name                    *string                         `json:"name"`
	Difficulty              *int                            `json:"difficulty"`
	Duration                *string                         `json:"duration"`
	AlreadyMarkedByMe       *bool                           `json:"alreadyMarkedByMe"`
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
	Id        *int64  `json:"id"`
	ExId      *int64  `json:"exId"`
	Reps      *int    `json:"reps"`
	Secs      *int    `json:"secs"`
	Name      *string `json:"name"`
	Link      *string `json:"link"`
	VideoCode *string `json:"videoCode"`
}

type ShareRoutineRequest struct {
	CanBeSaved      *bool  `json:"canBeSaved"`
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
	NewMesocycle     *int     `json:"newMesocycle"`
	NewObjective     *string  `json:"newObjective"`
	Week             []string `json:"week"`
}

type ActionateRoutineRequest struct {
	PlanificationId         *int64  `json:"planificationId"`
	ActionatedRoutineId     *int64  `json:"actionatedRoutineId"`
	ActionatedRoutineAction *string `json:"actionatedRoutineAction"`
	Rpe                     *int    `json:"rpe"`
}

type SaveSharedRoutineRequest struct {
	RoutineId *int64 `json:"routineId"`
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

type GetPlanificationDetailsResponse struct {
	IsEditable *bool                         `json:"isEditable"`
	Week       *string                       `json:"week"`
	Mesocycle  *int                          `json:"mesocycle"`
	Objective  *string                       `json:"objective"`
	Routines   []ListRoutinesRoutineResponse `json:"routines"`
}

type ListRoutinesRoutineResponse struct {
	Id              *int64  `json:"id"`
	Name            *string `json:"name"`
	PlanificationId *int64  `json:"planificationId"`
	BlockCount      *int    `json:"blockCount"`
	WorkCount       *int    `json:"workCount"`
	Completed       *bool   `json:"completed"`
	Duration        *string `json:"duration"`
	IsActionable    bool    `json:"isActionable"`
	IsStartOfWeek   bool    `json:"isStartOfWeek"`
	CoverImageUrl   *string `json:"coverImageUrl"`
}

type EditRoutineRequest struct {
	PlanificationId *int64  `json:"planificationId"`
	RoutineId       *int64  `json:"routineId"`
	NewRoutineName  *string `json:"name"`
	IsTemplate      bool    `json:"isTemplate"`
	NewGrouperNames []struct {
		Id   *int64  `json:"id"`
		Name *string `json:"name"`
	} `json:"newGrouperNames"`
	GrouperIdsToDelete []int64 `json:"grouperIdsToDelete"`
	WorkOutToDelete    []struct {
		GrouperId *int64 `json:"grouperId"`
		WorkoutId *int64 `json:"workoutId"`
	} `json:"workoutsToDelete"`
	WorkOutsToUpdate []struct {
		GrouperId       *int64 `json:"grouperId"`
		WorkoutId       *int64 `json:"workoutId"`
		Laps            *int   `json:"laps"`
		ExeRestInterval *int   `json:"exerestinterval"`
		LapRestInterval *int   `json:"laprestinterval"`
	} `json:"workoutsToUpdate"`
	ExercisesToAdd []struct {
		GrouperId *int64 `json:"grouperId"`
		WorkoutId *int64 `json:"workoutId"`
		Exercises []struct {
			GrouperId  *int64 `json:"grouperId"`
			WorkoutId  *int64 `json:"workoutId"`
			ExerciseId *int   `json:"exerciseId"`
			Order      *int   `json:"order"`
			Reps       *int   `json:"reps"`
			Secs       *int   `json:"secs"`
		} `exercises`
	} `json:"exercisesToAdd"`
	ExercisesToDelete []struct {
		GrouperId  *int64 `json:"grouperId"`
		WorkoutId  *int64 `json:"workoutId"`
		ExerciseId *int   `json:"exerciseId"`
	} `json:"exercisesToDelete"`
}

type ListExercisesResponse struct {
	ShowVideoInfo *bool                  `json:"showVideoInfo"`
	Exercises     []db.ListExerciseQuery `json:"exercises"`
}

type ListLatestEventsResponse struct {
	Events []string `json:"events"`
}

type BadRequestResponse struct {
	ErrorCode *string `json:"code"`
}

type ListUserRmsResponse struct {
	Rms []UserRmResponse `json:"rms"`
}

type UserRmResponse struct {
	Id           *int64  `json:"id"`
	ExerciseName *string `json:"name"`
	Rm           *int    `json:"rm"`
	Date         *string `json:"date"`
	Sum          *bool   `json:"sum"`
	From         *int    `json:"from"`
}

type SaveNewRmRequest struct {
	Id *int64 `json:"id"`
	Rm *int   `json:"rm"`
}

type SaveRoutineExecutionRequest struct {
	PlanificationId *int64                                `json:"planificationId"`
	RoutineId       *int64                                `json:"routineId"`
	Rpe             *int                                  `json:"rpe"`
	Exercises       []SaveRoutineExecutionExerciseRequest `json:"exercises"`
}

type SaveRoutineExecutionExerciseRequest struct {
	Id            *int64 `json:"id"`
	Reps          *int   `json:"reps"`
	EffectiveReps *int   `json:"effectiveReps"`
	Kg            *int   `json:"kg"`
}

type ListLastUserRmHistoryStatsResponse struct {
	Labels []string `json:"labels"`
	Series [][]int  `json:"series"`
}

type DeletePlanificationRequest struct {
	Id *int64 `json:"id"`
}

type CopyMesocycleRequest struct {
	PlanificationId *int64 `json:"planificationId"`
	OnlyWeek        *bool  `json:"onlyWeek"`
}

type UploadRoutineImage struct {
	RoutineId *int64 `json:"routineId"`
	Image     []byte `json:"image"`
}

type CreateNewExerciseRequest struct {
	Name      *string                      `json:"name"`
	Equipment []db.CreateExerciseEquipment `json:"equipment"`
}

type CreateNewExerciseResponse struct {
	Id *int `json:"id"`
}

type AddToMyEquipmentRequest struct {
	Id     *int64   `json:"id"`
	Units  *int     `json:"units"`
	Weight *float32 `json:"weight"`
	Height *float32 `json:"height"`
	Width  *float32 `json:"width"`
}
