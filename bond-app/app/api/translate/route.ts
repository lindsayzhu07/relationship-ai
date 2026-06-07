import { NextRequest, NextResponse } from "next/server";
import { translateMessage } from "@/lib/openai";

export async function POST(req: NextRequest) {
  const { message } = await req.json();
  if (!message?.trim()) return NextResponse.json({ error: "No message" }, { status: 400 });
  const result = await translateMessage(message);
  return NextResponse.json(result);
}
