import ChatInterface from "@/components/chat/ChatInterface";

export default function ChatPage() {
  return (
    <div className="h-screen flex flex-col pb-16 md:pb-0">
      <div className="px-6 py-4 border-b border-rose-50 bg-white flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center text-sm">💞</div>
        <div>
          <h1 className="font-medium text-sm text-ink">Chat with Jamie</h1>
          <p className="text-xs text-ink-soft">AI translation active</p>
        </div>
      </div>
      <ChatInterface />
    </div>
  );
}
