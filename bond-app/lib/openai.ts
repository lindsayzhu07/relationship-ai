import OpenAI from "openai";
import type { Mood } from "@/types";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function translateMessage(rawMessage: string): Promise<{
  translation: string;
  patterns: string[];
  coreNeed: string;
  partnerHears: string;
}> {
  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    temperature: 0.7,
    messages: [
      {
        role: "system",
        content: `You are a compassionate relationship communication expert trained in Gottman Method and Nonviolent Communication. 
Your job is to translate emotionally charged or reactive messages into clear, vulnerable, needs-based language that a partner can receive without defensiveness.

Respond ONLY with valid JSON matching this shape:
{
  "translation": "string — the emotionally translated message, first person, warm and vulnerable",
  "patterns": ["array of strings — detected patterns like Criticism, Blame language, Stonewalling, Defensiveness, Contempt, Generalization"],
  "coreNeed": "string — the underlying emotional need in one sentence",
  "partnerHears": "string — what the partner likely hears/feels reading the original message"
}`,
      },
      {
        role: "user",
        content: `Translate this message: "${rawMessage}"`,
      },
    ],
    response_format: { type: "json_object" },
  });

  const raw = response.choices[0].message.content ?? "{}";
  return JSON.parse(raw);
}

export async function generateCheckInTranslation(
  mood: Mood,
  intensity: number,
  triggers: string[],
  needs: string[],
  journal: string
): Promise<string> {
  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    temperature: 0.75,
    messages: [
      {
        role: "system",
        content: `You are a compassionate relationship AI. Generate a warm, emotionally honest message from the user to their partner. 
The message should be vulnerable, specific, and easy for a partner to receive. 
Write in first person, 2-4 sentences. No quotation marks. No preamble.`,
      },
      {
        role: "user",
        content: `My primary emotion: ${mood} (intensity ${intensity}/10)
Triggered by: ${triggers.join(", ") || "general feelings"}
What I need: ${needs.join(", ") || "connection"}
My private journal (for context only, do NOT quote): ${journal || "No journal entry"}

Generate a translated message I can send to my partner.`,
      },
    ],
  });

  return response.choices[0].message.content ?? "";
}

export async function generateInsightText(
  mood: Mood,
  needs: string[]
): Promise<string> {
  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    temperature: 0.6,
    max_tokens: 150,
    messages: [
      {
        role: "system",
        content: `You are a relationship therapist AI. Generate a short (2 sentences max), compassionate insight about the emotional pattern detected. Be specific, warm, and actionable. No bullet points.`,
      },
      {
        role: "user",
        content: `Emotion: ${mood}. Needs: ${needs.join(", ")}`,
      },
    ],
  });

  return response.choices[0].message.content ?? "";
}

export async function analyzeVoiceTranscript(
  transcript: string
): Promise<{
  patterns: string[];
  moments: Array<{ type: string; description: string }>;
  suggestion: string;
}> {
  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    temperature: 0.5,
    messages: [
      {
        role: "system",
        content: `You are a relationship communication analyst. Analyze the conversation transcript for Gottman patterns and communication dynamics.
Respond ONLY with valid JSON:
{
  "patterns": ["array of detected patterns: Criticism | Defensiveness | Stonewalling | Contempt | Repair attempt | Vulnerability | Active listening"],
  "moments": [{"type": "string", "description": "string"}, ...],
  "suggestion": "string — one compassionate, actionable suggestion for this couple"
}`,
      },
      {
        role: "user",
        content: `Transcript:\n${transcript}`,
      },
    ],
    response_format: { type: "json_object" },
  });

  const raw = response.choices[0].message.content ?? "{}";
  return JSON.parse(raw);
}

export async function generateWeeklyInsight(checkIns: Array<{ mood: string; intensity: number }>): Promise<string> {
  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    temperature: 0.65,
    max_tokens: 200,
    messages: [
      {
        role: "system",
        content: "You are a relationship therapist AI. Summarize the emotional patterns from this week's check-ins in 2-3 compassionate, specific sentences. Highlight one positive trend and one growth opportunity.",
      },
      {
        role: "user",
        content: `This week's check-ins: ${JSON.stringify(checkIns)}`,
      },
    ],
  });

  return response.choices[0].message.content ?? "";
}
