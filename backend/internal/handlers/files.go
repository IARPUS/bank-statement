package handlers

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"mime/multipart"
	"net/http"
	"os"
	"os/exec"
	"path/filepath"

	"github.com/otiai10/gosseract/v2"
)

// UploadFileHandler handles file uploads and PDF parsing using Tesseract OCR.
func UploadFileHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// Step 1: Save the uploaded file
	filePath, err := saveUploadedFile(r)
	if err != nil {
		http.Error(w, "Failed to save file: "+err.Error(), http.StatusInternalServerError)
		return
	}
	defer cleanupUploads("./uploads") // Cleanup all files in the upload directory

	// Step 2: Convert PDF to images and extract text using Tesseract
	parsedText, err := parsePDFTess(filePath)
	// parsedText, err := CallFastAPIService(filePath)
	if err != nil {
		http.Error(w, "Failed to parse PDF: "+err.Error(), http.StatusInternalServerError)
		return
	}

	// Step 3: Respond with the parsed content
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{
		"message":    "File uploaded and parsed successfully",
		"parsedText": parsedText,
	})
}

// saveUploadedFile saves the uploaded file to disk and returns its path.
func saveUploadedFile(r *http.Request) (string, error) {
	file, header, err := r.FormFile("file")
	if err != nil {
		return "", fmt.Errorf("failed to read file: %w", err)
	}
	defer file.Close()

	// Ensure the upload directory exists
	uploadDir := "./uploads"
	if err := os.MkdirAll(uploadDir, os.ModePerm); err != nil {
		return "", fmt.Errorf("failed to create upload directory: %w", err)
	}

	// Save the file
	filePath := filepath.Join(uploadDir, header.Filename)
	outFile, err := os.Create(filePath)
	if err != nil {
		return "", fmt.Errorf("failed to create file: %w", err)
	}
	defer outFile.Close()

	if _, err := io.Copy(outFile, file); err != nil {
		return "", fmt.Errorf("failed to write file: %w", err)
	}

	return filePath, nil
}

// parsePDF parses a PDF file and extracts its text using Tesseract.
func parsePDFTess(filePath string) (string, error) {
	// Step 1: Convert PDF to images using `pdftoppm` or a similar tool
	imageDir := "./uploads/images"
	if err := os.MkdirAll(imageDir, os.ModePerm); err != nil {
		return "", fmt.Errorf("failed to create image directory: %w", err)
	}
	imagePattern := filepath.Join(imageDir, "page")

	cmd := exec.Command("pdftoppm", "-png", filePath, imagePattern)
	if err := cmd.Run(); err != nil {
		return "", fmt.Errorf("failed to convert PDF to images: %w", err)
	}

	// Step 2: Perform OCR on each image using Tesseract
	text := ""
	client := gosseract.NewClient()
	defer client.Close()

	// Iterate through images generated by `pdftoppm`
	for i := 1; ; i++ {
		imageFile := fmt.Sprintf("%s-%d.png", imagePattern, i)
		if _, err := os.Stat(imageFile); os.IsNotExist(err) {
			break // Stop if the image file does not exist
		}

		client.SetImage(imageFile)
		pageText, err := client.Text()
		if err != nil {
			return "", fmt.Errorf("failed to extract text from image %s: %w", imageFile, err)
		}
		text += pageText + "\n"
	}

	return text, nil
}

// cleanupUploads deletes all files in the specified directory.
func cleanupUploads(dir string) {
	files, err := os.ReadDir(dir)
	if err != nil {
		fmt.Printf("Failed to read upload directory: %v\n", err)
		return
	}

	for _, file := range files {
		err := os.RemoveAll(filepath.Join(dir, file.Name()))
		if err != nil {
			fmt.Printf("Failed to delete file %s: %v\n", file.Name(), err)
		}
	}
}

// parses pdf via LayouLM by calling python microservice
func CallFastAPIService(filePath string) (string, error) {
	// Open the file to send
	file, err := os.Open(filePath)
	if err != nil {
		return "", fmt.Errorf("failed to open file: %w", err)
	}
	defer file.Close()

	// Create a multipart form file
	var requestBody bytes.Buffer
	writer := multipart.NewWriter(&requestBody)
	part, err := writer.CreateFormFile("file", filepath.Base(filePath))
	if err != nil {
		return "", fmt.Errorf("failed to create form file: %w", err)
	}
	if _, err := io.Copy(part, file); err != nil {
		return "", fmt.Errorf("failed to copy file to form: %w", err)
	}
	writer.Close()

	// Send the request to the FastAPI service
	url := "http://127.0.0.1:8000/parse-pdf" // Update to your FastAPI service URL if needed
	req, err := http.NewRequest("POST", url, &requestBody)
	if err != nil {
		return "", fmt.Errorf("failed to create request: %w", err)
	}
	req.Header.Set("Content-Type", writer.FormDataContentType())

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return "", fmt.Errorf("failed to make request: %w", err)
	}
	defer resp.Body.Close()

	// Handle the response
	if resp.StatusCode != http.StatusOK {
		body, _ := io.ReadAll(resp.Body)
		return "", fmt.Errorf("unexpected response from FastAPI: %s", string(body))
	}

	var response map[string]interface{}
	if err := json.NewDecoder(resp.Body).Decode(&response); err != nil {
		return "", fmt.Errorf("failed to decode response: %w", err)
	}

	if message, ok := response["message"].(string); ok {
		return message, nil
	}

	return "", fmt.Errorf("unexpected response structure")
}
