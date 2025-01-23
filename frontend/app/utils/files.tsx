export async function uploadFile(bucketName, filePath, file) {
  try {
    // Create a FormData object
    const formData = new FormData();
    formData.append("bucketName", bucketName);
    formData.append("filePath", filePath);
    formData.append("file", file);

    // Send a POST request to the Next.js API route
    const response = await fetch("/api/files/upload", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to upload file: ${error}`);
    }

    const data = await response.json();
    console.log(data.message);
    alert("File uploaded successfully!");
  } catch (error) {
    console.error("Error uploading file:", error);
    alert("Error uploading file: " + error.message);
  }
}
async function fetchBankStatementData(bucketName, filePath) {
  try {
    const response = await fetch("/api/textract", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bucketName, filePath }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to fetch Textract data");
    }

    const data = await response.json();
    console.log("Extracted data:", data);
    return data;
  } catch (error) {
    console.error("Error fetching Textract data:", error);
    alert("Error fetching bank statement data: " + error.message);
  }
}
