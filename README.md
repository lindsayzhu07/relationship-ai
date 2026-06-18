[README.md](https://github.com/user-attachments/files/29112243/README.md)
# 💞 Bond — Relationship AI App

> Speak the language of love your partner actually hears.

A full-stack Next.js relationship communication app powered by OpenAI GPT-4o and Supabase. Built with TypeScript, Tailwind CSS, and a warm, minimalist design system.

---

## ✨ Features

| Screen | Description |
|---|---|
| 🏠 **Landing page** | Brand identity, logo, CTA |
| 🔐 **Auth** | Supabase email/password auth |
| 📊 **Dashboard** | Overview, quick actions, recent check-ins |
| 💬 **Chat** | AI auto-translation before sending, Gottman pattern detection |
| 🌡️ **Feeling Check** | 4-step guided intake → AI-generated partner translation |
| 📈 **Insights** | Weekly patterns, Gottman radar, attachment analysis |
| 🎙️ **Voice Session** | Record conversations, tone analysis, live transcription |
| 📤 **Upload** | WhatsApp exports, voice notes, journals, conflict descriptions |
| 🔄 **Translator** | Standalone emotional translation with before/after |
| 👤 **Profile** | Attachment style, partner name, preferences |

---

## 🚀 Getting Started

### 1. Clone and install

```bash
git clone https://github.com/YOUR_USERNAME/bond-app.git
cd bond-app
npm install
```

### 2. Set up Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run the contents of `supabase-schema.sql`
3. Copy your project URL and anon key from **Settings → API**

### 3. Set up OpenAI

1. Get an API key from [platform.openai.com](https://platform.openai.com)

### 4. Configure environment

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
OPENAI_API_KEY=sk-your-openai-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 5. Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 🗂 Project Structure

```
bond-app/
├── app/
│   ├── page.tsx              # Landing page
│   ├── layout.tsx            # Root layout
│   ├── globals.css           # Global styles
│   ├── api/                  # API routes (OpenAI, Supabase)
│   │   ├── translate/
│   │   ├── feeling-check/
│   │   ├── chat/
│   │   ├── voice-analysis/
│   │   ├── insights/
│   │   ├── upload/
│   │   ├── patterns/
│   │   └── profile/
│   ├── auth/callback/        # Supabase OAuth callback
│   ├── dashboard/
│   ├── chat/
│   ├── feeling-check/
│   ├── insights/
│   ├── voice/
│   ├── upload/
│   ├── translate/
│   ├── onboarding/
│   └── profile/
├── components/
│   ├── landing/              # Hero, features, CTA
│   ├── auth/                 # AuthModal
│   ├── chat/                 # ChatInterface
│   ├── feeling-check/        # FeelingCheckFlow (4 steps)
│   ├── insights/             # InsightsDashboard + charts
│   ├── voice/                # VoiceSession + waveform
│   ├── upload/               # UploadCenter
│   ├── translate/            # TranslatorScreen
│   ├── profile/              # ProfileForm
│   ├── shared/               # PageHeader, EmptyState, etc.
│   └── ui/                   # BondLogo, AppSidebar, Button, etc.
├── hooks/
│   ├── useSupabaseUser.ts
│   ├── useCheckIns.ts
│   ├── useMessages.ts
│   └── useProfile.ts
├── lib/
│   ├── openai.ts             # All OpenAI helpers
│   ├── utils.ts              # cn(), MOODS, TRIGGERS, NEEDS
│   └── supabase/
│       ├── client.ts
│       ├── server.ts
│       └── middleware.ts
├── types/index.ts            # All TypeScript types
├── middleware.ts             # Auth protection
├── supabase-schema.sql       # Run in Supabase SQL Editor
└── .env.local.example
```

---

## 🛠 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Auth + DB**: Supabase (PostgreSQL + RLS)
- **AI**: OpenAI GPT-4o
- **Charts**: Recharts
- **Icons**: Lucide React
- **Fonts**: Lora (serif) + DM Sans

---

## 🚢 Deploy to Vercel

```bash
npx vercel
```

Add all `.env.local` variables to your Vercel project settings.

---

## 📄 License

MIT — built with compassion.
