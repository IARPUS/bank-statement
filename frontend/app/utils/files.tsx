export async function uploadFile(bucketName: string, filePath: string, file) {
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
export async function fetchBankStatementData(bucketName: string, filePath: string) {
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
export async function getMetaData(bucketName: string, filePath: string) {
  try {
    const response = await fetch("/api/files/retrieve-metadata", {
      method: "POST", // Ensure this is POST
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        bucketName: bucketName,
        directory: filePath,
      }),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to fetch Textract data");
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error retrieving file data:", error);
    alert("Error retrieving file data: " + error.message);
  }
};