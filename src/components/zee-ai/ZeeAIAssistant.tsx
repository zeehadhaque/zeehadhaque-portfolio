import { useEffect, useRef, useState, type FormEvent } from "react";
import { ArrowUpRight, RotateCcw, X } from "lucide-react";
import { zeeWelcome } from "../../data/site";

interface ChatMessage {
  role: "user" | "assistant";
  text: string;
}

interface ZeeAIAssistantProps {
  externalOpenSignal?: number;
}

const quickPrompts = [
  "Tell me about Zeehad Haque",
  "Guide me through The Filmography",
  "How does The Academy work?",
  "Share a framing note",
];

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
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "assistant", text: zeeWelcome },
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
    setMessages((current) => [...current, { role: "user", text }]);
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
        { role: "assistant", text: result.reply ?? "I do not have that verified note yet." },
      ]);
    } catch (error) {
      setMessages((current) => [
        ...current,
        {
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

  const resetChat = () => {
    setMessages([{ role: "assistant", text: zeeWelcome }]);
    setInput("");
  };

  return (
    <aside
      className={`zee-intelligence-dock ${isOpen ? "is-open" : ""}`}
      aria-label="ZEE Intelligence interface"
    >
      {isOpen && (
        <div
          className="zee-intelligence__panel"
          role="dialog"
          aria-label="ZEE Intelligence"
        >
          <div className="zee-intelligence__header">
            <div className="zee-intelligence__identity">
              <IntelligenceCoreSvg active={isSending} />
              <div>
                <span className="identity-kicker">Embedded Intelligence</span>
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

          <div className="zee-intelligence__messages" aria-live="polite">
            {messages.map((message, index) => (
              <p
                key={`${message.role}-${index}`}
                className={`zee-msg zee-msg--${message.role}`}
              >
                {message.text}
              </p>
            ))}
            {isSending && (
              <div
                className="zee-msg zee-msg--assistant zee-msg--typing"
                aria-label="ZEE is composing a reply"
              >
                <span>Composing response through the archive…</span>
              </div>
            )}
            <div ref={endRef} />
          </div>

          {messages.length <= 2 && (
            <div className="zee-intelligence__prompts">
              {quickPrompts.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  disabled={isSending}
                  onClick={() => void sendMessage(undefined, prompt)}
                >
                  {prompt}
                </button>
              ))}
            </div>
          )}

          <form
            className="zee-intelligence__form"
            onSubmit={(event) => void sendMessage(event)}
          >
            <input
              ref={inputRef}
              aria-label="Ask ZEE AI a question"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Ask about films, camera craft, or Academy…"
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
