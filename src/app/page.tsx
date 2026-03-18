"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, User, Loader2, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hello! I am AE, your professional AI Agent. How can I assist you with the 9-Step Operational Blueprint today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      const data = await response.json();
      if (data.message) {
        setMessages((prev) => [...prev, { role: "assistant", content: data.message }]);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-8 bg-black/20">
      <div className="w-full max-w-4xl flex flex-col h-[85vh] glass-card rounded-3xl overflow-hidden relative">
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/5 backdrop-blur-md z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
                AE AI Agent
              </h1>
              <p className="text-xs text-indigo-300 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                Professional CSM Master Brain
              </p>
            </div>
          </div>
          <div className="px-3 py-1 rounded-full bg-white/10 border border-white/10 text-[10px] uppercase tracking-wider font-semibold text-white/50">
            v1.0.0
          </div>
        </div>

        {/* Chat Messages */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide"
        >
          <AnimatePresence initial={false}>
            {messages.map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.3 }}
                className={cn(
                  "flex items-start gap-4 max-w-[85%]",
                  m.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
                )}
              >
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center shrink-0 border border-white/10",
                  m.role === "user" ? "bg-white/10" : "bg-gradient-to-tr from-indigo-900 to-indigo-700"
                )}>
                  {m.role === "user" ? <User className="w-4 h-4" /> : <Sparkles className="w-4 h-4 text-indigo-200" />}
                </div>
                <div className={cn(
                  "p-4 rounded-2xl text-sm leading-relaxed",
                  m.role === "user" 
                    ? "bg-indigo-600/20 border border-indigo-500/30 text-indigo-50" 
                    : "glass-card text-white/90"
                )}>
                  {m.content}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2 text-indigo-300/60 text-xs italic"
            >
              <Loader2 className="w-3 h-3 animate-spin" />
              AE is thinking...
            </motion.div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-6 bg-white/5 backdrop-blur-xl border-t border-white/10">
          <form onSubmit={handleSubmit} className="relative flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything about the system..."
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all placeholder:text-white/20 text-sm"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="absolute right-2 p-3 bg-gradient-to-tr from-indigo-600 to-indigo-500 rounded-xl hover:shadow-lg hover:shadow-indigo-500/40 transition-all disabled:opacity-50 disabled:hover:shadow-none"
            >
              <Send className="w-5 h-5 text-white" />
            </button>
          </form>
          <p className="mt-4 text-center text-[10px] text-white/20 uppercase tracking-[0.2em]">
            Powered by GPT-4o-mini & The 9-Step Roadmap
          </p>
        </div>
      </div>
      
      {/* Background Orbs */}
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/10 rounded-full blur-[120px] -z-10" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-600/10 rounded-full blur-[120px] -z-10" />
    </main>
  );
}
