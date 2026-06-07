export type Mood =
  | "content" | "frustrated" | "hurt" | "anxious"
  | "numb" | "grateful" | "angry" | "vulnerable"
  | "invisible" | "loving";

export interface MoodConfig {
  id: Mood;
  name: string;
  sub: string;
  icon: string;
  bg: string;
  iconColor: string;
  textColor: string;
  borderColor: string;
}

export interface CheckIn {
  id: string;
  user_id: string;
  mood: Mood;
  intensity: number;
  triggers: string[];
  needs: string[];
  journal: string;
  translation: string;
  sent_to_partner: boolean;
  created_at: string;
}

export interface Message {
  id: string;
  role: "user" | "assistant" | "partner";
  content: string;
  original_content?: string;
  is_translated?: boolean;
  pattern_tags?: string[];
  created_at: string;
}

export interface Profile {
  id: string;
  user_id: string;
  display_name: string;
  partner_name: string;
  attachment_style?: string;
  emotional_style?: string;
  avatar_color?: string;
  created_at: string;
}

export interface InsightWeek {
  connection_score: number;
  calm_conversations: number;
  conflicts_resolved: number;
  avg_repair_minutes: number;
  warmth_series: number[];
  tension_series: number[];
  gottman: {
    criticism: number;
    defensiveness: number;
    stonewalling: number;
    contempt: number;
    repair: number;
  };
}

export interface VoiceSession {
  id: string;
  user_id: string;
  duration_seconds: number;
  transcript: TranscriptEntry[];
  tone_analysis: ToneAnalysis;
  created_at: string;
}

export interface TranscriptEntry {
  speaker: "you" | "partner";
  text: string;
  timestamp: number;
  tone: string;
  pattern?: string;
}

export interface ToneAnalysis {
  you: { calm: number; tense: number; vulnerable: number };
  partner: { calm: number; defensive: number; open: number };
}
