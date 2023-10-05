package main

import (
	"fmt"
	"github.com/jmoiron/sqlx"
	"github.com/jmoiron/sqlx/reflectx"
	_ "github.com/lib/pq"
	"io/ioutil"
	"log"
	"os"
	"os/exec"
	"path/filepath"
	"reflect"
	"strings"
)

func InitDB(datasourceName string) *sqlx.DB {
	db, err := sqlx.Connect("postgres", datasourceName)

	if err != nil {
		log.Fatalln(err)
		return nil
	}

	db.Mapper = reflectx.NewMapperFunc("json", strings.ToLower)

	return db
}

func formatIndex(i int) string {
	return fmt.Sprintf("$%d", i)
}

func Insert(tx *sqlx.Tx, t interface{}) *int64 {
	val := reflect.ValueOf(t)

	if val.Kind() == reflect.Ptr {
		val = val.Elem()
	}

	table := strings.ToLower(val.Type().Name())
	fields := val.NumField()

	columns := make([]string, 0, fields)
	valueIndexes := make([]string, 0, fields)
	values := make([]interface{}, 0, fields)

	paramIndex := 0
	for i := 0; i < fields; i++ {
		field := val.Type().Field(i)

		// Ids are auto incremental and set by the db
		if field.Name == "Id" {
			continue
		}

		if columnName, ok := field.Tag.Lookup("json"); ok {
			columns = append(columns, columnName)
		} else {
			columns = append(columns, strings.ToLower(field.Name))
		}

		values = append(values, val.Field(i).Interface())
		valueIndexes = append(valueIndexes, formatIndex(paramIndex+1))
		paramIndex++
	}

	insert := fmt.Sprintf(
		"INSERT INTO %s (%s) VALUES (%s) RETURNING id",
		table,
		strings.Join(columns, ","),
		strings.Join(valueIndexes, ","))

	var id int64
	err := tx.QueryRow(insert, values...).Scan(&id)
	Check(err)
	return &id
}

func Deploy(db *sqlx.DB) {
	parent, err := filepath.Abs("main/patches/sql")

	Check(err)

	entries, err := os.ReadDir(parent)

	Check(err)

	tx, err := db.Begin()

	for _, entry := range entries {
		if entry.IsDir() {
			subDir := parent + "/" + entry.Name()
			fs, err := os.ReadDir(subDir)

			Check(err)

			for _, file := range fs {
				patch, err := ioutil.ReadFile(subDir + "/" + file.Name())

				Check(err)

				_, err = tx.Exec(string(patch))

				Check(err)
			}
		}
	}

	defer func() {
		if r := recover(); r != nil {
			tx.Rollback()
		}
	}()

	tx.Commit()
}

func PatchByGit(db *sqlx.DB) {
	tx, _ := db.Begin()

	//from latest to oldest. We could get "since" from meta.patch
	out, _ := exec.Command("./gitsqllog.sh", "2021-05-06").Output()

	if len(out) == 0 {
		fmt.Println("patches up to date...")
		return
	}

	patches := strings.Split(string(out), "\n")

	reverse(patches)

	for _, p := range patches {
		if file, err := os.ReadFile(p); err == nil {
			_, err = tx.Exec(string(file))
		}
	}

	defer func() {
		if r := recover(); r != nil {
			tx.Rollback()
		}
	}()

	tx.Commit()
}

func reverse(commits []string) {
	stack := make([]string, 0, 0)

	for _, c := range commits {
		stack = append(stack, c)
	}

	for i := 0; i < len(stack); i++ {
		commits[i] = stack[len(stack)-1-i]
	}
}
