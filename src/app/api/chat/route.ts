import { NextRequest, NextResponse } from "next/server";
import { openai, SYSTEM_PROMPT } from "@/lib/openai";
import { KNOWLEDGE_BASE } from "@/lib/knowledge-base";

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: SYSTEM_PROMPT.replace("\${KNOWLEDGE_BASE}", KNOWLEDGE_BASE) },
        ...messages,
      ],
      temperature: 0.7,
    });

    return NextResponse.json({
      message: response.choices[0].message.content,
    });
  } catch (error: any) {
    console.error("OpenAI Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch response from AI" },
      { status: 500 }
    );
  }
}
