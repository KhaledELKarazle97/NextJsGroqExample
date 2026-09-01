import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Groq's multimodal (vision) lineup changes fairly often, so it's kept
// configurable here. Check https://console.groq.com/docs/models for the
// current list of vision-capable models if this one stops working.
const VISION_MODEL = process.env.GROQ_VISION_MODEL ?? "qwen/qwen3.6-27b";

const MAX_FILE_SIZE_BYTES = 8 * 1024 * 1024; // 8 MB

export async function POST(request: NextRequest) {
  if (!process.env.GROQ_API_KEY) {
    return NextResponse.json(
      { error: "Missing GROQ_API_KEY. Add it to your .env.local file." },
      { status: 500 }
    );
  }

  try {
    const formData = await request.formData();
    const file = formData.get("image");

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { error: "Send an image file under the 'image' form field." },
        { status: 400 }
      );
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "That file doesn't look like an image." },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json(
        { error: "Image is too large. Please use a file under 8MB." },
        { status: 400 }
      );
    }

    // Groq's vision models accept images as base64 data URLs, so we convert
    // the uploaded file in memory instead of needing a separate OCR library.
    const arrayBuffer = await file.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");
    const dataUrl = `data:${file.type};base64,${base64}`;

    const completion = await groq.chat.completions.create({
      model: VISION_MODEL,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Extract every piece of readable text from this image, exactly as written. Return only the extracted text, with line breaks preserved, and no extra commentary. If there is no readable text, say 'No text found.'",
            },
            {
              type: "image_url",
              image_url: { url: dataUrl },
            },
          ] as any,
        },
      ],
      temperature: 0,
      max_tokens: 1024,
    });

    const text = completion.choices[0]?.message?.content ?? "";

    return NextResponse.json({ text });
  } catch (error) {
    console.error("Groq OCR error:", error);
    return NextResponse.json(
      { error: "Something went wrong talking to Groq." },
      { status: 500 }
    );
  }
}
