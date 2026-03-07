"use client";
import { useState, useRef, useEffect } from "react";
import { useAppStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { Send, RefreshCw, User, BookOpen, DollarSign, Briefcase, GraduationCap, MessageCircle } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const STARTER_QUESTIONS = [
  { icon: BookOpen,       text: "What major should I choose based on my interests?" },
  { icon: GraduationCap, text: "Which university is best for Computer Science?" },
  { icon: DollarSign,    text: "How does financial aid and FAFSA work?" },
  { icon: Briefcase,     text: "What careers can I get with a Business degree?" },
  { icon: MessageCircle, text: "Should I go to community college first to save money?" },
  { icon: GraduationCap, text: "I'm torn between nursing and pre-med — help me decide!" },
];

function formatMessage(content: string) {
  const parts = content.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    const lines = part.split("\n");
    return lines.map((line, j) => {
      if (line.startsWith("- ") || line.startsWith("• ")) {
        return <div key={`${i}-${j}`} className="flex gap-2 mb-1"><span>•</span><span>{line.slice(2)}</span></div>;
      }
      if (line === "") return <br key={`${i}-${j}`} />;
      return <span key={`${i}-${j}`}>{line}</span>;
    });
  });
}

export default function ChatPage() {
  const { profile, clearChat } = useAppStore();
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;

    const userMsg: Message = { role: "user", content: text };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedMessages,
          profile: {
            grade: profile.grade,
            gpa: profile.gpa,
            satScore: profile.satScore,
            interests: profile.interests,
            careerValues: profile.careerValues,
            budgetTier: profile.budgetTier,
            needsFinancialAid: profile.needsFinancialAid,
            statePreference: profile.statePreference,
          },
        }),
      });

      const data = await res.json();
      setMessages([...updatedMessages, { role: "assistant", content: data.message }]);
    } catch {
      setMessages([...updatedMessages, {
        role: "assistant",
        content: "Sorry, I encountered an error. Please try again.",
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const handleReset = () => {
    setMessages([]);
    clearChat();
  };

  return (
    <main className="min-h-screen bg-[#FDFCFA] flex flex-col pt-14">
      <div className="flex flex-col flex-1">
        {/* Header */}
        <div className="bg-[#FDFCFA] border-b border-[#F0EDE8] px-6 py-4 flex-shrink-0">
          <div className="max-w-2xl mx-auto flex items-center justify-between">
            <div>
              <h1 className="font-serif text-[22px] text-[#0A1628]">AI Academic Advisor</h1>
              <p className="text-[13px] text-[#8A8178]">Ask anything about majors, universities, financial aid, or careers.</p>
            </div>
            {messages.length > 0 && (
              <button
                onClick={handleReset}
                className="flex items-center gap-1.5 text-[13px] text-[#8A8178] hover:text-[#0A1628] transition-colors duration-150"
              >
                <RefreshCw className="w-3.5 h-3.5" /> New Chat
              </button>
            )}
          </div>
        </div>

        {/* Chat area */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-2xl mx-auto px-6 py-6">
            {messages.length === 0 ? (
              <div>
                {profile.grade && (
                  <div className="bg-[#FDF6E9] border-l-[3px] border-[#C8963E] px-4 py-3 mb-6 rounded-sm">
                    <p className="text-[13px] text-[#B8862E] font-medium">
                      Personalized for you: {profile.grade} student
                      {profile.gpa ? ` · GPA ${profile.gpa}` : ""}
                      {profile.interests.length > 0 ? ` · Interested in ${profile.interests.slice(0, 2).join(" & ")}` : ""}
                    </p>
                  </div>
                )}

                <p className="text-[13px] font-medium text-[#8A8178] uppercase tracking-[0.06em] mb-4">Try asking:</p>
                <div className="space-y-2">
                  {STARTER_QUESTIONS.map((q) => {
                    const Icon = q.icon;
                    return (
                      <button
                        key={q.text}
                        onClick={() => sendMessage(q.text)}
                        className="w-full flex items-center gap-3 text-left text-[14px] text-[#6B6359] hover:text-[#0A1628] py-2.5 border-b border-[#F0EDE8] transition-colors duration-150 group"
                      >
                        <Icon className="w-4 h-4 text-[#B8B0A4] flex-shrink-0" />
                        {q.text}
                        <span className="ml-auto text-[#B8B0A4] group-hover:text-[#8A8178] transition-colors">→</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="space-y-5">
                {messages.map((msg, i) => (
                  <div key={i} className={cn("flex gap-3", msg.role === "user" ? "flex-row-reverse" : "flex-row")}>
                    <div className={cn(
                      "w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-1",
                      msg.role === "user" ? "bg-[#0F2140]" : "bg-[#F8F6F3] border border-[#F0EDE8]"
                    )}>
                      {msg.role === "user"
                        ? <User className="w-3.5 h-3.5 text-white" />
                        : <GraduationCap className="w-3.5 h-3.5 text-[#8A8178]" />}
                    </div>
                    <div className={cn(
                      "max-w-[80%] px-4 py-3 text-[14px] leading-relaxed",
                      msg.role === "user" ? "chat-bubble-user" : "chat-bubble-ai"
                    )}>
                      {formatMessage(msg.content)}
                    </div>
                  </div>
                ))}

                {loading && (
                  <div className="flex gap-3">
                    <div className="w-7 h-7 rounded-full bg-[#F8F6F3] border border-[#F0EDE8] flex items-center justify-center flex-shrink-0 mt-1">
                      <GraduationCap className="w-3.5 h-3.5 text-[#8A8178]" />
                    </div>
                    <div className="chat-bubble-ai px-4 py-3">
                      <div className="flex items-center gap-1 h-5">
                        {[0, 1, 2].map((i) => (
                          <div key={i} className={`typing-dot w-1.5 h-1.5 bg-[#B8B0A4] rounded-full`} />
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                <div ref={bottomRef} />
              </div>
            )}
          </div>
        </div>

        {/* Input */}
        <div className="flex-shrink-0 bg-[#FDFCFA] border-t border-[#F0EDE8] px-6 py-4">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-end gap-3 bg-[#F8F6F3] rounded-lg border border-[#E2DDD5] p-3 focus-within:border-[#B8B0A4] transition-colors duration-150">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask me anything about college, majors, financial aid, careers..."
                rows={1}
                className="flex-1 bg-transparent text-[#0A1628] placeholder-[#B8B0A4] resize-none focus:outline-none text-[14px] leading-relaxed max-h-32"
                style={{ minHeight: "24px" }}
              />
              <button
                onClick={() => sendMessage(input)}
                disabled={!input.trim() || loading}
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-colors duration-150",
                  input.trim() && !loading
                    ? "bg-[#C8963E] text-[#0A1628] hover:bg-[#D4A94F]"
                    : "bg-[#E2DDD5] text-[#B8B0A4] cursor-not-allowed"
                )}
              >
                {loading ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Send className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
            <p className="text-[11px] text-[#B8B0A4] text-center mt-2">
              AI advisor may make mistakes. Verify important information with official sources.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
