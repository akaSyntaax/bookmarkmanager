package main

import (
	"BookmarkManager/routes"
	"embed"
	"fmt"
	"io/fs"
	"log"
	"net/http"
	"os"
	"path"
	"strings"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	_ "github.com/joho/godotenv/autoload"
)

//go:embed frontend/build/*
var reactStatic embed.FS

func main() {
	fmt.Println("Starting up...")

	if os.Getenv("MODE") == "DEBUG" {
		gin.SetMode(gin.DebugMode)
	} else {
		gin.SetMode(gin.ReleaseMode)
	}

	router := gin.New()
	router.Use(gin.Logger())
	router.Use(cors.Default())

	err := router.SetTrustedProxies(strings.Split(os.Getenv("TRUSTED_PROXIES"), ","))

	if err != nil {
		log.Fatal("Could not setup trusted proxies: " + err.Error())
	}

	router.Use(ServeEmbedFS("frontend/build", reactStatic))

	api := router.Group("/api")
	{
		api.GET("/diagnostics", routes.GetDiagnostics)
		api.GET("/bookmarks", routes.GetBookmarks)
		api.POST("/bookmarks", routes.PostBookmark)
		api.DELETE("/bookmarks", routes.DeleteBookmarks)
		api.PATCH("/bookmarks/:id", routes.UpdateBookmark)
	}

	routes.InitializeDatabase()

	fmt.Println("Startup completed.")
	router.Run()
}

func ServeEmbedFS(fileRoot string, embedFS embed.FS) gin.HandlerFunc {
	subFS, err := fs.Sub(embedFS, fileRoot)

	if err != nil {
		log.Fatal(err.Error())

		return func(c *gin.Context) {
			c.String(http.StatusInternalServerError, err.Error())
		}
	}

	fileserver := http.FileServer(http.FS(subFS))

	return func(c *gin.Context) {
		if Exists(fileRoot, c.Request.URL.Path, embedFS) {
			// Serve the requested file to the server
			fileserver.ServeHTTP(c.Writer, c.Request)

			// Prevent other handlers from being run
			c.Abort()
		}
	}
}

func Exists(fileRoot string, filePath string, embedFS embed.FS) bool {
	file, err := embedFS.Open(path.Join(fileRoot, filePath))

	if err != nil {
		return false
	}

	_, serr := file.Stat()

	if serr != nil {
		return false
	}

	return true
}
