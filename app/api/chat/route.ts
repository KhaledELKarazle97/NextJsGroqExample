import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

// The API key lives only on the server. It is read from an environment
// variable, so it is never bundled into the browser JavaScript.
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// A general-purpose, fast Groq chat model. You can swap this for any other
// model id listed at https://console.groq.com/docs/models
const CHAT_MODEL = process.env.GROQ_CHAT_MODEL ?? "openai/gpt-oss-20b";

type ChatMessage = {
  role: "user" | "assistant" | "system";
  content: string;
};

export async function POST(request: NextRequest) {
  if (!process.env.GROQ_API_KEY) {
    return NextResponse.json(
      { error: "Missing GROQ_API_KEY. Add it to your .env.local file." },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();
    const messages: ChatMessage[] = body.messages ?? [];

    if (messages.length === 0) {
      return NextResponse.json(
        { error: "Request body must include a non-empty 'messages' array." },
        { status: 400 }
      );
    }

    const completion = await groq.chat.completions.create({
      model: CHAT_MODEL,
      messages: [
        {
          role: "system",
          content:
            "You are a friendly assistant helping students in a web development course. Keep answers clear and concise.",
        },
        ...messages,
      ],
      temperature: 0.7,
      max_tokens: 1024,
    });

    const reply = completion.choices[0]?.message?.content ?? "";

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Groq chat error:", error);
    return NextResponse.json(
      { error: "Something went wrong talking to Groq." },
      { status: 500 }
    );
  }
}
