"use client";
import { useState, useRef, useEffect } from "react";
import { useAppStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import {
  Send, MessageCircle, Sparkles, RefreshCw, User,
  BookOpen, University, DollarSign, Briefcase, GraduationCap
} from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const STARTER_QUESTIONS = [
  { icon: BookOpen, text: "What major should I choose based on my interests?" },
  { icon: University, text: "Which university is best for Computer Science?" },
  { icon: DollarSign, text: "How does financial aid and FAFSA work?" },
  { icon: Briefcase, text: "What careers can I get with a Business degree?" },
  { icon: GraduationCap, text: "Should I go to community college first to save money?" },
  { icon: Sparkles, text: "I'm torn between nursing and pre-med — help me decide!" },
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
  const { profile, chatMessages, addChatMessage, clearChat } = useAppStore();
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
      const assistantMsg: Message = { role: "assistant", content: data.message };
      setMessages([...updatedMessages, assistantMsg]);
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
    <main className="lg:pl-[260px] min-h-screen bg-slate-50 flex flex-col">
      <div className="pt-16 lg:pt-0 flex flex-col flex-1">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-violet-600 px-6 py-6 flex-shrink-0">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">AI Academic Advisor</h1>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-green-400" />
                  <span className="text-blue-200 text-xs">Online — Powered by GPT-4</span>
                </div>
              </div>
            </div>
            {messages.length > 0 && (
              <button
                onClick={handleReset}
                className="flex items-center gap-2 text-white/70 hover:text-white text-sm transition-colors"
              >
                <RefreshCw className="w-4 h-4" /> New Chat
              </button>
            )}
          </div>
        </div>

        {/* Chat area */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
            {messages.length === 0 ? (
              /* Welcome state */
              <div className="text-center py-8">
                <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center mx-auto mb-6 shadow-xl shadow-blue-500/25">
                  <GraduationCap className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-2xl font-black text-gray-900 mb-2">Your AI Academic Advisor</h2>
                <p className="text-gray-500 max-w-lg mx-auto mb-8">
                  Ask me anything about majors, universities, financial aid, career paths, or the application process. I&apos;m here 24/7.
                </p>

                {/* Profile context */}
                {profile.grade && (
                  <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 mb-8 max-w-sm mx-auto">
                    <p className="text-sm text-blue-700 font-medium">
                      Personalized for you: {profile.grade} student
                      {profile.gpa ? ` · GPA ${profile.gpa}` : ""}
                      {profile.interests.length > 0 ? ` · Interested in ${profile.interests.slice(0, 2).join(" & ")}` : ""}
                    </p>
                  </div>
                )}

                <p className="text-sm font-semibold text-gray-500 mb-4">Try asking:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl mx-auto">
                  {STARTER_QUESTIONS.map((q) => {
                    const Icon = q.icon;
                    return (
                      <button
                        key={q.text}
                        onClick={() => sendMessage(q.text)}
                        className="flex items-center gap-3 bg-white rounded-2xl p-4 border border-gray-100 hover:border-blue-300 hover:shadow-md transition-all text-left group"
                      >
                        <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-100">
                          <Icon className="w-4 h-4 text-blue-600" />
                        </div>
                        <span className="text-sm text-gray-700 group-hover:text-blue-700 transition-colors">{q.text}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              /* Messages */
              <div className="space-y-5">
                {messages.map((msg, i) => (
                  <div key={i} className={cn("flex gap-3", msg.role === "user" ? "flex-row-reverse" : "flex-row")}>
                    {/* Avatar */}
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1",
                      msg.role === "user"
                        ? "bg-gradient-to-br from-blue-500 to-violet-500"
                        : "bg-gradient-to-br from-blue-600 to-violet-600"
                    )}>
                      {msg.role === "user"
                        ? <User className="w-4 h-4 text-white" />
                        : <Sparkles className="w-4 h-4 text-white" />}
                    </div>

                    {/* Bubble */}
                    <div className={cn(
                      "max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
                      msg.role === "user"
                        ? "chat-bubble-user"
                        : "chat-bubble-ai"
                    )}>
                      {formatMessage(msg.content)}
                    </div>
                  </div>
                ))}

                {/* Loading */}
                {loading && (
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center flex-shrink-0 mt-1">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <div className="chat-bubble-ai px-4 py-3 rounded-2xl">
                      <div className="flex items-center gap-1.5 h-5">
                        {[0, 1, 2].map((i) => (
                          <div key={i} className={`typing-dot w-2 h-2 bg-gray-400 rounded-full`} />
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
        <div className="flex-shrink-0 bg-white border-t border-gray-200 px-4 sm:px-6 py-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-end gap-3 bg-gray-50 rounded-2xl border border-gray-200 p-3 focus-within:border-blue-400 focus-within:ring-1 focus-within:ring-blue-400 transition-all">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask me anything about college, majors, financial aid, careers..."
                rows={1}
                className="flex-1 bg-transparent text-gray-900 placeholder-gray-400 resize-none focus:outline-none text-sm leading-relaxed max-h-32"
                style={{ minHeight: "24px" }}
              />
              <button
                onClick={() => sendMessage(input)}
                disabled={!input.trim() || loading}
                className={cn(
                  "w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-all",
                  input.trim() && !loading
                    ? "bg-gradient-to-r from-blue-600 to-violet-600 text-white hover:from-blue-700 hover:to-violet-700 shadow-lg shadow-blue-500/25"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                )}
              >
                {loading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </button>
            </div>
            <p className="text-xs text-gray-400 text-center mt-2">
              AI advisor may make mistakes. Verify important information with official sources.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
