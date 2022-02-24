package routes

import (
	"github.com/gin-gonic/gin"
	"log"
	"net/http"
	"runtime"
)

func GetDiagnostics(c *gin.Context) {
	dbVersion, err := ExecuteStringQuery("SELECT sqlite_version()")

	if err != nil {
		HandleError(http.StatusInternalServerError, err, c)
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"database_version": dbVersion,
		"gin_version":      gin.Version,
		"os":               runtime.GOOS,
		"arch":             runtime.GOARCH,
		"go_version":       runtime.Version(),
		"go_root":          runtime.GOROOT(),
		"go_compiler":      runtime.Compiler,
	})
}

func HandleError(httpStatusCode int, error error, c *gin.Context) {
	c.JSON(httpStatusCode, gin.H{"error": error.Error()})
	log.Println(error)
}
