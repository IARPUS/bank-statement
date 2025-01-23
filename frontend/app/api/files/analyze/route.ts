import { NextResponse } from "next/server";
import AWS from "aws-sdk";

export const config = {
  api: {
    bodyParser: false, // Disable body parsing to handle raw JSON requests
  },
};

// Initialize AWS Textract client
const textract = new AWS.Textract({
  region: "us-east-1", // Update with your region
});

export async function POST(req) {
  try {
    const { bucketName, filePath } = await req.json();

    // Validate inputs
    if (!bucketName || !filePath) {
      return NextResponse.json(
        { message: "Bucket name and file path are required" },
        { status: 400 }
      );
    }

    // Start document analysis using Textract
    const params = {
      DocumentLocation: {
        S3Object: {
          Bucket: bucketName,
          Name: filePath,
        },
      },
      FeatureTypes: ["TABLES", "FORMS"], // Extract tables and key-value pairs
    };

    const startResponse = await textract
      .startDocumentAnalysis(params)
      .promise();

    const jobId = startResponse.JobId;

    // Poll for the result using the job ID
    let jobStatus = "IN_PROGRESS";
    let analysisResult = null;

    while (jobStatus === "IN_PROGRESS") {
      const getResultParams = { JobId: jobId };
      const result = await textract.getDocumentAnalysis(getResultParams).promise();
      jobStatus = result.JobStatus;

      if (jobStatus === "SUCCEEDED") {
        analysisResult = result;
      } else if (jobStatus === "FAILED") {
        return NextResponse.json(
          { message: "Textract analysis failed" },
          { status: 500 }
        );
      }

      // Add delay to avoid excessive polling
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }

    // Respond with extracted data
    return NextResponse.json(
      { message: "Textract analysis completed", data: analysisResult },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in Textract API route:", error);
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}
