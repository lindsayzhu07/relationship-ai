import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: NextRequest) {
  const { messages } = await req.json();

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    temperature: 0.7,
    messages: [
      {
        role: "system",
        content: `You are Bond, a compassionate relationship AI assistant. 
Help couples communicate more effectively using Gottman Method principles and Nonviolent Communication.
Be warm, empathetic, and specific. Never take sides. Always validate feelings before offering perspective.`,
      },
      ...messages,
    ],
  });

  return NextResponse.json({
    message: response.choices[0].message.content,
  });
}
