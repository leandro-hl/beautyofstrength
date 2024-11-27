package main

import (
	"fmt"
	"github.com/leandro-hl/beautyofstrength/back/db"
	"github.com/leandro-hl/beautyofstrength/back/util"
	"log"
	"os"
	"strings"
)

func main() {
	datasourceName := os.Getenv("DATABASE_URL")
	// read all files in a directory called sql
	files, err := os.ReadDir("sql")
	if err != nil {
		log.Fatal(err)
	}

	//execute schema starter
	data, err := os.ReadFile("sql/schema.sql")
	if err != nil {
		log.Fatal(err)
	}

	//connect to the database
	dbb := db.InitDB(datasourceName, 1)
	tx, err := dbb.Db.Beginx()
	util.Check(err)

	_, err = tx.Exec(string(data))
	if err != nil {
		log.Fatal(err)
	}

	specialFiles := []string{
		"0queries.sql", "schema.sql", "drops.sql", "setup.sql", "transitions.sql",
		"35.sql", "36.sql",
	}

	// iterate over each migration
	for _, file := range files {
		if strings.HasSuffix(file.Name(), ".sql") {
			isSpecial := false
			for _, specialFile := range specialFiles {
				if file.Name() == specialFile {
					isSpecial = true
					break
				}
			}

			if isSpecial {
				continue
			}

			fmt.Println("\n-- " + file.Name() + " --")
			fmt.Println("----------------------------------------")
			fmt.Println()

			// read the file content
			data, err = os.ReadFile("sql/" + file.Name())
			if err != nil {
				log.Fatal(err)
			}

			_, err = tx.Exec(string(data))
			if err != nil {
				log.Println(err)
			}
		}
	}

	err = tx.Commit()
	if err != nil {
		log.Fatal(err)
	}
}
