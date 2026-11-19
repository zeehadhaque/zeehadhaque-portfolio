import React, { useState, useRef, useEffect } from "react";
import { SITE_CONFIG } from "../data/siteConfig";
import { videoArchive } from "../data/videoArchive";
import { siteIdentity } from "../data/site";
import {
  ZEE_AI_WELCOME_MESSAGE,
  ZEE_AI_STARTER_CHIPS,
} from "../data/zeeAiPersona";

interface Message {
  id: string;
  sender: "zee" | "user";
  text: string;
  time: string;
}

interface ZeeAIChatModalProps {
  onClose: () => void;
}

export const ZeeAIChatModal: React.FC<ZeeAIChatModalProps> = ({ onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "init",
      sender: "zee",
      text: ZEE_AI_WELCOME_MESSAGE,
      time: "NOW",
    },
  ]);
  const [inputVal, setInputVal] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleCopyText = async (id: string, textToCopy: string) => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      /* ignore */
    }
  };

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || inputVal).trim();
    if (!text || isTyping) return;

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      sender: "user",
      text,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputVal("");
    setIsTyping(true);

    try {
      // 1. Attempt API Chat Endpoint
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });

      if (res.ok) {
        const data = (await res.json()) as { reply?: string; message?: string };
        const replyText = data.reply || data.message || "No transmission received.";
        const zeeMsg: Message = {
          id: `z-${Date.now()}`,
          sender: "zee",
          text: replyText,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };
        setMessages((prev) => [...prev, zeeMsg]);
        setIsTyping(false);
        return;
      }
      throw new Error("API chat route unavailable");
    } catch {
      // 2. Intelligent Auteur Contextual Fallback
      setTimeout(() => {
        let reply = "";
        const lower = text.toLowerCase();

        if (lower.includes("shayari") || lower.includes("শায়েরি")) {
          reply = `ভিজে পিচঢালা পথ, নিভে যাওয়া শেষ বাতি,\nতুমি যাকে আলো ভাবো—সে আসলে আমার একাকীত্ব রাতি।\n\nসিনেমা হলো যা বলা যায় না, কেবল ফ্রেমে আটকে রাখা এক টুকরো দীর্ঘশ্বাস।`;
        } else if (lower.includes("kobita") || lower.includes("কবিতা")) {
          reply = `জানলার কাচে বৃষ্টির দাগ,\nকিছু না-বলা কথা, কিছু পুরনো রাগ।\nসময়ের লেন্সে যখন চোখ রাখি,\nদেখি—তুমি ছাড়া বাকি সব দৃশ্যের ফাঁকি।`;
        } else if (lower.includes("shadow") || lower.includes("film")) {
          reply = `SHADOW / III (2026) is Zeehad Haque's psychological horror thriller exploring recurring nightmare loops and spatial dread. Watch it natively right now inside the Screening Hall!`;
        } else if (lower.includes("script") || lower.includes("screenplay") || lower.includes("স্ক্রিপ্ট")) {
          reply = `স্ক্রিপ্ট লেখার ১ নম্বর গোল্ডেন রুল: "Show, Don't Tell।" ক্যামেরা যা দেখবে আর মাইক যা শুনবে, শুধু তাই প্রেজেন্ট টেন্সে লিখুন।\n\nউদাহরণ:\nINT. CORRIDOR - NIGHT\nARIF (22) halts. Water drips from the ceiling. His phone screen pulses 03:03 AM.`;
        } else {
          reply = `আমি ZEE AI — শায়েরি, কবিতা, মানুষের না-বলা মনস্তত্ত্ব, গল্পের প্লট থেকে শুরু করে প্রোপার হলিউড স্ক্রিনপ্লে ফর্ম্যাট—যেকোনো বিষয় নিয়ে কথা বলতে পারো। বলো, কী নিয়ে কাজ করব?`;
        }

        const fallbackMsg: Message = {
          id: `z-${Date.now()}`,
          sender: "zee",
          text: reply,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };

        setMessages((prev) => [...prev, fallbackMsg]);
        setIsTyping(false);
      }, 350);
    }
  };

  return (
    <div className="zee-chat-modal-content">
      {/* Header */}
      <div className="zee-chat-header">
        <div className="zee-chat-header-meta">
          <div className="zee-ai-status-dot font-mono">
            <span className="live-indicator"></span>
            <span>INTELLIGENCE // ZEE AI DIRECTOR &amp; SCRIPT DOCTOR</span>
          </div>
          <h2 className="zee-chat-title">Creative Director &amp; Human Companion</h2>
        </div>
        <button
          type="button"
          className="glass-btn zee-close-btn"
          onClick={onClose}
          aria-label="Close ZEE AI"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
          <span>CLOSE</span>
        </button>
      </div>

      {/* Message Feed */}
      <div className="zee-chat-messages">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`zee-chat-bubble-row ${m.sender === "user" ? "is-user" : "is-zee"}`}
          >
            <div className="zee-chat-bubble">
              <div className="zee-bubble-meta font-mono">
                <span>{m.sender === "user" ? "YOU" : "ZEE AI"}</span>
                <span>{m.time}</span>
              </div>
              <p className="zee-bubble-text" style={{ whiteSpace: "pre-wrap", lineHeight: 1.78 }}>
                {m.text}
              </p>
              {m.sender === "zee" && (
                <button
                  type="button"
                  className="zee-ai-msg-copy-btn"
                  onClick={() => handleCopyText(m.id, m.text)}
                  style={{ marginTop: "8px" }}
                >
                  {copiedId === m.id ? "Copied ✓" : "Copy"}
                </button>
              )}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="zee-chat-bubble-row is-zee">
            <div className="zee-chat-bubble is-typing">
              <span className="typing-dots font-mono">ZEE is composing response...</span>
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Suggestion Prompts */}
      <div className="zee-chat-prompts">
        {ZEE_AI_STARTER_CHIPS.map((chip) => (
          <button
            key={chip.id}
            type="button"
            className="zee-prompt-chip font-mono"
            onClick={() => handleSend(chip.prompt)}
            disabled={isTyping}
          >
            {chip.label}
          </button>
        ))}
      </div>

      {/* Input Form */}
      <form
        className="zee-chat-form"
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
      >
        <input
          type="text"
          className="zee-chat-input"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          placeholder="Ask ZEE about poetry, storytelling, camera craft, or screenplays…"
          maxLength={1000}
        />
        <button
          type="submit"
          className="glass-btn zee-send-btn"
          disabled={isTyping || !inputVal.trim()}
        >
          <span>TRANSMIT ↗</span>
        </button>
      </form>
    </div>
  );
};
