// Copyright 2025 Leandro Herenu - BOS (Beauty Of Strength)
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

package db

import (
	"fmt"
	"github.com/jmoiron/sqlx"
	"github.com/jmoiron/sqlx/reflectx"
	"github.com/leandro-hl/beautyofstrength/back/util"
	_ "github.com/lib/pq"
	"io/ioutil"
	"os"
	"os/exec"
	"path/filepath"
	"reflect"
	"strings"
)

type DB struct {
	Db     *sqlx.DB
	Serial int
}

func InitDB(datasourceName string, serial int) *DB {
	db, err := sqlx.Connect("postgres", datasourceName)
	util.Check(err)

	db.Mapper = reflectx.NewMapperFunc("json", strings.ToLower)
	//todo: this will be initialized twice cause reused function but we're ok for now
	preparedStmts = make(map[string]*sqlx.Stmt)
	return &DB{
		Db:     db,
		Serial: serial,
	}
}

// Ping checks if the database connection is alive
func (d *DB) Ping() error {
	return d.Db.Ping()
}

func formatIndex(i int) string {
	return fmt.Sprintf("$%d", i)
}

func Insert(tx *sqlx.Tx, t interface{}) *int64 {
	return InsertSchema(tx, t, "")
}

func InsertSchema(tx *sqlx.Tx, t interface{}, schema string) *int64 {
	val := reflect.ValueOf(t)

	if val.Kind() == reflect.Ptr {
		val = val.Elem()
	}

	table := ""
	if schema != "" {
		if strings.Contains(schema, ".") {
			table = schema + strings.ToLower(val.Type().Name())
		} else {
			table = schema + "." + strings.ToLower(val.Type().Name())
		}
	} else {
		table = strings.ToLower(val.Type().Name())
	}

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
			if columnName == "order" {
				columns = append(columns, `"`+columnName+`"`)
			} else {
				columns = append(columns, columnName)
			}
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
	util.Check(err)
	return &id
}

func Deploy(db *sqlx.DB) {
	parent, err := filepath.Abs("main/patches/sql")

	util.Check(err)

	entries, err := os.ReadDir(parent)

	util.Check(err)

	tx, err := db.Begin()

	for _, entry := range entries {
		if entry.IsDir() {
			subDir := parent + "/" + entry.Name()
			fs, err := os.ReadDir(subDir)

			util.Check(err)

			for _, file := range fs {
				patch, err := ioutil.ReadFile(subDir + "/" + file.Name())

				util.Check(err)

				_, err = tx.Exec(string(patch))

				util.Check(err)
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
