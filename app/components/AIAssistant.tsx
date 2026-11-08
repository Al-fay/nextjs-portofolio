"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Language } from "../types";
import {
  IconAlertCircle,
  IconChevronsDown,
  IconHelpCircle,
  IconMessage2Sparkle,
  IconSendFilled,
  IconSparklesFilled,
  IconTrash,
  IconX,
} from "@tabler/icons-react";

interface AIAssistantProps {
  lang: Language;
}

interface Message {
  id: string;
  role: "user" | "model";
  content: string;
}

const greeting = (lang: Language): Message[] => [
  {
    id: "initial",
    role: "model",
    content:
      lang === "id"
        ? "Halo! Saya **Copilot Alfay**, asisten portofolio Diva Alfahrizy. Tanyakan apa saja tentang proyek, pengalaman kerja, keahlian teknis Diva, atau bagaimana cara memulai proyek bersama Diva!"
        : "Hi there! I'm **Alfay Copilot**, Diva Alfahrizy's portfolio assistant. Ask me anything about Diva's projects, work experience, core tech stack, or how to start a project together!",
  },
];

// Parser markdown sederhana: **bold** dan `code`.
function formatInline(text: string, isUser = false): React.ReactNode[] {
  const boldRegex = /\*\*(.*?)\*\*/g;
  const codeRegex = /`(.*?)`/g;

  const split = (
    parts: React.ReactNode[],
    regex: RegExp,
    render: (content: string, key: string) => React.ReactNode,
  ): React.ReactNode[] => {
    const out: React.ReactNode[] = [];
    for (const part of parts) {
      if (typeof part !== "string") {
        out.push(part);
        continue;
      }
      let last = 0;
      let match: RegExpExecArray | null;
      regex.lastIndex = 0;
      while ((match = regex.exec(part)) !== null) {
        if (match.index > last) out.push(part.substring(last, match.index));
        out.push(render(match[1], `${match.index}`));
        last = regex.lastIndex;
      }
      if (last < part.length) out.push(part.substring(last));
    }
    return out;
  };

  const withBold = split([text], boldRegex, (content, key) => (
    <strong
      key={`b-${key}`}
      className={`font-bold ${isUser ? "text-inherit" : "text-neutral-900 dark:text-amber-400"}`}
    >
      {content}
    </strong>
  ));

  return split(withBold, codeRegex, (content, key) => (
    <code
      key={`c-${key}`}
      className={`px-1.5 py-0.5 rounded-sm text-[11px] font-mono border ${
        isUser
          ? "bg-neutral-800/20 border-neutral-700/35 text-inherit dark:bg-neutral-950/15 dark:border-neutral-950/20"
          : "bg-neutral-100 dark:bg-white/5 border-neutral-200/50 dark:border-white/10 text-neutral-800 dark:text-amber-200"
      }`}
    >
      {content}
    </code>
  ));
}

function renderFormattedMessage(text: string, isUser = false) {
  if (!text) return null;

  const tone = isUser
    ? "text-inherit"
    : "text-neutral-600 dark:text-neutral-300";

  return text.split("\n").map((line, i) => {
    const trimmed = line.trim();

    if (trimmed.startsWith("### ")) {
      return (
        <h4
          key={i}
          className={`text-[11px] font-mono font-bold tracking-wider uppercase mt-4 mb-1.5 ${
            isUser ? "text-inherit" : "text-neutral-500 dark:text-neutral-400"
          }`}
        >
          {trimmed.slice(4)}
        </h4>
      );
    }

    if (trimmed.startsWith("## ")) {
      return (
        <h3
          key={i}
          className={`text-sm font-sans font-semibold mt-1 mb-1.5 pb-0.5 border-b ${
            isUser
              ? "text-inherit border-current/10"
              : "text-neutral-900 dark:text-white border-neutral-100 dark:border-white/5"
          }`}
        >
          {trimmed.slice(3)}
        </h3>
      );
    }

    // Bullet: "- ", "* ", atau "• " (dipakai answer.ts)
    if (
      trimmed.startsWith("- ") ||
      trimmed.startsWith("* ") ||
      trimmed.startsWith("• ")
    ) {
      return (
        <li
          key={i}
          className={`list-disc ml-4 text-xs font-sans leading-relaxed mb-1 ${tone}`}
        >
          {formatInline(trimmed.slice(2), isUser)}
        </li>
      );
    }

    if (/^\d+\.\s/.test(trimmed)) {
      return (
        <li
          key={i}
          className={`list-decimal ml-4 text-xs font-sans leading-relaxed mb-1 ${tone}`}
        >
          {formatInline(trimmed.replace(/^\d+\.\s/, ""), isUser)}
        </li>
      );
    }

    if (trimmed.startsWith("```")) return null;

    return (
      <p
        key={i}
        className={`text-xs font-sans leading-relaxed mb-1.5 wrap-break-word ${tone}`}
      >
        {formatInline(line, isUser)}
      </p>
    );
  });
}

