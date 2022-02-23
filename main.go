package main

import (
	"BookmarkManager/routes"
	"embed"
	"errors"
	"fmt"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	_ "github.com/joho/godotenv/autoload"
	"io"
	"io/fs"
	"log"
	"mime"
	"net/http"
	"os"
	"path"
	"strings"
)

//go:embed frontend/build/*
var reactStatic embed.FS

func main() {
	fmt.Println("Starting up...")

	requireEnvironmentVariable("PORT")
	requireEnvironmentVariable("JWT_SECRET")
	requireEnvironmentVariable("TRUSTED_PROXIES")
	requireEnvironmentVariable("DB_PATH")
	requireEnvironmentVariable("REGISTRATIONS_ENABLED")

	if os.Getenv("MODE") == "DEBUG" {
		gin.SetMode(gin.DebugMode)
	} else {
		gin.SetMode(gin.ReleaseMode)
	}

	router := gin.New()
	router.Use(gin.Logger())
	router.Use(cors.Default())
	router.Use(gin.Recovery())

	err := router.SetTrustedProxies(strings.Split(os.Getenv("TRUSTED_PROXIES"), ","))

	if err != nil {
		log.Fatal("Could not setup trusted proxies: " + err.Error())
	}

	api := router.Group("/api")
	{
		api.POST("/users/login", routes.Login)

		if os.Getenv("REGISTRATIONS_ENABLED") == "true" {
			api.POST("/users/register", routes.Register)
		} else {
			api.POST("/users/register", func(c *gin.Context) {
				routes.HandleError(http.StatusForbidden, errors.New("registrations are disabled"), c)
			})
		}

		api.Use(JWTAuthMiddleware())

		api.POST("/users/password", routes.ChangePassword)

		api.GET("/diagnostics", routes.GetDiagnostics)
		api.GET("/bookmarks", routes.GetBookmarks)
		api.POST("/bookmarks", routes.PostBookmark)
		api.DELETE("/bookmarks", routes.DeleteBookmarks)
		api.PATCH("/bookmarks/:id", routes.UpdateBookmark)
	}

	// Required for es-modules to work
	if err := mime.AddExtensionType(".js", "text/javascript"); err != nil {
		log.Fatal("Could not setup mime types: " + err.Error())
	}

	router.Use(ServeEmbedFS("frontend/build", reactStatic))

	routes.InitializeDatabase()

	fmt.Println("Startup completed.")
	router.Run()
}

func requireEnvironmentVariable(key string) {
	if _, exists := os.LookupEnv(key); !exists {
		panic(fmt.Sprintf("The environment variable %v is not set but required for operating. Exiting...", key))
	}
}

func JWTAuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		validateToken(c)
		c.Next()
	}
}

func validateToken(c *gin.Context) {
	tokenString := c.Request.Header.Get("Authorization")

	if tokenString == "" {
		c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "missing bearer token"})
		return
	}

	splittedTokenString := strings.Split(tokenString, "Bearer ")

	if len(splittedTokenString) < 2 {
		c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "malformed bearer token"})
		return
	}

	if claims, err := routes.ValidateToken(splittedTokenString[1]); err == nil {
		user, ferr := routes.FetchUserByID(claims.UserID)

		if ferr == nil {
			c.Set("user", user)
			c.Next()
		} else {
			c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": ferr.Error()})
		}
	} else {
		c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "invalid bearer token"})
	}
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
		} else {
			f, err := subFS.Open("index.html")
			defer f.Close()

			if err != nil {
				routes.HandleError(http.StatusInternalServerError, err, c)
				return
			}

			stat, _ := f.Stat()

			http.ServeContent(c.Writer, c.Request, stat.Name(), stat.ModTime(), f.(io.ReadSeeker))
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
