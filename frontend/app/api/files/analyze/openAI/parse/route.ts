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
export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body.text) {
      return NextResponse.json(
        { message: "Missing 'text' in request body." },
        { status: 400 }
      );
    }

    // OpenAI API Request
    const openAIResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini", // Replace with your desired model
        messages: [
          {
            role: "user",
            content: `Parse the following bank statement text ${body.text}, and return in the following structured JSON format:{
  "accountInfo": {
    "Account Name": "",
    "Account Number": "",
    "Bank Name": "",
    "Currency Type":"",
    "Currency Symbol":"",
    "Statement Period": "",
    "Opening Balance": "",
    "Closing Balance": "",

  },
  "transactions": [
    {
      "date": "",
      "description": "",
      "debit": "",
      "credit": "",
      "balance": ""
    }
  ]
}
`,
          },
        ],
        temperature: 0.7, // Optional, adjust as needed
      }),
    });

    // Handle OpenAI Response
    if (!openAIResponse.ok) {
      const errorText = await openAIResponse.text();
      return NextResponse.json(
        { message: "Failed to process text with OpenAI.", error: errorText },
        { status: openAIResponse.status }
      );
    }

    const data = await openAIResponse.json();
    const responseText = data.choices[0].message.content.trim();
    console.log(responseText)
    // Extract the JSON block
    const jsonStartIndex = responseText.indexOf("{");
    const jsonEndIndex = responseText.lastIndexOf("}");

    if (jsonStartIndex === -1 || jsonEndIndex === -1) {
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
      { message: "Unexpected error occurred.", error: (error as Error).message },
      { status: 500 }
    );
  }
}
