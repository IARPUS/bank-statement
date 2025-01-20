package handlers

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"path/filepath"

	"github.com/unidoc/unipdf/v3/extractor"
	"github.com/unidoc/unipdf/v3/model" // PDF parsing library
)

// UploadFileHandler handles file uploads and PDF parsing.
func UploadFileHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		fmt.Print("HERE")
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// Step 1: Save the uploaded file
	filePath, err := saveUploadedFile(r)
	if err != nil {
		http.Error(w, "Failed to save file: "+err.Error(), http.StatusInternalServerError)
		return
	}
	defer os.Remove(filePath) // Cleanup after processing

	// Step 2: Parse the PDF
	parsedText, err := parsePDF(filePath)
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

// parsePDF parses a PDF file and extracts its text.
func parsePDF(filePath string) (string, error) {
	// Open the PDF file
	file, err := os.Open(filePath)
	if err != nil {
		return "", fmt.Errorf("failed to open file: %w", err)
	}
	defer file.Close()

	// Initialize the PDF reader
	reader, err := model.NewPdfReader(file)
	if err != nil {
		return "", fmt.Errorf("failed to initialize PDF reader: %w", err)
	}

	// Get the number of pages in the PDF
	numPages, err := reader.GetNumPages()
	if err != nil {
		return "", fmt.Errorf("failed to get number of pages: %w", err)
	}

	// Extract text from each page
	var text string
	for i := 1; i <= numPages; i++ {
		page, err := reader.GetPage(i)
		if err != nil {
			return "", fmt.Errorf("failed to read page %d: %w", i, err)
		}

		ex, err := extractor.New(page)
		if err != nil {
			return "", fmt.Errorf("failed to create extractor for page %d: %w", i, err)
		}

		pageText, err := ex.ExtractText()
		if err != nil {
			return "", fmt.Errorf("failed to extract text from page %d: %w", i, err)
		}
		text += pageText + "\n"
	}

	return text, nil
}
