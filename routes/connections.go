package routes

import (
	"database/sql"
	_ "github.com/joho/godotenv/autoload"
	"log"
	_ "modernc.org/sqlite"
	"os"
)

func DBConnection() *sql.DB {
	connection, err := sql.Open("sqlite", os.Getenv("DB_PATH"))

	if err != nil {
		log.Fatal("Could not connect to the database: " + err.Error())
	}

	return connection
}

func InitializeDatabase() {
	_, _, createErr := ExecuteNonQuery("CREATE TABLE IF NOT EXISTS Bookmarks (ID integer primary key not null, Title varchar(64) null, URL varchar(256) not null, Created timestamp default current_timestamp not null)")

	if createErr == nil {
		_, _, createErr := ExecuteNonQuery("CREATE TABLE IF NOT EXISTS Users (ID integer primary key not null, Username varchar(32) not null, PasswordHash varchar(1024) not null, Created timestamp default current_timestamp not null, UserID integer not null references Users on update restrict on delete cascade)")

		if createErr == nil {
			return
		}
	}

	log.Fatal("Could not initialize database: " + createErr.Error())
}

var DBClient = DBConnection()

func ExecuteStringQuery(query string) (string, error) {
	var output string
	err := DBClient.QueryRow(query).Scan(&output)
	return output, err
}

func ExecuteNonQuery(query string, args ...interface{}) (int64, int64, error) {
	var result sql.Result
	var err error

	if len(args) > 0 {
		result, err = DBClient.Exec(query, args)
	} else {
		result, err = DBClient.Exec(query)
	}

	if err != nil {
		return -1, -1, err
	}

	affectedRows, err := result.RowsAffected()

	if err != nil {
		return -1, -1, err
	}

	lastInsertID, err := result.LastInsertId()

	if err != nil {
		return -1, -1, err
	}

	return affectedRows, lastInsertID, err
}
