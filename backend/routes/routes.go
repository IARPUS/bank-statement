package routes

import (
	"backend/internal/handlers"
	"net/http"

	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/gorilla/mux"
)

// RegisterRoutes sets up all the routes for the application
func RegisterRoutes(r *mux.Router, sess *session.Session) {
	// Example routes (replace these with your actual routes)
	r.HandleFunc("/create-bucket", func(w http.ResponseWriter, r *http.Request) {
		handlers.CreateBucketHandler(w, r, sess)
	}).Methods(http.MethodPost)

	r.HandleFunc("/upload-file", handlers.UploadFileHandler).Methods(http.MethodPost)

	r.HandleFunc("/list-buckets", func(w http.ResponseWriter, r *http.Request) {
		handlers.ListBucketsHandler(w, r, sess)
	}).Methods(http.MethodGet)

	r.HandleFunc("/delete-bucket", func(w http.ResponseWriter, r *http.Request) {
		handlers.DeleteBucketHandler(w, r, sess)
	}).Methods(http.MethodDelete)
}
