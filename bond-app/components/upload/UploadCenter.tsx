"use client";

import { useState, useRef } from "react";
import { Upload, CheckCircle2, Loader2, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

type UploadStatus = "idle" | "uploading" | "done" | "error";

interface UploadItem {
  id: string;
  name: string;
  type: string;
  size: string;
  status: UploadStatus;
  insight?: string;
}

const UPLOAD_TYPES = [
  {
    id: "conversations",
    icon: "💬",
    title: "Text conversations",
    desc: "WhatsApp, iMessage, SMS exports. AI maps emotional arcs across weeks.",
    accept: ".txt,.zip,.json",
    bg: "bg-rose-50 border-rose-100",
  },
  {
    id: "voice",
    icon: "🎙️",
    title: "Voice notes",
    desc: "Recorded voice memos or conversations. Tone and emotion analysis included.",
    accept: ".mp3,.m4a,.wav,.ogg",
    bg: "bg-[#eeedfe] border-[#afa9ec]/30",
  },
  {
    id: "journal",
    icon: "📓",
    title: "Journal entries",
    desc: "Personal journal entries. AI extracts recurring emotional themes privately.",
    accept: ".txt,.pdf,.docx",
    bg: "bg-[#faeeda] border-[#fac775]/30",
  },
  {
    id: "conflict",
    icon: "🔥",
    title: "Conflict description",
    desc: "Describe a recurring fight. AI identifies the cycle beneath it.",
    accept: ".txt",
    bg: "bg-[#eaf3de] border-[#97c459]/30",
  },
];

const RECENT: UploadItem[] = [
  { id: "1", name: "WhatsApp export — March 2025",      type: "conversations", size: "2.3 MB",  status: "done",      insight: "4,832 messages · 3 conflict cycles identified" },
  { id: "2", name: "Voice memo — Thursday conversation", type: "voice",         size: "14.2 MB", status: "uploading", insight: "" },
  { id: "3", name: "Journal — Feb entries (11 entries)", type: "journal",       size: "48 KB",   status: "idle",      insight: "Queued for analysis" },
];

export default function UploadCenter() {
  const [items, setItems] = useState<UploadItem[]>(RECENT);
  const [dragging, setDragging] = useState(false);
  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  function handleFile(file: File, type: string) {
    const newItem: UploadItem = {
      id: Date.now().toString(),
      name: file.name,
      type,
      size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
      status: "uploading",
    };
    setItems((prev) => [newItem, ...prev]);
    // Simulate upload
    setTimeout(() => {
      setItems((prev) =>
        prev.map((i) => i.id === newItem.id
          ? { ...i, status: "done", insight: "Analysis complete — patterns detected." }
          : i)
      );
    }, 2500);
  }

  function onInputChange(e: React.ChangeEvent<HTMLInputElement>, type: string) {
    Array.from(e.target.files ?? []).forEach((f) => handleFile(f, type));
    e.target.value = "";
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    Array.from(e.dataTransfer.files).forEach((f) => handleFile(f, "conversations"));
  }

  const statusBadge = (s: UploadStatus) => {
    if (s === "done")      return <span className="text-xs bg-green-50 text-green-700 px-2.5 py-1 rounded-full font-medium flex items-center gap-1"><CheckCircle2 size={11} /> Complete</span>;
    if (s === "uploading") return <span className="text-xs bg-amber-50 text-amber-700 px-2.5 py-1 rounded-full font-medium flex items-center gap-1"><Loader2 size={11} className="animate-spin" /> Analysing</span>;
    return <span className="text-xs bg-gray-100 text-gray-500 px-2.5 py-1 rounded-full font-medium">Queued</span>;
  };

  return (
    <div className="flex flex-col gap-6 max-w-4xl">
      {/* Type cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {UPLOAD_TYPES.map((t) => (
          <div key={t.id} className={cn("border rounded-2xl p-5 flex flex-col gap-4", t.bg)}>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-white/60 flex items-center justify-center text-xl shrink-0">{t.icon}</div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm text-ink">{t.title}</p>
                <p className="text-xs text-ink-soft mt-1 leading-relaxed">{t.desc}</p>
              </div>
            </div>
            <button
              onClick={() => inputRefs.current[t.id]?.click()}
              className="w-full py-2.5 bg-white/70 hover:bg-white border border-white/80 rounded-xl text-xs font-medium text-ink-soft transition-colors flex items-center justify-center gap-2"
            >
              <Upload size={13} /> Choose file ({t.accept})
            </button>
            <input
              ref={(el) => { inputRefs.current[t.id] = el; }}
              type="file"
              accept={t.accept}
              multiple
              className="hidden"
              onChange={(e) => onInputChange(e, t.id)}
            />
          </div>
        ))}
      </div>

      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className={cn(
          "border-2 border-dashed rounded-2xl p-10 flex flex-col items-center gap-3 transition-all cursor-pointer",
          dragging ? "border-rose-400 bg-rose-50" : "border-gray-200 hover:border-rose-300 hover:bg-rose-50/30"
        )}
        onClick={() => inputRefs.current["conversations"]?.click()}
      >
        <div className="w-12 h-12 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-500">
          <Upload size={22} />
        </div>
        <p className="font-medium text-sm text-ink">Drag files here or click to browse</p>
        <p className="text-xs text-ink-soft">All formats accepted</p>
        <div className="flex items-center gap-2 text-xs text-ink-soft mt-1">
          <Lock size={11} /> End-to-end encrypted · Never shared without consent
        </div>
      </div>

      {/* Recent uploads */}
      {items.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-medium text-sm text-ink">Recently uploaded</h2>
            <button className="text-xs text-rose-500 hover:underline">Analyse all</button>
          </div>
          <div className="flex flex-col gap-2">
            {items.map((item) => {
              const typeConfig = UPLOAD_TYPES.find((t) => t.id === item.type);
              return (
                <div key={item.id} className="bg-white border border-gray-100 rounded-xl px-4 py-3 flex items-center gap-4">
                  <div className="w-9 h-9 rounded-lg bg-rose-50 flex items-center justify-center text-base shrink-0">
                    {typeConfig?.icon ?? "📄"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-ink truncate">{item.name}</p>
                    <p className="text-xs text-ink-soft mt-0.5">
                      {item.size}{item.insight ? ` · ${item.insight}` : ""}
                    </p>
                  </div>
                  {statusBadge(item.status)}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
