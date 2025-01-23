import { NextResponse } from "next/server";

export const config = {
  api: {
    bodyParser: false, // Disable body parsing to handle FormData
  },
};

export async function POST(req) {
  try {
    const backendUrl = "http://localhost:8080/upload-file-s3"; // Go backend URL

    // Extract the body as FormData
    const formData = await req.formData();

    // Create a new FormData instance to send to the backend
    const body = new FormData();
    for (const [key, value] of formData.entries()) {
      body.append(key, value);
    }

    // Forward the request to the Go backend
    const response = await fetch(backendUrl, {
      method: "POST",
      body: body, // Forward the FormData
      headers: {
        // Don't include unnecessary headers
      },
    });

    if (!response.ok) {
      const error = await response.text();
      return new Response(JSON.stringify({ message: "Error uploading file", error }), {
        status: response.status,
        headers: { "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    return new Response(JSON.stringify({ message: "File uploaded successfully", data }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in API route:", error);
    return new Response(JSON.stringify({ message: "Error uploading file", error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
