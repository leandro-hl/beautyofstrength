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
	Exercises []ExerciseRequest `json:"exercises"`
	Laps      *int              `json:"laps"`
	ExeRest   RestingTime       `json:"exeRest"`
	LapRest   RestingTime       `json:"lapRest"`
}

type ExerciseRequest struct {
	Id   *int `json:"id"`
	Reps *int `json:"reps"`
}

type RestingTime struct {
	Interval *int `json:"interval"`
}

type SaveUserDevicePushNotificationSubscriptionRequest struct {
	Subscription *string `json:"subscription"`
}
