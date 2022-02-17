package routes

import (
	"BookmarkManager/models"
	"database/sql"
	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
	"net/http"
)

func FetchBookmarks() ([]models.Bookmark, error) {
	var bookmarks []models.Bookmark

	rows, err := DBClient.Query("SELECT * FROM Bookmarks")

	if err != nil {
		return bookmarks, err
	}

	for rows.Next() {
		var bookmark models.Bookmark

		if err := rows.Scan(&bookmark.ID, &bookmark.Title, &bookmark.URL, &bookmark.Created); err != nil {
			return bookmarks, err
		}

		bookmarks = append(bookmarks, bookmark)
	}

	return bookmarks, nil
}

func FetchBookmark(id int64) (models.Bookmark, error) {
	var bookmark models.Bookmark

	row := DBClient.QueryRow("SELECT * FROM Bookmarks WHERE ID = ? LIMIT 1", id)

	if err := row.Scan(&bookmark.ID, &bookmark.Title, &bookmark.URL, &bookmark.Created); err != nil && err != sql.ErrNoRows {
		return bookmark, err
	}

	return bookmark, nil
}

func GetBookmarks(c *gin.Context) {
	bookmarks, err := FetchBookmarks()

	if err != nil {
		HandleError(http.StatusInternalServerError, err, c)
		return
	}

	c.JSON(http.StatusOK, bookmarks)
}

func PostBookmark(c *gin.Context) {
	var bookmark models.Bookmark

	if err := c.BindJSON(&bookmark); err != nil {
		HandleError(http.StatusBadRequest, err, c)
		return
	}

	validate := validator.New()
	validationErr := validate.Struct(bookmark)

	if validationErr != nil {
		HandleError(http.StatusBadRequest, validationErr, c)
		return
	}

	result, err := DBClient.Exec("INSERT INTO Bookmarks(Title, URL) VALUES(?, ?)", bookmark.Title, bookmark.URL)

	if err != nil {
		HandleError(http.StatusInternalServerError, err, c)
		return
	}

	insertedID, insertedIDErr := result.LastInsertId()

	if insertedIDErr != nil {
		HandleError(http.StatusInternalServerError, insertedIDErr, c)
		return
	}

	newBookmark, err := FetchBookmark(insertedID)

	if err != nil {
		HandleError(http.StatusInternalServerError, err, c)
		return
	}

	c.JSON(http.StatusCreated, newBookmark)
}
