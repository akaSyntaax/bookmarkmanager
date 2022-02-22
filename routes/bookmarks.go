package routes

import (
	"BookmarkManager/models"
	"database/sql"
	"errors"
	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
	"net/http"
	"strconv"
)

func FetchBookmarks(user models.User) ([]models.Bookmark, error) {
	bookmarks := []models.Bookmark{}

	rows, err := DBClient.Query("SELECT * FROM Bookmarks WHERE UserID = ?", user.ID)

	if err != nil {
		return bookmarks, err
	}

	for rows.Next() {
		var bookmark models.Bookmark

		if err := rows.Scan(&bookmark.ID, &bookmark.Title, &bookmark.URL, &bookmark.Created, &bookmark.UserID); err != nil {
			return bookmarks, err
		}

		bookmarks = append(bookmarks, bookmark)
	}

	return bookmarks, nil
}

func FetchBookmark(bookmarkID uint32, user models.User) (models.Bookmark, error) {
	var bookmark models.Bookmark

	row := DBClient.QueryRow("SELECT * FROM Bookmarks WHERE ID = ? AND UserID = ? LIMIT 1", bookmarkID, user.ID)

	if err := row.Scan(&bookmark.ID, &bookmark.Title, &bookmark.URL, &bookmark.Created, &bookmark.UserID); err != nil && err != sql.ErrNoRows {
		return bookmark, err
	}

	return bookmark, nil
}

func GetBookmarks(c *gin.Context) {
	user, _ := c.Get("user")
	bookmarks, err := FetchBookmarks(user.(models.User))

	if err != nil {
		HandleError(http.StatusInternalServerError, err, c)
		return
	}

	c.JSON(http.StatusOK, bookmarks)
}

func DeleteBookmarks(c *gin.Context) {
	var bookmarksToDelete []uint32
	deletedBookmarks := []uint32{}

	if err := c.BindJSON(&bookmarksToDelete); err != nil {
		HandleError(http.StatusBadRequest, err, c)
		return
	}

	user, _ := c.Get("user")
	var deleteError error

	for _, bookmarkID := range bookmarksToDelete {
		if !contains(deletedBookmarks, bookmarkID) {
			if result, err := DBClient.Exec("DELETE FROM Bookmarks WHERE ID = ? AND UserID = ?", bookmarkID, user.(models.User).ID); err == nil {
				if affectedRows, _ := result.RowsAffected(); affectedRows > 0 {
					deletedBookmarks = append(deletedBookmarks, bookmarkID)
				}
			} else {
				deleteError = err
				break
			}
		}
	}

	if deleteError == nil {
		c.JSON(http.StatusOK, gin.H{
			"deleted_bookmarks": deletedBookmarks,
		})
	} else {
		HandleError(http.StatusInternalServerError, deleteError, c)
	}
}

func UpdateBookmark(c *gin.Context) {
	targetBookmarkID, converr := strconv.ParseUint(c.Param("id"), 10, 32)

	if converr != nil || targetBookmarkID == 0 {
		HandleError(http.StatusBadRequest, errors.New("bookmark id is invalid"), c)
		return
	}

	var updatedBookmark models.Bookmark

	if err := c.BindJSON(&updatedBookmark); err != nil {
		HandleError(http.StatusBadRequest, err, c)
		return
	}

	if err := validator.New().Struct(updatedBookmark); err != nil {
		HandleError(http.StatusBadRequest, err, c)
		return
	}

	user, _ := c.Get("user")

	targetBookmark, fetcherr := FetchBookmark(uint32(targetBookmarkID), user.(models.User))

	if fetcherr != nil {
		HandleError(http.StatusInternalServerError, fetcherr, c)
		return
	}

	// Bookmark.ID == 0 means the bookmark does not exist (int's default value is zero)
	if targetBookmark.ID == 0 {
		HandleError(http.StatusNotFound, errors.New("bookmark does not exist"), c)
		return
	}

	updatedBookmark.ID = uint32(targetBookmarkID)
	updatedBookmark.Created = targetBookmark.Created

	result, err := DBClient.Exec("UPDATE Bookmarks SET Title = ?, URL = ? WHERE ID = ? AND UserID = ?", updatedBookmark.Title, updatedBookmark.URL, targetBookmarkID, user.(models.User).ID)

	if err != nil {
		HandleError(http.StatusInternalServerError, err, c)
		return
	}

	rowsAffected, _ := result.RowsAffected()

	if rowsAffected > 0 {
		c.JSON(http.StatusOK, updatedBookmark)
	} else {
		HandleError(http.StatusNotModified, errors.New("bookmark could not be updated"), c)
	}
}

func contains(s []uint32, e uint32) bool {
	for _, a := range s {
		if a == e {
			return true
		}
	}

	return false
}

func PostBookmark(c *gin.Context) {
	var bookmark models.Bookmark

	if err := c.BindJSON(&bookmark); err != nil {
		HandleError(http.StatusBadRequest, err, c)
		return
	}

	if err := validator.New().Struct(bookmark); err != nil {
		HandleError(http.StatusBadRequest, err, c)
		return
	}

	user, _ := c.Get("user")
	result, err := DBClient.Exec("INSERT INTO Bookmarks(Title, URL, UserID) VALUES(?, ?, ?)", bookmark.Title, bookmark.URL, user.(models.User).ID)

	if err != nil {
		HandleError(http.StatusInternalServerError, err, c)
		return
	}

	insertedID, _ := result.LastInsertId()
	rowsAffected, _ := result.RowsAffected()

	if rowsAffected > 0 {
		newBookmark, err := FetchBookmark(uint32(insertedID), user.(models.User))

		if err != nil {
			HandleError(http.StatusInternalServerError, err, c)
			return
		}

		c.JSON(http.StatusCreated, newBookmark)
	} else {
		HandleError(http.StatusNotModified, errors.New("bookmark could not be created"), c)
	}
}
