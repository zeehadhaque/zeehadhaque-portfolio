import { useState } from "react";
import { Sparkles, Send, Bot, User, Terminal } from "lucide-react";
import { SITE_CONFIG } from "../../data/siteConfig";
import { videoArchive } from "../../data/videoArchive";

interface ChatMessage {
  id: string;
  sender: "zee" | "user";
  text: string;
  timestamp: string;
}

export function ZeeAICore() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "initial-welcome",
      sender: "zee",
      text: "Yo 👋 ami ZEE — Zeehad-er website assistant. Ki jante chaccho? Film, story, cinematography, behind-the-scenes… ba emni golpo o kora jabe 😌",
      timestamp: "NOW",
    },
  ]);
  const [inputVal, setInputVal] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const promptSuggestions = [
    "Tell me about SHADOW / III",
    "What camera does Zeehad use?",
    "Explain the 30-Day Filmmaking Institute",
    "How to contact Zeehad for a project?",
  ];

  const handleSend = (textToSend?: string) => {
    const text = (textToSend || inputVal).trim();
    if (!text) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputVal("");
    setIsTyping(true);

    setTimeout(() => {
      const lower = text.toLowerCase();
      let reply = "";

      if (lower.includes("shadow") || lower.includes("iii")) {
        const shadow = videoArchive.find((v) => v.videoId === "ZSttExMBavg");
        reply = `SHADOW / III (2026) is Zeehad's flagship psychological horror-thriller short film (runtime: 7m 21s). The tagline is "3 Loops. 3 Illusions. 3 Confusions." It explores temporal loops and visual dread. You can screen it right here in the Screening Hall or on IMDb!`;
      } else if (lower.includes("camera") || lower.includes("gear") || lower.includes("phone")) {
        reply = `Zeehad's filmmaking philosophy is strictly mobile-first: He captures 4K cinema using Blackmagic Camera on a Redmi Note 14 Pro+ 5G. Post-production is handled in CapCut Pro and color graded in DaVinci Resolve Studio.`;
      } else if (lower.includes("institute") || lower.includes("academy") || lower.includes("30-day") || lower.includes("program")) {
        reply = `The Zee Filmmaking Institute provides a full 30-day curriculum split into 4 core pillars: Visual Grammar, Mobile Cinematography, Dramatic Story & Blocking, and Post-Production Rhythm. You can switch between English and বাংলা, take daily quizzes, and earn XP towards Auteur rank!`;
      } else if (lower.includes("contact") || lower.includes("email") || lower.includes("whatsapp") || lower.includes("hire") || lower.includes("collaborate")) {
        reply = `You can reach Zeehad directly via email at ${SITE_CONFIG.email} or through WhatsApp at ${SITE_CONFIG.whatsappNumber}. Jump to Chamber 06 (Grand Exit) to transmit a message instantly!`;
      } else if (lower.includes("reflect") || lower.includes("films")) {
        reply = `Zeehad has 8 verified video works in the archive, including REFLECT Part 1 & Part 2, SHADOW / III, FLOW : THE MYST, AUTOPSY, Lost (YouTube Shorts), and DON'T GO THERE teaser. All can be watched natively in the Screening Hall.`;
      } else {
        reply = `Ami Zeehad-er creative universe, films, screenplays, and institute niye shob jani! You can ask about his upcoming film DON'T GO THERE, his 8 screenplays in the Writer's Room, or his mobile cinema workflow.`;
      }

      const zeeMsg: ChatMessage = {
        id: `zee-${Date.now()}`,
        sender: "zee",
        text: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, zeeMsg]);
      setIsTyping(false);
    }, 450);
  };

  return (
    <section id="zee-core" className="castle-section zee-ai-section">
      <div className="section-header-block">
        <div className="section-pill ai-pill">
          <Sparkles size={13} />
          <span>INTELLIGENCE // ZEE AI CORE TERMINAL</span>
        </div>
        <h2 className="section-title">ZEE — Conversational Auteur AI</h2>
        <p className="section-subtitle">
          An interactive conversational interface grounded strictly in Zeehad Haque&apos;s verified
          directing methods, filmography, scripts, and syllabus.
        </p>
      </div>

      <div className="zee-terminal-container">
        <div className="zee-terminal-card">
          {/* Terminal Title Bar */}
          <div className="terminal-header">
            <div className="terminal-traffic-lights">
              <span className="light red" />
              <span className="light yellow" />
              <span className="light green" />
            </div>
            <div className="terminal-title font-mono">
              <Terminal size={13} />
              <span>ZEE_AUTEUR_INTELLIGENCE // RUNTIME_ACTIVE</span>
            </div>
            <div className="terminal-status font-mono">ONLINE</div>
          </div>

          {/* Quick Suggestions */}
          <div className="terminal-suggestions-bar">
            {promptSuggestions.map((s) => (
              <button
                type="button"
                key={s}
                onClick={() => handleSend(s)}
                className="suggestion-pill font-mono"
              >
                {s}
              </button>
            ))}
          </div>

          {/* Message Stream */}
          <div className="terminal-messages-flow">
            {messages.map((m) => (
              <div key={m.id} className={`chat-bubble-row ${m.sender}`}>
                <div className="avatar-disc">
                  {m.sender === "zee" ? <Bot size={14} /> : <User size={14} />}
                </div>
                <div className="message-content-box">
                  <div className="message-header-row font-mono">
                    <span className="sender-name">{m.sender === "zee" ? "ZEE AI" : "VISITOR"}</span>
                    <span className="timestamp">{m.timestamp}</span>
                  </div>
                  <p className="message-text">{m.text}</p>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="chat-bubble-row zee typing">
                <div className="avatar-disc">
                  <Bot size={14} />
                </div>
                <div className="typing-dots font-mono">
                  <span>ZEE is formulating response...</span>
                </div>
              </div>
            )}
          </div>

          {/* Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="terminal-input-form"
          >
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="Ask ZEE about films, mobile cinematography, writing, or institute..."
              className="terminal-input"
            />
            <button
              type="submit"
              disabled={!inputVal.trim()}
              className="terminal-send-btn"
              aria-label="Send message to ZEE AI"
            >
              <Send size={15} />
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
