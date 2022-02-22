package routes

import (
	"BookmarkManager/models"
	"database/sql"
	"errors"
	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
	"github.com/golang-jwt/jwt/v4"
	"golang.org/x/crypto/bcrypt"
	"net/http"
	"os"
	"time"
)

func Login(c *gin.Context) {
	var loginPayload models.LoginPayload

	if err := c.BindJSON(&loginPayload); err != nil {
		HandleError(http.StatusBadRequest, err, c)
		return
	}

	if err := validator.New().Struct(loginPayload); err != nil {
		HandleError(http.StatusBadRequest, err, c)
		return
	}

	user, err := FetchUserByUsername(loginPayload.Username)

	if err != nil {
		HandleError(http.StatusInternalServerError, err, c)
		return
	}

	if user.ID == 0 {
		HandleError(http.StatusNotFound, errors.New("user does not exist"), c)
		return
	}

	if !CheckPasswordHash(loginPayload.Password, user.PasswordHash) {
		HandleError(401, errors.New("invalid password"), c)
		return
	}

	if signedToken, tokenErr := GenerateToken(user); tokenErr == nil {
		c.JSON(http.StatusOK, gin.H{"success": true, "token": signedToken})
	} else {
		HandleError(http.StatusInternalServerError, tokenErr, c)
	}
}

type authCustomClaims struct {
	UserID uint32 `json:"userid"`
	jwt.RegisteredClaims
}

func GenerateToken(user models.User) (string, error) {
	claims := &authCustomClaims{
		user.ID,
		jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Local().Add(time.Hour * time.Duration(72))),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
			NotBefore: jwt.NewNumericDate(time.Now()),
			Issuer:    "BookmarkManager",
			Subject:   user.Username,
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	signedToken, err := token.SignedString([]byte(os.Getenv("JWT_SECRET")))

	return signedToken, err
}

func ValidateToken(tokenString string) (*authCustomClaims, error) {
	token, err := jwt.ParseWithClaims(tokenString, &authCustomClaims{}, func(token *jwt.Token) (interface{}, error) {
		return []byte(os.Getenv("JWT_SECRET")), nil
	})

	if claims, ok := token.Claims.(*authCustomClaims); ok && token.Valid {
		return claims, nil
	} else {
		return nil, err
	}
}

func Register(c *gin.Context) {
	var registrationPayload models.LoginPayload

	if err := c.BindJSON(&registrationPayload); err != nil {
		HandleError(http.StatusBadRequest, err, c)
		return
	}

	if err := validator.New().Struct(registrationPayload); err != nil {
		HandleError(http.StatusBadRequest, err, c)
		return
	}

	user, err := FetchUserByUsername(registrationPayload.Username)

	if err != nil {
		HandleError(http.StatusInternalServerError, err, c)
		return
	}

	if user.ID > 0 {
		HandleError(http.StatusConflict, errors.New("username is already registered"), c)
		return
	}

	// TODO: password requirements

	hash, hashErr := HashPassword(registrationPayload.Password)

	if hashErr != nil {
		HandleError(http.StatusInternalServerError, hashErr, c)
		return
	}

	result, err := DBClient.Exec("INSERT INTO Users(Username, PasswordHash) VALUES(?, ?)", registrationPayload.Username, hash)

	if err != nil {
		HandleError(http.StatusInternalServerError, err, c)
		return
	}

	if rowsAffected, _ := result.RowsAffected(); rowsAffected > 0 {
		c.JSON(http.StatusOK, gin.H{"success": true})
	} else {
		HandleError(http.StatusNotModified, errors.New("user could not be created"), c)
	}
}

func ChangePassword(c *gin.Context) {
	var passwordPayload models.PasswordPayload
	user, _ := c.Get("user")

	if err := c.BindJSON(&passwordPayload); err != nil {
		HandleError(http.StatusBadRequest, err, c)
		return
	}

	if err := validator.New().Struct(passwordPayload); err != nil {
		HandleError(http.StatusBadRequest, err, c)
		return
	}

	hash, hashErr := HashPassword(passwordPayload.Password)

	if hashErr != nil {
		HandleError(http.StatusInternalServerError, hashErr, c)
		return
	}

	result, err := DBClient.Exec("UPDATE Users SET PasswordHash = ? WHERE ID = ?", hash, user.(models.User).ID)

	if err != nil {
		HandleError(http.StatusInternalServerError, err, c)
		return
	}

	if rowsAffected, _ := result.RowsAffected(); rowsAffected > 0 {
		c.JSON(http.StatusOK, gin.H{"success": true})
	} else {
		HandleError(http.StatusNotModified, errors.New("password could not be updated"), c)
	}
}

func HashPassword(password string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), 14)
	return string(bytes), err
}

func CheckPasswordHash(password, hash string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
	return err == nil
}

func FetchUserByUsername(username string) (models.User, error) {
	var user models.User

	row := DBClient.QueryRow("SELECT * FROM Users WHERE Username = ? LIMIT 1", username)

	if err := row.Scan(&user.ID, &user.Username, &user.PasswordHash, &user.Created); err != nil && err != sql.ErrNoRows {
		return user, err
	}

	return user, nil
}

func FetchUserByID(id uint32) (models.User, error) {
	var user models.User

	row := DBClient.QueryRow("SELECT * FROM Users WHERE ID = ? LIMIT 1", id)

	if err := row.Scan(&user.ID, &user.Username, &user.PasswordHash, &user.Created); err != nil && err != sql.ErrNoRows {
		return user, err
	}

	return user, nil
}
