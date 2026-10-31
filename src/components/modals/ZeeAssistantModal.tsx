import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Send, Sparkles, Terminal, MessageSquare, HelpCircle, Film, Camera, Sliders, Layers } from 'lucide-react';
import { useUniverseStore } from '../../store/universeStore';
import { soundEngine } from '../../utils/audio';

interface Message {
  id: string;
  sender: 'zee' | 'user';
  text: string;
  time: string;
}

export const ZeeAssistantModal: React.FC = () => {
  const zeeOpen = useUniverseStore((s) => s.zeeOpen);
  const setZeeOpen = useUniverseStore((s) => s.setZeeOpen);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome-1',
      sender: 'zee',
      text: 'Yo 👋 ami ZEE — Zeehad-er website assistant. Ki jante chaccho? Film, story, cinematography, behind-the-scenes… ba emni golpo o kora jabe 😌',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (zeeOpen) {
      document.body.classList.add('modal-open');
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    } else {
      document.body.classList.remove('modal-open');
    }
    return () => document.body.classList.remove('modal-open');
  }, [zeeOpen, messages]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && zeeOpen) {
        setZeeOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [zeeOpen, setZeeOpen]);

  if (!zeeOpen) return null;

  const handleClose = () => {
    soundEngine.playClick();
    setZeeOpen(false);
  };

  const sendMessage = async (textToSend?: string) => {
    const query = textToSend || input.trim();
    if (!query || loading) return;

    soundEngine.playShutter();
    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: query, language: 'bn' }),
      });

      if (response.ok) {
        const data = await response.json();
        const replyText =
          data.reply ||
          'Ami ZEE — Zeehad-er visual filmmaking universe niye bolte pari! Tumi ki camera, lighting ba film archive niye jante chao?';
        setMessages((prev) => [
          ...prev,
          {
            id: `zee-${Date.now()}`,
            sender: 'zee',
            text: replyText,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
        soundEngine.playClick();
      } else {
        throw new Error('API offline');
      }
    } catch {
      // Offline smart knowledge fallback
      let fallbackText =
        'ZEE Assistant (Local Mode): Zeehad Haque holo Gazipur, Dhaka-r ekjon independent filmmaker, writer, cinematographer o editor. Tini "light, silence and movement" diye psychological thriller o mystery banan.';
      const lower = query.toLowerCase();

      if (lower.includes('camera') || lower.includes('lens') || lower.includes('লেন্স')) {
        fallbackText =
          'Zeehad bhai mobile-first auteur cinema banan Redmi Note 14 Pro+ 5G diye! Tini 24 FPS (1/48s shutter angle), manual exposure lock ebong 2.39:1 Anamorphic ratio-te DaVinci Resolve-e color grade koren.';
      } else if (lower.includes('film') || lower.includes('movie') || lower.includes('শর্ট ফিল্ম')) {
        fallbackText =
          'Zeehad-er authentic 6-ti short films holo: Reflect 1, Reflect 2, Shadow / III, Ghurpak (Flow), Autopsy (Anusandhan), ebong Illusion! Shobgulo YouTube Archive theke ekhanei play kora jabe.';
      } else if (lower.includes('light') || lower.includes('আলো')) {
        fallbackText =
          'Light Lab-e 3-point lighting exercise ache: Key, Fill, ebong Cyan Rim light. Zeehad single motivated light source ebong deep shadow contrast pochondo koren.';
      } else if (lower.includes('story') || lower.includes('গল্প') || lower.includes('script')) {
        fallbackText =
          'Story Lab-e Hook, Setup, Conflict, Escalation, Climax ebong Resolution structure banano jay. Dialogue-er cheye visual subtext beshi guruttopurno!';
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `zee-${Date.now()}`,
          sender: 'zee',
          text: fallbackText,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const suggestedPrompts = [
    { label: 'ASK ABOUT CAMERA', prompt: 'Redmi Note 14 Pro+ দিয়ে সিনেমাটোগ্রাফি করার কৌশল কী?', icon: Camera },
    { label: 'ASK ABOUT FILMS', prompt: 'Zeehad-er 6-ti authentic short film niye bolo', icon: Film },
    { label: 'ASK ABOUT STORY', prompt: 'Dialogue chara psychological suspense kibhabe toiri kora jay?', icon: Layers },
    { label: 'ASK ABOUT COLOR', prompt: 'Cold Nocturne & Blue Shadows color grading kibhabe kaj kore?', icon: Sliders },
  ];

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#020305]/85 backdrop-blur-xl animate-in fade-in duration-200"
        onClick={handleClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-2xl h-[85vh] max-h-[720px] bg-[#06090E] border border-[#102B45] rounded-xl shadow-2xl flex flex-col text-[#F2F0EB] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between px-5 py-3.5 bg-[#04070D] border-b border-[#102B45]">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#102B45] border border-[#2C6EA6] flex items-center justify-center shadow-[0_0_12px_rgba(125,187,255,0.3)]">
                <Terminal className="w-4 h-4 text-[#7DBBFF]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-headline font-bold text-sm text-[#F2F0EB]">ZEE // AI CORE</h3>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#7DBBFF] animate-pulse" />
                </div>
                <p className="font-mono text-[10px] text-[#7DBBFF] tracking-wider">
                  DIRECTORIAL ASSISTANT (NOT ZEEHAD)
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-1.5 rounded-lg border border-[#102B45] text-[#8A96A3] hover:text-[#F2F0EB] hover:bg-[#102B45] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Suggested Prompts Bar */}
          <div className="flex items-center gap-2 px-4 py-2 border-b border-[#102B45] bg-[#020305] overflow-x-auto">
            {suggestedPrompts.map((item, i) => {
              const Icon = item.icon;
              return (
                <button
                  key={i}
                  onClick={() => sendMessage(item.prompt)}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#081522] hover:bg-[#102B45] border border-[#102B45] text-[10px] font-mono text-[#7DBBFF] hover:text-[#A9D4FF] whitespace-nowrap transition-colors"
                >
                  <Icon className="w-3 h-3" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Chat Messages Stream */}
          <div className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-4">
            {messages.map((m) => {
              const isZee = m.sender === 'zee';
              return (
                <div
                  key={m.id}
                  className={`flex flex-col ${isZee ? 'items-start' : 'items-end'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-lg p-3.5 text-xs sm:text-sm leading-relaxed ${
                      isZee
                        ? 'bg-[#081522] border border-[#102B45] text-[#F2F0EB]'
                        : 'bg-[#2C6EA6]/30 border border-[#7DBBFF]/40 text-[#F2F0EB]'
                    }`}
                  >
                    <div className="font-mono text-[9px] text-[#7DBBFF] tracking-widest uppercase mb-1">
                      {isZee ? 'ZEE // ASSISTANT' : 'YOU'}
                    </div>
                    <div className="whitespace-pre-wrap">{m.text}</div>
                    <div className="font-mono text-[8px] text-[#8A96A3] mt-1 text-right">
                      {m.time}
                    </div>
                  </div>
                </div>
              );
            })}

            {loading && (
              <div className="flex items-center gap-2 text-[#7DBBFF] font-mono text-xs p-2">
                <span className="w-2 h-2 rounded-full bg-[#7DBBFF] animate-ping" />
                <span>ZEE IS THINKING...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage();
            }}
            className="p-3 bg-[#04070D] border-t border-[#102B45] flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask ZEE in Bangla, Banglish, or English..."
              className="flex-1 bg-[#020305] border border-[#102B45] focus:border-[#7DBBFF] rounded-lg px-3.5 py-2 text-xs font-mono text-[#F2F0EB] placeholder:text-[#8A96A3] outline-none transition-colors"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="p-2.5 rounded-lg bg-[#7DBBFF] hover:bg-[#A9D4FF] disabled:opacity-40 text-[#020305] font-bold transition-all shadow-md"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
