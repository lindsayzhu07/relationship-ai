import { NextRequest, NextResponse } from "next/server";
import { analyzeVoiceTranscript } from "@/lib/openai";

export async function POST(req: NextRequest) {
  const { transcript } = await req.json();
  const result = await analyzeVoiceTranscript(transcript);
  return NextResponse.json(result);
}
