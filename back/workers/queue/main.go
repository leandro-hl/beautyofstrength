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
			o.planificationCopyMesocycle(op)
			break
		}
	}

	fmt.Println("worker: finished at " + time.Now().String())
	o.Finished()
}

func (o *Worker) planificationCopyMesocycle(op db.QueuePlanificationOperation) {
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
	originals := db.ListLastRoutinesByPlanificationIdUpTo(o.db, tx, *op.PlanificationId, *op.UserAccountId, *details.Mesocycle)

	//from oldest to newest
	for i := len(originals) - 1; i >= 0; i-- {
		original := originals[i]
		originalGroupers := db.ListBlockGroupGrouperByRoutineId(o.db, tx, *original.Id)
		newRoutineId := db.CreateRoutine(
			o.db,
			tx,
			*original.Name,
			*op.PlanificationId,
			*original.CreatorId,
			*original.Difficulty,
			*original.Duration)

		for _, bg := range originalGroupers {
			newBgId := db.CreateBlockGrouper(o.db, tx, *bg.Name, *newRoutineId, *bg.Order)
			originalGroups := db.ListBlockGroupByRoutineId(o.db, tx, *bg.RoutineId, *bg.Id)

			for _, b := range originalGroups {
				newBlockGroupId := db.CreateBlockGroup(o.db, tx, *b.Type, *b.Name, *newRoutineId, *newBgId, b.Duration, b.Laps, b.LapRestInterval, b.ExeRestInterval)
				originalExercises := db.ListBlockGroupExerciseByBlockId(o.db, tx, *b.Id)

				for _, ex := range originalExercises {
					db.CreateExerciseBlockGroup(o.db, tx, *newBlockGroupId, *ex.ExerciseId, *ex.Order, ex.Reps, ex.Secs)
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
