package main

import (
	"backend/internal/handlers"
	"fmt"
	"net/http"
)

func main() {
	// Define a basic handler
	http.HandleFunc("/upload", handlers.UploadFileHandler)

	// Start the server
	fmt.Println("Server is running on http://localhost:8080")
	err := http.ListenAndServe(":8080", nil)
	if err != nil {
		fmt.Println("Error starting server:", err)
	}
}
