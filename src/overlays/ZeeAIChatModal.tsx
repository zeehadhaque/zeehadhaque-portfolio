import React, { useState, useRef, useEffect } from "react";
import { SITE_CONFIG } from "../data/siteConfig";
import { videoArchive } from "../data/videoArchive";
import { siteIdentity } from "../data/site";

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
      text: "Yo 👋 ami ZEE — Zeehad-er website assistant. Ki jante chaccho? Film, story, cinematography, behind-the-scenes… ba emni golpo o kora jabe 😌",
      time: "NOW",
    },
  ]);
  const [inputVal, setInputVal] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const quickPrompts = [
    "Tell me about SHADOW / III",
    "What camera does Zeehad use?",
    "Explain the 30-Day Filmmaking Institute",
    "How to contact Zeehad for a project?",
  ];

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
        if (data.reply) {
          const aiMsg: Message = {
            id: `z-${Date.now()}`,
            sender: "zee",
            text: data.reply,
            time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          };
          setMessages((prev) => [...prev, aiMsg]);
          setIsTyping(false);
          return;
        }
      }
      throw new Error("Fallback required");
    } catch {
      // 2. Intelligent Local Auteur Knowledge Fallback
      setTimeout(() => {
        const lower = text.toLowerCase();
        let reply = "";

        if (lower.includes("shadow") || lower.includes("iii")) {
          const shadow = videoArchive.find((v) => v.videoId === "ZSttExMBavg");
          reply = `SHADOW / III (2026) is Zeehad's flagship psychological horror-thriller short film (runtime: ${shadow?.runtime || "7m 21s"}). The tagline is "3 Loops. 3 Illusions. 3 Confusions." It explores temporal loops and visual dread. You can screen it right here in the Screening Hall or on IMDb (tt36423405)!`;
        } else if (lower.includes("camera") || lower.includes("gear") || lower.includes("phone") || lower.includes("device")) {
          reply = `Zeehad's filmmaking philosophy is strictly mobile-first: He captures 4K cinema using Blackmagic Camera on a Redmi Note 14 Pro+ 5G. Post-production is handled in CapCut Pro and color graded in DaVinci Resolve Studio.`;
        } else if (lower.includes("institute") || lower.includes("academy") || lower.includes("30-day") || lower.includes("learn") || lower.includes("syllabus")) {
          reply = `The Zee Filmmaking Institute provides a full 30-day curriculum split into 4 core pillars: Visual Grammar, Mobile Cinematography, Dramatic Story & Blocking, and Post-Production Rhythm. You can switch between English and বাংলা, take daily quizzes, and earn XP towards Auteur rank!`;
        } else if (lower.includes("contact") || lower.includes("email") || lower.includes("whatsapp") || lower.includes("hire") || lower.includes("collaborate")) {
          reply = `You can reach Zeehad directly via email at ${siteIdentity.email} or through WhatsApp at ${siteIdentity.whatsapp}. Click the Contact button in the HUD or open Chamber 06 (Grand Exit) to transmit a message instantly!`;
        } else if (lower.includes("film") || lower.includes("movie") || lower.includes("reflect") || lower.includes("archive")) {
          reply = `Zeehad has 8 verified video works in the archive, including REFLECT Part 1 & Part 2, SHADOW / III, FLOW : THE MYST, AUTOPSY, Lost (YouTube Shorts), and DON'T GO THERE teaser. All can be watched natively in the Screening Hall.`;
        } else {
          reply = `Ami Zeehad-er creative universe, films, screenplays, and institute niye shob jani! You can ask about his upcoming film DON'T GO THERE, his 8 screenplays in the Writer's Room, or his mobile cinema workflow.`;
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
            <span>INTELLIGENCE // ZEE AI CORE TERMINAL</span>
          </div>
          <h2 className="zee-chat-title">Conversational Auteur Assistant</h2>
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
              <p className="zee-bubble-text">{m.text}</p>
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
        {quickPrompts.map((q) => (
          <button
            key={q}
            type="button"
            className="zee-prompt-chip font-mono"
            onClick={() => handleSend(q)}
            disabled={isTyping}
          >
            {q}
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
          placeholder="Ask ZEE about films, cinematography, scripts, or institute..."
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
