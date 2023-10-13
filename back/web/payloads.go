package main

type SignUpRequest struct {
	Username *string `json:"username"`
	Password *string `json:"password"`
}

type SignInRequest struct {
	Username *string `json:"username"`
	Password *string `json:"password"`
}

type SaveExercisesBlockRequest struct {
	RoutineId *int64            `json:"routineId"`
	Exercises []ExerciseRequest `json:"exercises"`
	Laps      *int              `json:"laps"`
	BlockName *string           `json:"blockName"`
	ExeRest   RestingTime       `json:"exeRest"`
	LapRest   RestingTime       `json:"lapRest"`
}

type SaveExercisesBlockCptRequest struct {
	RoutineId       *int64            `json:"routineId"`
	PlanificationId *int64            `json:"planificationId"`
	Exercises       []ExerciseRequest `json:"exercises"`
	Laps            *int              `json:"laps"`
	BlockName       *string           `json:"blockName"`
	WorkingInterval *int              `json:"workingInterval"`
	RestingInteval  *int              `json:"restingInteval"`
}

type SaveExercisesBlockAmrapRequest struct {
	RoutineId       *int64            `json:"routineId"`
	PlanificationId *int64            `json:"planificationId"`
	Exercises       []ExerciseRequest `json:"exercises"`
	BlockDuration   *int              `json:"blockDuration"`
	BlockName       *string           `json:"blockName"`
}

type SaveExercisesBlockComboRequest struct {
	RoutineId       *int64            `json:"routineId"`
	PlanificationId *int64            `json:"planificationId"`
	Exercises       []ExerciseRequest `json:"exercises"`
	BlockName       *string           `json:"blockName"`
	Laps            *int              `json:"laps"`
}

type SaveExercisesBlockComboResponse struct {
	RoutineId *int64 `json:"routineId"`
}

type SaveExercisesBlockPirRequest struct {
	RoutineId       *int64            `json:"routineId"`
	PlanificationId *int64            `json:"planificationId"`
	Exercises       []ExerciseRequest `json:"exercises"`
	BlockName       *string           `json:"blockName"`
	Laps            *int              `json:"laps"`
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
}

type RestingTime struct {
	Interval *int `json:"interval"`
}

type SaveUserDevicePushNotificationSubscriptionRequest struct {
	Subscription *string `json:"subscription"`
}

type SaveUserTrainedToday struct {
	Answer bool `json:"answer"`
}

type GetRoutineDetailsResponse struct {
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
	Reps *int    `json:"reps"`
	Secs *int    `json:"secs"`
	Name *string `json:"name"`
}
