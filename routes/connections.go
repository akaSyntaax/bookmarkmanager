package routes

import (
	"database/sql"
	"fmt"
	_ "github.com/go-sql-driver/mysql"
	_ "github.com/joho/godotenv/autoload"
	"log"
	"os"
)

func DBInstance() *sql.DB {
	sqlConnectionString := fmt.Sprintf("%v:%v@tcp(%v:%v)/%v?parseTime=true", os.Getenv("DB_USER"), os.Getenv("DB_PASSWORD"), os.Getenv("DB_HOST"), os.Getenv("DB_PORT"), os.Getenv("DB_NAME"))
	db, err := sql.Open("mysql", sqlConnectionString)
	//defer db.Close() Close connection outside of this method

	if err != nil {
		log.Fatal("Could not connect to the database: " + err.Error())
	}

	return db
}

var DBClient = DBInstance()

func ExecuteStringQuery(query string) (string, error) {
	var output string
	err := DBClient.QueryRow(query).Scan(&output)
	return output, err
}
