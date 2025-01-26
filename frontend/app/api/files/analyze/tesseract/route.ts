import { NextResponse } from "next/server";

// Disable Next.js built-in body parser
export const config = {
  api: {
    bodyParser: false,
  },
};

/**
 * POST /api/parse-pdf
 * 
 * Expects JSON body:
 * {
 *   "bucketName": "your-s3-bucket-name",
 *   "filePath": "path/to/your/file.pdf"
 * }
 */
export async function POST(req: Request) {
  try {
    const backendUrl = "http://localhost:8080/parse-file-tesseract"; // Replace with your backend endpoint
    const body = await req.json();

    if (!body.bucketName || !body.filePath) {
      return NextResponse.json(
        { message: "Missing bucketName or filePath in request body." },
        { status: 400 }
      );
    }

    // Forward the request to the backend service
    const response = await fetch(backendUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { message: "Failed to parse PDF.", error: errorText },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(
      { message: "PDF parsed successfully.", data },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in proxy route:", error);
    return NextResponse.json(
      { message: "Unexpected error occurred.", error: (error as Error).message },
      { status: 500 }
    );
  }
}
