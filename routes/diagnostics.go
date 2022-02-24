package routes

import (
	"BookmarkManager/models"
	"github.com/gin-gonic/gin"
	"log"
	"net/http"
	"os"
	"runtime"
)

func GetDiagnostics(c *gin.Context) {
	dbVersion, err := ExecuteStringQuery("SELECT sqlite_version()")

	if err != nil {
		HandleError(http.StatusInternalServerError, err, c)
		return
	}

	user, _ := c.Get("user")

	c.JSON(http.StatusOK, gin.H{
		"database_version":      dbVersion,
		"gin_version":           gin.Version,
		"os":                    runtime.GOOS,
		"arch":                  runtime.GOARCH,
		"go_version":            runtime.Version(),
		"go_root":               runtime.GOROOT(),
		"go_compiler":           runtime.Compiler,
		"running_in_docker":     isRunningInDocker(),
		"registrations_enabled": os.Getenv("REGISTRATIONS_ENABLED") == "true",
		"trusted_proxies":       os.Getenv("TRUSTED_PROXIES"),
		"mode":                  os.Getenv("MODE"),
		"database_path":         os.Getenv("DB_PATH"),
		"current_userid":        user.(models.User).ID,
		"current_username":      user.(models.User).Username,
	})
}

func isRunningInDocker() bool {
	if _, err := os.Stat("/.dockerenv"); err == nil {
		return true
	}

	return false
}

func HandleError(httpStatusCode int, error error, c *gin.Context) {
	c.JSON(httpStatusCode, gin.H{"error": error.Error()})
	log.Println(error)
}