export const AIAssistant: React.FC<AIAssistantProps> = ({ lang }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(() => greeting(lang));
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const idCounter = useRef(0);
  const nextId = () => `m-${++idCounter.current}`;

  // Judul proyek harus sama persis dengan data.ts agar dijawab sebagai detail proyek.
  const suggestions =
    lang === "id"
      ? [
          "Keahlian teknis Diva apa saja?",
          "Apakah Diva menerima kerja remote?",
          "Ceritakan tentang Portal Pembayaran SPP Sekolah Virtual Account",
          "Bagaimana cara menghubungi Diva?",
        ]
      : [
          "What is Diva core tech stack?",
          "Can Diva work remotely?",
          "Tell me about School Tuition VA Payment Gateway",
          "How can I hire Diva?",
        ];

  // Ganti sapaan saat bahasa berubah.
  useEffect(() => {
    setMessages(greeting(lang));
    setErrorText(null);
  }, [lang]);

  // Auto-scroll ke pesan terbaru.
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSendMessage = async (text: string) => {
    const message = text.trim();
    if (!message || isLoading) return;

    setErrorText(null);
    setMessages((prev) => [
      ...prev,
      { id: nextId(), role: "user", content: message },
    ]);
    setInputMessage("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, lang }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.error || "Server responded with an error");
      }

      setMessages((prev) => [
        ...prev,
        {
          id: nextId(),
          role: "model",
          content: data.answer || "No response returned.",
        },
      ]);
    } catch (err: unknown) {
      console.error(err);
      setErrorText(
        lang === "id"
          ? "Gagal menghubungi asisten. Pastikan server berjalan (npm run dev)."
          : "Could not reach the assistant. Make sure the server is running (npm run dev).",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetChat = () => {
    setMessages(greeting(lang));
    setErrorText(null);
  };

  return (
    <div
      className="fixed bottom-6 right-6 z-50 font-sans"
      id="ai-assistant-wrapper"
    >
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.92 }}
            transition={{ type: "spring", damping: 25, stiffness: 350 }}
            className="fixed inset-x-4 bottom-6 top-6 sm:absolute sm:inset-auto sm:bottom-18 sm:right-0 sm:w-105 sm:h-145 h-auto bg-white dark:bg-[#111113] border border-neutral-200 dark:border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
            id="ai-assistant-card"
          >
            {/* Header */}
            <div
              className="px-5 py-4 bg-neutral-50 dark:bg-neutral-900 border-b border-neutral-200 dark:border-white/5 flex items-center justify-between"
              id="ai-card-header"
            >
              <div className="flex items-center gap-2.5">
                <div className="relative">
                  <div className="w-8 h-8 rounded-full bg-neutral-100 dark:bg-white/5 border border-neutral-200 dark:border-white/10 flex items-center justify-center text-neutral-800 dark:text-neutral-200">
                    <IconSparklesFilled className="w-4 h-4 text-amber-500" />
                  </div>
                  <span className="absolute bottom-0 right-0 w-2 h-2 bg-emerald-500 rounded-full border border-white dark:border-[#111113] animate-pulse"></span>
                </div>
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-900 dark:text-white leading-tight">
                    Alfay Copilot
                  </h3>
                  <p className="text-[9px] font-mono text-neutral-400 dark:text-white/30 uppercase tracking-widest leading-none mt-0.5">
                    {lang === "id"
                      ? "Asisten Portofolio"
                      : "Portfolio Assistant"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={handleResetChat}
                  className="p-1.5 rounded-lg text-neutral-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-neutral-200/50 dark:hover:bg-white/5 transition-all cursor-pointer"
                  title={
                    lang === "id" ? "Reset Percakapan" : "Reset Conversation"
                  }
                  aria-label={
                    lang === "id" ? "Reset Percakapan" : "Reset Conversation"
                  }
                >
                  <IconTrash className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-white hover:bg-neutral-200/50 dark:hover:bg-white/5 transition-all cursor-pointer"
                  aria-label={lang === "id" ? "Tutup" : "Close"}
                >
                  <IconX className="w-4.5 h-4.5" />
                </button>
              </div>
            </div>

            {/* Content Area */}
            <div
              className="flex-1 overflow-y-auto px-5 py-4 space-y-4"
              id="ai-card-body"
            >
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs ${
                      m.role === "user"
                        ? "bg-neutral-950 dark:bg-amber-500 text-white dark:text-neutral-950 font-sans shadow-sm rounded-tr-xs border border-neutral-900 dark:border-amber-400"
                        : "bg-neutral-100 dark:bg-white/5 text-neutral-800 dark:text-neutral-200 border border-neutral-200/50 dark:border-white/5 rounded-tl-xs shadow-3xs"
                    }`}
                  >
                    {renderFormattedMessage(m.content, m.role === "user")}
                  </div>
                </div>
              ))}

              {/* Saran pertanyaan saat percakapan baru dimulai */}
              {messages.length <= 1 && (
                <div className="pt-4 space-y-2">
                  <p className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest flex items-center gap-1">
                    <IconHelpCircle className="w-3 h-3" />
                    <span>
                      {lang === "id"
                        ? "Pertanyaan Populer"
                        : "Suggested Prompts"}
                    </span>
                  </p>
                  <div className="flex flex-col gap-1.5">
                    {suggestions.map((s) => (
                      <button
                        key={s}
                        onClick={() => handleSendMessage(s)}
                        className="w-full text-left px-3.5 py-2.5 rounded-xl text-neutral-600 dark:text-neutral-300 bg-neutral-50 dark:bg-white/2 border border-neutral-200/70 dark:border-white/5 hover:border-neutral-400 dark:hover:border-white/20 hover:bg-neutral-100/50 dark:hover:bg-white/5 transition-all text-xs cursor-pointer block"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Indikator loading */}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-neutral-100 dark:bg-white/5 border border-neutral-200/50 dark:border-white/5 rounded-2xl rounded-tl-xs px-4 py-3 flex items-center gap-1 shadow-3xs">
                    {[0, 150, 300].map((d) => (
                      <span
                        key={d}
                        className="w-1.5 h-1.5 bg-neutral-400 dark:bg-white/40 rounded-full animate-bounce"
                        style={{ animationDelay: `${d}ms` }}
                      ></span>
                    ))}
                  </div>
                </div>
              )}

              {/* Error */}
              {errorText && (
                <div
                  className="flex gap-2.5 p-3.5 rounded-xl border border-red-500/20 bg-red-500/5 dark:bg-red-500/10 text-red-600 dark:text-red-400 text-xs items-start"
                  id="ai-error-box"
                >
                  <IconAlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <p className="font-sans leading-relaxed">{errorText}</p>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage(inputMessage);
              }}
              className="p-4 bg-neutral-50 dark:bg-neutral-900 border-t border-neutral-200 dark:border-white/5 flex gap-2 items-center"
              id="ai-input-form"
            >
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                maxLength={500}
                placeholder={
                  lang === "id" ? "Tanya tentang Diva..." : "Ask about Diva..."
                }
                className="flex-1 bg-white dark:bg-[#0A0A0B] border border-neutral-200 dark:border-white/10 rounded-xl px-3.5 py-2 text-xs text-neutral-900 dark:text-white focus:outline-none focus:border-neutral-400 dark:focus:border-white/25 focus:ring-0 transition-colors placeholder:text-neutral-400 dark:placeholder:text-white/20"
                id="ai-text-input"
              />
              <button
                type="submit"
                disabled={!inputMessage.trim() || isLoading}
                aria-label={lang === "id" ? "Kirim" : "Send"}
                className="p-2 bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 rounded-xl disabled:opacity-40 hover:opacity-95 transition-all cursor-pointer flex items-center justify-center shrink-0"
              >
                <IconSendFilled className="w-3.5 h-3.5" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tombol FAB */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`w-13 h-13 rounded-full bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 shadow-2xl flex items-center justify-center border border-neutral-200 dark:border-neutral-800 cursor-pointer overflow-hidden group focus:outline-hidden relative ${isOpen ? "hidden sm:flex" : "flex"}`}
        id="ai-assistant-trigger-button"
        title={lang === "id" ? "Tanya AI" : "Ask AI"}
        aria-label={lang === "id" ? "Tanya AI" : "Ask AI"}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close-icon"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <IconChevronsDown className="w-5.5 h-5.5" />
            </motion.div>
          ) : (
            <motion.div
              key="chat-icon"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative flex items-center justify-center"
            >
              <IconMessage2Sparkle className="w-5.5 h-5.5" />
              <span className="absolute -top-1 -right-1 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
};
