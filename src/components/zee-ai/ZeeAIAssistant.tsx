import { useEffect, useRef, useState, type FormEvent } from "react";
import { zeeWelcome } from "../../data/site";

interface ChatMessage { role: "user" | "assistant"; text: string }

const quickPrompts = ["Tell me about Zeehad", "Show me the films", "What is the academy?"];

export function ZeeAIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([{ role: "assistant", text: zeeWelcome }]);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, isSending]);

  const sendMessage = async (event?: FormEvent, preset?: string) => {
    event?.preventDefault();
    const text = (preset ?? input).trim();
    if (!text || isSending) return;
    setInput("");
    setMessages((current) => [...current, { role: "user", text }]);
    setIsSending(true);

    try {
      const response = await fetch("/api/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ message: text }) });
      const contentType = response.headers.get("content-type") ?? "";
      if (!contentType.includes("application/json")) throw new Error("ZEE is being prepared. You can still explore the site.");
      const result = (await response.json()) as { reply?: string; message?: string };
      if (!response.ok) throw new Error(result.message ?? "ZEE is taking a quiet moment.");
      setMessages((current) => [...current, { role: "assistant", text: result.reply ?? "I don't have that detail yet." }]);
    } catch (error) {
      setMessages((current) => [...current, { role: "assistant", text: error instanceof Error ? error.message : "ZEE is unavailable right now. You can still explore the archive." }]);
    } finally { setIsSending(false); }
  };

  return (
    <aside className={`zee-assistant ${isOpen ? "is-open" : ""}`} aria-label="ZEE website assistant">
      {isOpen && <div className="zee-assistant__panel">
        <div className="zee-assistant__header"><div><span className="section-kicker">Website assistant</span><h2>ZEE<span>.</span></h2></div><button type="button" onClick={() => setIsOpen(false)} aria-label="Close ZEE assistant">×</button></div>
        <div className="zee-assistant__messages" aria-live="polite">
          {messages.map((message, index) => <p key={`${message.role}-${index}`} className={`zee-message zee-message--${message.role}`}>{message.text}</p>)}
          {isSending && <p className="zee-message zee-message--assistant">ZEE is thinking…</p>}
          <div ref={endRef} />
        </div>
        {messages.length === 1 && <div className="zee-assistant__quick-prompts">{quickPrompts.map((prompt) => <button key={prompt} type="button" onClick={() => void sendMessage(undefined, prompt)}>{prompt}</button>)}</div>}
        <form className="zee-assistant__form" onSubmit={(event) => void sendMessage(event)}><input aria-label="Ask ZEE a question" value={input} onChange={(event) => setInput(event.target.value)} placeholder="Ask ZEE anything…" maxLength={1000} /><button type="submit" disabled={isSending || !input.trim()} aria-label="Send message">↗</button></form>
      </div>}
      <button className="zee-assistant__toggle" type="button" aria-expanded={isOpen} onClick={() => setIsOpen((open) => !open)}><span className="zee-assistant__dot" aria-hidden="true" /> <span>{isOpen ? "Close ZEE" : "Ask ZEE"}</span></button>
    </aside>
  );
}
