export async function uploadFile(bucketName: string, filePath: string, file) {
  console.log("Uploading file to s3")
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
  console.log("Retrieving statement analysis data from textract")
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
  console.log("Retrieving file data from s3")
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
export async function processBankStatementTextract(bucketName: string, filePath: string) {
  const response = await fetch("/api/files/analyze/textract", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      bucketName: bucketName,
      filePath: filePath,
    }),
  });

  const data = await response.json();
  console.log(data);
  return data
};

export async function createNewDirectory(bucketName: string, filePath: string, newFileName: string) {
  console.log("CREATING NEW DIRECTORY")
}
export async function processBankStatementTesseract(bucketName: string, filePath: string) {
  const response = await fetch("/api/files/analyze/tesseract", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      bucketName: bucketName,
      filePath: filePath,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    console.error("Error:", error.error);
    return;
  }

  const data = await response.json();
  console.log("Extracted Text:", data.data.text);
  return data.data.text
};
export async function parseBankStatementText(text: string) {
  console.log("HERE")
  try {
    const response = await fetch("/api/files/analyze/openAI/parse", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to process text.");
    }

    const result = await response.json();
    return result.parsedData;
  } catch (error) {
    console.error("Error processing bank statement:", error);
    throw error;
  }
};
export async function produceSummaryOpenAI(text: string) {
  try {
    const response = await fetch("/api/files/analyze/openAI/summary", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to process text.");
    }

    const result = await response.json();
    return result.parsedData;
  } catch (error) {
    console.error("Error processing bank statement:", error);
    throw error;
  }
};
export async function analyzeOpenAI(text: string) {
  try {
    const response = await fetch("/api/files/analyze/openAI/analysis", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to process text.");
    }

    const result = await response.json();
    return result.parsedData;
  } catch (error) {
    console.error("Error processing bank statement:", error);
    throw error;
  }
};

