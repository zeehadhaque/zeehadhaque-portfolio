import { useEffect, useRef, useState, type FormEvent } from "react";
import { ArrowUpRight, RotateCcw, X, Copy, Check } from "lucide-react";
import {
  ZEE_AI_STARTER_CHIPS,
  ZEE_AI_WELCOME_MESSAGE,
} from "../../data/zeeAiPersona";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
}

interface ZeeAIAssistantProps {
  externalOpenSignal?: number;
}

function IntelligenceCoreSvg({ active }: { active: boolean }) {
  return (
    <svg
      viewBox="0 0 64 64"
      width="24"
      height="24"
      fill="none"
      aria-hidden="true"
      className={`zee-core-svg ${active ? "is-active" : ""}`}
    >
      <circle
        cx="32"
        cy="32"
        r="26"
        stroke="currentColor"
        strokeOpacity="0.32"
        strokeWidth="1.2"
        strokeDasharray="6 4"
        className="zee-core-ring-outer"
      />
      <circle
        cx="32"
        cy="32"
        r="17"
        stroke="currentColor"
        strokeOpacity="0.65"
        strokeWidth="1.4"
        className="zee-core-ring-mid"
      />
      <polygon
        points="32,19 43,32 32,45 21,32"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="rgba(125, 187, 255, 0.14)"
      />
      <circle cx="32" cy="32" r="3.5" fill="currentColor" />
    </svg>
  );
}

export function ZeeAIAssistant({ externalOpenSignal = 0 }: ZeeAIAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: "init", role: "assistant", text: ZEE_AI_WELCOME_MESSAGE },
  ]);
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (externalOpenSignal > 0) {
      setIsOpen(true);
    }
  }, [externalOpenSignal]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isSending]);

  useEffect(() => {
    if (!isOpen) return;
    inputRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isOpen]);

  const sendMessage = async (event?: FormEvent, preset?: string) => {
    event?.preventDefault();
    const text = (preset ?? input).trim();
    if (!text || isSending) return;
    setInput("");
    const userMsgId = `u-${Date.now()}`;
    setMessages((current) => [...current, { id: userMsgId, role: "user", text }]);
    setIsSending(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });
      const contentType = response.headers.get("content-type") ?? "";
      if (!contentType.includes("application/json")) {
        throw new Error("ZEE is initializing. You can continue exploring every destination.");
      }
      const result = (await response.json()) as { reply?: string; message?: string };
      if (!response.ok) {
        throw new Error(result.message ?? "ZEE is pausing briefly.");
      }
      setMessages((current) => [
        ...current,
        {
          id: `a-${Date.now()}`,
          role: "assistant",
          text: result.reply ?? "I do not have that verified note yet.",
        },
      ]);
    } catch (error) {
      setMessages((current) => [
        ...current,
        {
          id: `err-${Date.now()}`,
          role: "assistant",
          text:
            error instanceof Error
              ? error.message
              : "ZEE is offline right now. You can still browse every archive.",
        },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  const handleCopyText = async (id: string, textToCopy: string) => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      /* ignore */
    }
  };

  const resetChat = () => {
    setMessages([{ id: "init", role: "assistant", text: ZEE_AI_WELCOME_MESSAGE }]);
    setInput("");
  };

  return (
    <aside
      className={`zee-intelligence-dock ${isOpen ? "is-open" : ""}`}
      aria-label="ZEE Intelligence interface"
    >
      {isOpen && (
        <div
          className="zee-intelligence__panel zee-ai-console"
          role="dialog"
          aria-label="ZEE Intelligence"
        >
          {/* Header */}
          <div className="zee-intelligence__header">
            <div className="zee-intelligence__identity">
              <IntelligenceCoreSvg active={isSending} />
              <div>
                <span className="identity-kicker">Director &amp; Script Doctor Console</span>
                <h2>ZEE AI</h2>
              </div>
            </div>
            <div className="zee-intelligence__actions">
              <button
                type="button"
                onClick={resetChat}
                aria-label="Reset conversation"
                title="Reset conversation"
              >
                <RotateCcw size={15} />
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Close ZEE Intelligence"
              >
                <X size={17} />
              </button>
            </div>
          </div>

          {/* Neural Core Status Bar */}
          <div className="zee-ai-core-bar">
            <span className="zee-ai-status-tag">
              <span className="zee-ai-pulse-dot" />
              ZEE AI // DIRECTOR &amp; SCRIPT DOCTOR · ONLINE
            </span>
            <span style={{ fontSize: "10px", color: "rgba(214, 230, 252, 0.6)", fontFamily: "monospace" }}>
              24 FPS CINEMA NEURAL CORE
            </span>
          </div>

          {/* Messages Feed */}
          <div className="zee-intelligence__messages" aria-live="polite">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`zee-msg zee-msg--${message.role}`}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  whiteSpace: "pre-wrap",
                  lineHeight: 1.78,
                }}
              >
                <div>{message.text}</div>
                {message.role === "assistant" && (
                  <button
                    type="button"
                    className="zee-ai-msg-copy-btn"
                    onClick={() => handleCopyText(message.id, message.text)}
                    title="Copy text"
                  >
                    {copiedId === message.id ? (
                      <>
                        <Check size={11} style={{ marginRight: "4px" }} />
                        Copied ✓
                      </>
                    ) : (
                      <>
                        <Copy size={11} style={{ marginRight: "4px" }} />
                        Copy
                      </>
                    )}
                  </button>
                )}
              </div>
            ))}
            {isSending && (
              <div
                className="zee-msg zee-msg--assistant zee-msg--typing"
                aria-label="ZEE is composing a reply"
              >
                <span>Composing cinematic response through the archive…</span>
              </div>
            )}
            <div ref={endRef} />
          </div>

          {/* 6 One-Click Human Starter Chips */}
          <div className="zee-ai-chips" role="group" aria-label="Creative Prompts">
            {ZEE_AI_STARTER_CHIPS.map((chip) => (
              <button
                key={chip.id}
                type="button"
                className="zee-ai-chip"
                disabled={isSending}
                onClick={() => void sendMessage(undefined, chip.prompt)}
              >
                {chip.label}
              </button>
            ))}
          </div>

          {/* Input Form */}
          <form
            className="zee-intelligence__form"
            onSubmit={(event) => void sendMessage(event)}
          >
            <input
              ref={inputRef}
              aria-label="Ask ZEE AI a question"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Ask about poetry, storytelling, camera craft, or screenplays…"
              maxLength={1000}
            />
            <button
              type="submit"
              disabled={isSending || !input.trim()}
              aria-label="Send message"
            >
              <ArrowUpRight size={16} />
            </button>
          </form>
        </div>
      )}

      <button
        className="zee-intelligence__trigger"
        type="button"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((open) => !open)}
      >
        <IntelligenceCoreSvg active={isOpen} />
        <span>{isOpen ? "Close ZEE" : "ZEE Intelligence"}</span>
      </button>
    </aside>
  );
}
