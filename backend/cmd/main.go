package main

import (
	"backend/routes"
	"fmt"
	"log"
	"net/http"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/gorilla/mux"
)

func main() {
	// Start AWS session
	sess, err := session.NewSession(&aws.Config{
		Region: aws.String("us-east-1"), // Default region
	})
	if err != nil {
		log.Fatalf("Failed to create AWS session: %v", err)
	}

	// Initialize the router
	r := mux.NewRouter()

	// Register routes and pass the session
	routes.RegisterRoutes(r, sess)

	// Start the server
	fmt.Println("Server is running on http://localhost:8080")
	err = http.ListenAndServe(":8080", r)
	if err != nil {
		fmt.Println("Error starting server:", err)
	}
}
