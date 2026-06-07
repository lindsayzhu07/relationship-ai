import { NextRequest, NextResponse } from "next/server";
import { generateCheckInTranslation, generateInsightText } from "@/lib/openai";
import type { Mood } from "@/types";

export async function POST(req: NextRequest) {
  const { mood, intensity, triggers, needs, journal } = await req.json();

  const [translation, insight] = await Promise.all([
    generateCheckInTranslation(mood as Mood, intensity, triggers, needs, journal),
    generateInsightText(mood as Mood, needs),
  ]);

  return NextResponse.json({ translation, insight });
}
