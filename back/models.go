package main

import "time"

type Exercise struct {
	Id   *int    `json:"id"`
	Name *string `json:"name"`
}

type BlockGroup struct {
	Id              *int    `json:"id"`
	Name            *string `json:"name"`
	Laps            *int    `json:"laps"`
	LapRestInterval *int    `json:"lapRestInterval"`
	ExeRestInterval *int    `json:"exeRestInterval"`
}

type ExerciseBlockGroup struct {
	Id           *int64 `json:"id"`
	BlockGroupId *int64 `json:"blockgroup_id"`
	ExerciseId   *int   `json:"exercise_id"`
	Reps         *int   `json:"reps"`
}

type UserAccount struct {
	Id       *int64  `json:"id"`
	Name     *string `json:"name"`
	Username *string `json:"username"`
	UserType *rune   `json:"usertype"`
	Password *string `json:"password"`
}

type UserDevice struct {
	Id            *int64  `json:"id"`
	Name          *string `json:"name"`
	VapidData     *string `json:"vapiddata"`
	UserAccountId *int64  `json:"useraccount_id"`
}

type WebPushNotificationSubscription struct {
	Endpoint       *string    `json:"endpoint"`
	ExpirationTime *time.Time `json:"expirationTime"`
	Keys           *struct {
		P256dh *string `json:"p256dh"`
		Auth   *string `json:"auth"`
	} `json:"keys"`
}
