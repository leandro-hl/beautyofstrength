package queue

import (
	"fmt"
	"github.com/leandro-hl/beautyofstrength/back/db"
	"github.com/leandro-hl/beautyofstrength/back/util"
	"sync"
	"time"
)

type Worker struct {
	processing bool
	mutex      sync.RWMutex
	db         *db.DB
}

func (o *Worker) IsProcessing() bool {
	o.mutex.RLock()
	defer o.mutex.RUnlock()
	return o.processing
}

func (o *Worker) Finished() {
	o.mutex.Lock()
	o.processing = false
	o.mutex.Unlock()
}

func (o *Worker) Start() {
	go o.StartWorker1()
	go o.StartWorker2()
}

func (o *Worker) StartWorker1() {
	ticker := time.NewTicker(1 * time.Minute)
	defer ticker.Stop()
	o.execute()
	for range ticker.C {
		if !o.IsProcessing() {
			o.execute()
		} else {
			fmt.Println("worker: currently processing")
		}
	}
}

func (o *Worker) StartWorker2() {
	ticker := time.NewTicker(24 * time.Hour)
	defer ticker.Stop()
	for range ticker.C {
		if !o.IsProcessing() {
			o.execute2()
		} else {
			fmt.Println("worker: currently processing")
		}
	}
}

func (o *Worker) execute2() {
	defer func() {
		if e := recover(); e != nil {
			util.CheckNoPanic(e.(error))
		}
	}()

	fmt.Println("worker: athlete to basic starting at " + time.Now().String())
	db.UpdateAccountToAthleteBasic(o.db)
}

func (o *Worker) execute() {
	defer func() {
		if e := recover(); e != nil {
			util.CheckNoPanic(e.(error))
		}
	}()

	fmt.Println("worker: starting at " + time.Now().String())
	pending := db.ListQueuedPlanificationOperations(o.db)

	fmt.Println(fmt.Sprintf("worker: found %d operations", len(pending)))
	for _, op := range pending {
		switch *op.Operation {
		case db.PlanificationCopyMesocycle:
			o.planificationCopyMesocycle(op, false)
			break
		case db.PlanificationCopyWeek:
			o.planificationCopyMesocycle(op, true)
			break
		case db.TemplateRoutineToPlanification:
			o.copyRoutineTemplateToPlanification(op)
			break
		}
	}

	fmt.Println("worker: finished at " + time.Now().String())
	o.Finished()
}

func (o *Worker) copyRoutineTemplateToPlanification(op db.QueuePlanificationOperation) {
	defer func() {
		if e := recover(); e != nil {
			util.CheckNoPanic(e.(error))
		}
	}()

	//routine copy
	schema := "template."
	tx, err := o.db.Db.Beginx()
	util.Check(err)
	original := db.GetRoutineHeaderTemplate(o.db, tx, *op.RoutineId, *op.UserAccountId)
	originalGroupers := db.ListBlockGroupGrouperByRoutineId(o.db, tx, *original.Routineid, schema)
	newRoutineId := db.CreateRoutine(
		o.db,
		tx,
		*original.Routinename,
		*op.PlanificationId,
		*op.UserAccountId,
		*original.Difficulty,
		*original.Duration,
		original.Cover,
		original.CoverImagePath,
		original.CoverImageUrl,
		original.CoverUrlExpirationDate)

	for _, bg := range originalGroupers {
		newBgId := db.CreateBlockGrouper(o.db, tx, *bg.Name, *newRoutineId, *bg.Order)
		originalGroups := db.ListBlockGroupByRoutineId(o.db, tx, *bg.RoutineId, *bg.Id, schema)

		for _, b := range originalGroups {
			newBlockGroupId := db.CreateBlockGroup(o.db, tx, *b.Type, *b.Name, *newRoutineId, *newBgId, b.Duration, b.Laps, b.LapRestInterval, b.ExeRestInterval)
			originalExercises := db.ListBlockGroupExerciseByBlockId(o.db, tx, *b.Id, schema)

			for _, ex := range originalExercises {
				db.CreateExerciseBlockGroup(o.db, tx, *newBlockGroupId, *ex.ExerciseId, *ex.Order, ex.Reps, ex.Secs, "")
			}
		}
	}

	db.MarkPlanificationOperationCompleted(o.db, tx, *op.Id)
	db.InsertEventUser(o.db, tx, db.TemplateRoutineCopiedToPlanification, *op.UserAccountId, *op.UserAccountId, op.PlanificationId, newRoutineId)
	err = tx.Commit()
	util.Check(err)
}

func (o *Worker) planificationCopyMesocycle(op db.QueuePlanificationOperation, onlyWeek bool) {
	defer func() {
		if e := recover(); e != nil {
			util.CheckNoPanic(e.(error))
		}
	}()

	//routine copy
	tx, err := o.db.Db.Beginx()
	util.Check(err)
	fmt.Println(fmt.Sprintf("worker: processing mesocyle copy for p %d u %d finished at %s", *op.PlanificationId, *op.UserAccountId, time.Now().String()))

	details := db.GetPlanificationById(o.db, tx, *op.PlanificationId)

	upTo := *details.Mesocycle
	if onlyWeek {
		sche := db.GetPlanificationSchedule(o.db, tx, *op.PlanificationId)
		upTo = len(*sche.Days)
	}
	originals := db.ListLastRoutinesByPlanificationIdUpTo(o.db, tx, *op.PlanificationId, *op.UserAccountId, upTo)

	//from oldest to newest
	for i := len(originals) - 1; i >= 0; i-- {
		original := originals[i]
		originalGroupers := db.ListBlockGroupGrouperByRoutineId(o.db, tx, *original.Id, "")
		newRoutineId := db.CreateRoutine(
			o.db,
			tx,
			*original.Name,
			*op.PlanificationId,
			*original.CreatorId,
			*original.Difficulty,
			*original.Duration,
			original.Cover != nil && *original.Cover,
			original.CoverImagePath,
			original.CoverImageUrl,
			original.CoverUrlExpirationDate)

		for _, bg := range originalGroupers {
			newBgId := db.CreateBlockGrouper(o.db, tx, *bg.Name, *newRoutineId, *bg.Order)
			originalGroups := db.ListBlockGroupByRoutineId(o.db, tx, *bg.RoutineId, *bg.Id, "")

			for _, b := range originalGroups {
				newBlockGroupId := db.CreateBlockGroup(o.db, tx, *b.Type, *b.Name, *newRoutineId, *newBgId, b.Duration, b.Laps, b.LapRestInterval, b.ExeRestInterval)
				originalExercises := db.ListBlockGroupExerciseByBlockId(o.db, tx, *b.Id, "")

				for _, ex := range originalExercises {
					db.CreateExerciseBlockGroup(o.db, tx, *newBlockGroupId, *ex.ExerciseId, *ex.Order, ex.Reps, ex.Secs, "")
				}
			}
		}
		fmt.Println(fmt.Sprintf("worker: mesocyle copied for r %d p %d u %d finished at %s", *original.Id, *op.PlanificationId, *op.UserAccountId, time.Now().String()))
	}

	db.MarkPlanificationOperationCompleted(o.db, tx, *op.Id)
	db.InsertEventUser(o.db, tx, db.LastMesocycleGenerated, *details.CreatorId, *details.CreatorId, details.Id, nil)
	err = tx.Commit()
	util.Check(err)
}

func NewWorker(db *db.DB) *Worker {
	return &Worker{db: db, mutex: sync.RWMutex{}}
}
