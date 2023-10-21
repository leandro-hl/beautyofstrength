package db

type ListExerciseIdName struct {
	Id   *int    `json:"id"`
	Name *string `json:"name"`
}

type ListExercise struct {
	Id            *int    `json:"id"`
	Name          *string `json:"name"`
	CreatedByUser *string `json:"createdbyuser"`
}

type GetUserAccountDetailsQuery struct {
	Name       *string `json:"name"`
	Email      *string `json:"email"`
	PictureUrl *string `json:"pictureurl"`
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
