import { NextResponse } from "next/server";

export const config = {
  api: {
    bodyParser: false,
  },
};

/**
 * POST /api/process-tesseract
 *
 * Expects JSON body:
 * {
 *   "text": "Extracted text from Tesseract"
 * }
 */
export async function POST(req) {
  console.log("API Route Hit");
  try {
    // Parse the request body
    const body = await req.json();

    if (!body.text) {
      return NextResponse.json(
        { message: "Missing 'text' in request body." },
        { status: 400 }
      );
    }

    // OpenAI API request
    const openAIResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4", // Change model to `gpt-4` or appropriate version
        messages: [
          {
            role: "user",
            content: `Given the following data ${body.text}, please provide your analysis and some speculations on the data in a json that follows the following structure:
            {
              "Analysis Title 1": {
                "Bullet 1": "some analysis",
                "Bullet 2": "some analysis",
              },
             "Analysis Title 2": {
                "Bullet 1": "some analysis",
                "Bullet 2": "some analysis",
              },
              "Analysis Title 1": {
                "Bullet 1": "some analysis",
                "Bullet 2": "some analysis",
              },
            }
            `,
          },
        ],
        temperature: 0.7,
      }),
    });

    // Handle errors from OpenAI API
    console.log(openAIResponse)
    if (!openAIResponse.ok) {
      const errorText = await openAIResponse.text();
      return NextResponse.json(
        { message: "Failed to process text with OpenAI.", error: errorText },
        { status: openAIResponse.status }
      );
    }

    // Parse and return the OpenAI response
    const data = await openAIResponse.json();
    const responseText = data.choices[0].message.content.trim();
    console.log(responseText)
    // Extract the JSON block
    const jsonStartIndex = responseText.indexOf("{");
    const jsonEndIndex = responseText.lastIndexOf("}");

    if (jsonStartIndex === -1 || jsonEndIndex === -1) {
      console.log("FAILED:", responseText)
      return NextResponse.json(
        { message: "Failed to extract JSON block from OpenAI response." },
        { status: 500 }
      );
    }

    const jsonString = responseText.substring(jsonStartIndex, jsonEndIndex + 1);

    // Parse JSON block
    let parsedJson;
    try {
      parsedJson = JSON.parse(jsonString);
    } catch (error) {
      return NextResponse.json(
        { message: "Failed to parse JSON from OpenAI response.", error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Text processed successfully.", parsedData: parsedJson },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in proxy route:", error);
    return NextResponse.json(
      { message: "Unexpected error occurred.", error: error.message },
      { status: 500 }
    );
  }
}
