import { NextRequest, NextResponse } from 'next/server';

// Optional: Configuration for Edge Runtime
export const runtime = 'edge'; // Use edge runtime for faster response handling

export const config = {
  api: {
    bodyParser: false, // Disable body parsing to handle FormData
  },
};

export async function POST(req: NextRequest) {
  const backendUrl = 'http://localhost:8080/upload'; // Go backend URL

  try {
    // Get the raw body from the request
    const rawBody = req.body;

    if (!rawBody) {
      return NextResponse.json({ message: 'Request body is missing' }, { status: 400 });
    }

    // Transform headers for fetch
    const headers: Record<string, string> = {};
    req.headers.forEach((value, key) => {
      headers[key] = value;
    });

    // Forward the request to the Go backend
    const response = await fetch(backendUrl, {
      method: 'POST',
      headers: {
        ...headers,
      },
      body: rawBody, // Forward the raw body
    });

    // Check backend response
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Backend error:', response.status, errorText);
      return NextResponse.json(
        { error: `Backend error: ${errorText}` },
        { status: response.status }
      );
    }

    // Forward successful response
    const responseData = await response.json();
    return NextResponse.json(responseData, { status: response.status });
  } catch (error) {
    console.error('Error in API route:', error);
    return NextResponse.json(
      { message: 'Internal server error', error },
      { status: 500 }
    );
  }
}
