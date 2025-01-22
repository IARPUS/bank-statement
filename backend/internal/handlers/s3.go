package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/s3"
)

type CreateBucketRequest struct {
	BucketName string `json:"bucket_name"`
}

func CreateBucketHandler(w http.ResponseWriter, r *http.Request, sess *session.Session) {
	// Ensure the request method is POST
	if r.Method != http.MethodPost {
		http.Error(w, "Invalid request method", http.StatusMethodNotAllowed)
		return
	}

	// Parse the JSON body to get the bucket name
	var req CreateBucketRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Failed to parse request body: "+err.Error(), http.StatusBadRequest)
		return
	}

	if req.BucketName == "" {
		http.Error(w, "Bucket name is required", http.StatusBadRequest)
		return
	}

	// Create an S3 service client
	s3Client := s3.New(sess)

	// Call CreateBucket API
	_, err := s3Client.CreateBucket(&s3.CreateBucketInput{
		Bucket: aws.String(req.BucketName),
	})
	if err != nil {
		http.Error(w, "Failed to create bucket: "+err.Error(), http.StatusInternalServerError)
		return
	}

	// Respond with success
	w.WriteHeader(http.StatusOK)
	fmt.Fprintf(w, "Bucket %s created successfully", req.BucketName)
}
func CreateS3Bucket(sess *session.Session, bucketName string) error {
	s3Client := s3.New(sess)

	// Create the bucket
	_, err := s3Client.CreateBucket(&s3.CreateBucketInput{
		Bucket: aws.String(bucketName),
	})
	if err != nil {
		return fmt.Errorf("failed to create bucket: %w", err)
	}

	// Wait until the bucket is created
	err = s3Client.WaitUntilBucketExists(&s3.HeadBucketInput{
		Bucket: aws.String(bucketName),
	})
	if err != nil {
		return fmt.Errorf("error while waiting for bucket to be created: %w", err)
	}

	return nil
}
func ListBucketsHandler(w http.ResponseWriter, r *http.Request, sess *session.Session) {
	// Initialize the S3 service client
	s3Client := s3.New(sess)

	// Call the ListBuckets API
	result, err := s3Client.ListBuckets(nil)
	if err != nil {
		http.Error(w, fmt.Sprintf("Failed to list buckets: %v", err), http.StatusInternalServerError)
		return
	}

	// Prepare the response
	buckets := make([]string, len(result.Buckets))
	for i, bucket := range result.Buckets {
		buckets[i] = *bucket.Name
	}

	// Send the response
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"buckets": buckets,
	})
}
func DeleteBucketHandler(w http.ResponseWriter, r *http.Request, sess *session.Session) {
	// Get the bucket name from the query parameters
	bucketName := r.URL.Query().Get("bucketName")
	if bucketName == "" {
		http.Error(w, "Bucket name is required", http.StatusBadRequest)
		return
	}

	// Initialize the S3 service client
	s3Client := s3.New(sess)

	// Call the DeleteBucket API
	_, err := s3Client.DeleteBucket(&s3.DeleteBucketInput{
		Bucket: &bucketName,
	})
	if err != nil {
		http.Error(w, fmt.Sprintf("Failed to delete bucket: %v", err), http.StatusInternalServerError)
		return
	}

	// Send the response
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	fmt.Fprintf(w, `{"message": "Bucket '%s' deleted successfully"}`, bucketName)
}
