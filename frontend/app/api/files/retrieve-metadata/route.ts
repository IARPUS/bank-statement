import { NextResponse } from "next/server";

// If you're using Next.js App Router, name your file `route.ts` in `app/api/proxy-s3/`

// Disable Next.js built-in body parser for demonstration (like your Textract example)
export const config = {
  api: {
    bodyParser: false,
  },
};

/**
 * POST /api/proxy-s3
 * 
 * Expects JSON body:
 * {
 *   "bucketName": "...",
 *   "filePath": "...",
 *   "mode": "object" | "metadata"
 * }
 * 
 * Example usage (client-side):
 * 
 *   await fetch("/api/proxy-s3", {
 *     method: "POST",
 *     headers: { "Content-Type": "application/json" },
 *     body: JSON.stringify({
 *       bucketName: "my-bucket",
 *       filePath: "some/key.pdf",
 *       mode: "metadata"
 *     })
 *   });
 */
export async function POST(req: Request) {
  try {
    const backendUrl = "http://localhost:8080/list-directory-s3";
    const body = await req.json();

    const response = await fetch(backendUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body), // Forward JSON directly
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