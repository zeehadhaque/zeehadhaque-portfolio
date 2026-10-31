import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles, Send, Bot, User, CornerDownLeft, Loader2 } from 'lucide-react';
import { Language, ChatMessage } from '../types';
import { translations } from '../data/translations';
import { soundEngine } from '../utils/audio';

interface ZeeAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  currentLang: Language;
}

export function ZeeAssistant({ isOpen, onClose, currentLang }: ZeeAssistantProps) {
  const t = translations[currentLang];
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: t.assistant.fallbackGreeting,
      timestamp: 'Now',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showKeyboardTip, setShowKeyboardTip] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Focus input & reset tip on open
  useEffect(() => {
    if (isOpen) {
      setShowKeyboardTip(true);
    }
  }, [isOpen]);

  // Escape key listener to close drawer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Update greeting if language changes
  useEffect(() => {
    setMessages((prev) => {
      if (prev.length === 1 && prev[0].id === 'welcome') {
        return [
          {
            id: 'welcome',
            sender: 'assistant',
            text: t.assistant.fallbackGreeting,
            timestamp: 'Now',
          },
        ];
      }
      return prev;
    });
  }, [currentLang, t.assistant.fallbackGreeting]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSend = async (userText?: string) => {
    const query = (userText || input).trim();
    if (!query || isLoading) return;

    soundEngine.playClick();
    const userMsg: ChatMessage = {
      id: String(Date.now()),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          language: currentLang,
          history: messages.slice(-6).map((m) => ({
            role: m.sender === 'user' ? 'user' : 'model',
            text: m.text,
          })),
        }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      const botMsg: ChatMessage = {
        id: String(Date.now() + 1),
        sender: 'assistant',
        text: data.reply || t.assistant.fallbackGreeting,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch {
      // Intelligent Context-Aware Carbon-Copy Zeehad Fallback
      const qLower = query.toLowerCase();
      let fallbackReply = '';

      if (currentLang === 'bn') {
        if (qLower.includes('course') || qLower.includes('codex') || qLower.includes('academy') || qLower.includes('buy') || qLower.includes('কোর্স') || qLower.includes('কিনব') || qLower.includes('একাডেমি')) {
          fallbackReply = `আরে বস! 'Filmmaking Master Codex' কোর্সগুলো হলো ডিরেকশন ও সিনেমাটোগ্রাফির একদম মাস্টারক্লাস। 🎬\n\nজীবনানন্দ দাশের ভাষায় যেমন—\n"হাজার বছর ধরে আমি পথ হাঁটিতেছি... তেমনই নিখুঁত একটি ফ্রেমের খোঁজে জীবনের অনেকটা সময় কেটে যায়।"\n\nআপনি যদি আপনার স্টোরিটেলিং আর কালার গ্রেডিং নেক্সট লেভেলে নিয়ে যেতে চান, তবে একাডেমি সেকশন থেকে যেকোনো কোর্স বেছে নিন। পেমেন্ট বা এনরোলমেন্ট নিয়ে কোনো ঝামেলায় পড়লে সরাসরি জিহাদ ভাইয়ের সাথে যোগাযোগ করুন: zeehadhaque@gmail.com। কথা দিলাম, পস্তাবেন না! 🔥`;
        } else if (qLower.includes('tip') || qLower.includes('camera') || qLower.includes('redmi') || qLower.includes('davinci') || qLower.includes('shoot') || qLower.includes('শুট') || qLower.includes('ক্যামেরা')) {
          fallbackReply = `চলুন কিছু খাঁটি ডিরেক্টরি টিপস শেয়ার করি! 🎥\n\n১. লাইটিং: নাটুকে ও ছায়াঘেরা মুড আনতে সবসময় সাইড লাইট বা উইন্ডো লাইট ব্যবহার করুন।\n২. ক্যামেরা গিয়ার: জিহাদ ভাই যেমন রেডমি নোট ১৪ প্রো+ ৫জি দিয়ে পকেট-ফ্রেন্ডলি অথচ সিনেমাটিক শ্যুট করেন, তেমনি আপনার হাতের ফোনটাকেই হাতিয়ার বানান।\n৩. কালার গ্রেডিং: ডাভিঞ্চি রিজলভ (DaVinci Resolve)-এ গিয়ে কন্ট্রাস্ট একটু বাড়িয়ে স্যাচুরেশন কমিয়ে একটা মুডি অ্যানালগ লুক দিন।\n\n"রাতের আকাশে যেমন তারার মেলা, তেমনি লেন্সের ফোকাসে জীবনের অবয়ব।" — মাস্তি করতে করতে সিনেমা বানান! 🚀`;
        } else if (qLower.includes('poetry') || qLower.includes('kobita') || qLower.includes('কবি') || qLower.includes('কবিতা') || qLower.includes('life') || qLower.includes('জীবন')) {
          fallbackReply = `"পৃথিবীর গভীর গভীরতর অন্ধকার থেকে উঠে এসে\nআমরা একফালি আলো আর লেন্সের খোঁজে ঘুরি..." 🌌\n\nভাই, সিনেমা মানেই তো ভিজ্যুয়াল কবিতা! যখন ফ্রেম কথা বলে না, তখন সিলেন্স আর লাইট মিলে কবিতা হয়ে ওঠে। আপনার মনের গহীনে কোন গল্পটা জমা হয়ে আছে বলুন তো?`;
        } else {
          fallbackReply = `আরে দোস্ত! কী অবস্থা? 🎬 আমি হচ্ছি জিহাদ হকের ডিজিটাল কার্বন কপি—আপনার পকেট ডিরেক্টর আর সিনেমাটিক দোস্ত!\n\n"হৃদয়ের অন্ধকার কুঠুরিতে যখন আলো মেশে, তখনই জন্ম নেয় আসল সিনেমা।" \n\nবলুন, আজ কোন প্রজেক্ট নিয়ে আড্ডা হবে? মোবাইল সিনেমাটোগ্রাফি টিপস লাগবে, নাকি আমাদের 'Filmmaking Master Codex' থেকে কোনো কোর্স কিনতে সাহায্য করব? জিহাদ ভাই যেমন রেডমি নোট ১৪ প্রো+ ৫জি দিয়ে এক্কেবারে আগুন ভিজ্যুয়াল নামিয়ে দেন আর ডাভিঞ্চি রিজলভে কালার গ্রেড করেন! কী বলবেন, কোন দিকে যাব আজ? 🎥✨`;
        }
      } else {
        if (qLower.includes('course') || qLower.includes('codex') || qLower.includes('academy') || qLower.includes('buy')) {
          fallbackReply = `My friend! The 'Filmmaking Master Codex' courses are your ticket to directorial nirvana. 🎬\n\nAs the darkroom whisper goes:\n"In the silence of 24 frames, a thousand lifetimes unfold."\n\nHead over to the Filmmaking Codex section to grab your course. If you need any manual payment assistance or direct enrollment help, hit up Zeehad at zeehadhaque@gmail.com. Let's make your cinematic dreams a reality! 🔥`;
        } else if (qLower.includes('tip') || qLower.includes('camera') || qLower.includes('redmi') || qLower.includes('davinci') || qLower.includes('shoot')) {
          fallbackReply = `Here are some raw director's notes for you! 🎥\n\n1. Lighting: Embrace shadow and side-lighting. Moody contrast is pure emotion.\n2. Mobile First: Just like Zeehad shoots on the Redmi Note 14 Pro+ 5G, remember that the best camera is the one in your hand.\n3. Grading: Take it into DaVinci Resolve, crush the blacks slightly, and let the cinematic halation breathe.\n\n"In the deep theater of night, every shadow tells a story." Keep creating with passion! 🚀`;
        } else if (qLower.includes('poetry') || qLower.includes('poem') || qLower.includes('life')) {
          fallbackReply = `"Out of the deep, quiet darkrooms of the soul,\nWe emerge clutching light, shadow, and 24fps..." 🌌\n\nCinema is just poetry written with photons, my friend. What story are we framing today?`;
        } else {
          fallbackReply = `Hey there, cinema wanderer! 🎬 I am Zee AI—Zeehad Haque's digital carbon copy, your partner in crime, creative sparring partner, and pocket director.\n\n"In the stillness of 24fps, the soul finds its true framing."\n\nWhether you need raw mobile filmmaking tips (Redmi Note 14 Pro+ 5G wizardry!), DaVinci Resolve color grading secrets, or want to grab a course from the Filmmaking Master Codex, I'm right here. What's on your mind today? Let's make some cinematic magic happen! ✨`;
        }
      }

      setMessages((prev) => [
        ...prev,
        {
          id: String(Date.now() + 1),
          sender: 'assistant',
          text: fallbackReply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-end p-2 sm:p-4 bg-black/60 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 100 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="w-full max-w-lg h-[92vh] sm:h-[88vh] rounded-2xl border border-neutral-800 bg-[#070b16] shadow-[0_20px_60px_rgba(0,0,0,0.95)] flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-neutral-800 bg-[#040813] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-cyan-500/20 border border-cyan-400/50 flex items-center justify-center text-cyan-300">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-cinematic text-base font-bold text-white tracking-wider flex items-center gap-2">
                  <span>{t.assistant.title}</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                </h3>
                <p className="text-[10px] font-mono-film text-cyan-400/80 tracking-wider">
                  {t.assistant.subtitle}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono-film text-cyan-400/80 bg-neutral-900/90 border border-neutral-800 px-2 py-0.5 rounded hidden sm:inline" title="Press Escape key to close">
                ESC TO CLOSE
              </span>
              <button
                type="button"
                onClick={() => {
                  soundEngine.playClick();
                  onClose();
                }}
                className="p-2 rounded-full border border-neutral-800 bg-neutral-900 text-neutral-400 hover:text-white transition-colors"
                aria-label="Close Assistant"
                title="Press Escape key to close (Esc)"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Keyboard Tip Toast */}
          <AnimatePresence>
            {showKeyboardTip && (
              <motion.div
                initial={{ opacity: 0, height: 0, y: -6 }}
                animate={{ opacity: 1, height: 'auto', y: 0 }}
                exit={{ opacity: 0, height: 0, y: -6 }}
                className="px-4 py-2 bg-cyan-950/60 border-b border-cyan-500/30 flex items-center justify-between text-[11px] font-mono-film text-cyan-200"
              >
                <div className="flex items-center gap-2">
                  <span className="px-1.5 py-0.5 rounded bg-neutral-950 border border-cyan-400/60 text-cyan-300 font-bold text-[10px] tracking-wider shadow-sm">
                    ESC
                  </span>
                  <span>KEYBOARD TIP: Press Escape at any time to close this assistant drawer.</span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowKeyboardTip(false)}
                  className="text-neutral-400 hover:text-white text-[10px] uppercase font-mono-film tracking-wider px-1.5 py-0.5 rounded hover:bg-neutral-800 transition-colors ml-2 shrink-0"
                >
                  DISMISS
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 font-mono-film text-xs">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-3 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.sender === 'assistant' && (
                  <div className="w-7 h-7 rounded-full bg-cyan-950 border border-cyan-500/40 flex-shrink-0 flex items-center justify-center text-cyan-400">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                )}
                <div
                  className={`max-w-[82%] p-3.5 rounded-2xl leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-cyan-600 text-white rounded-br-none shadow-[0_4px_15px_rgba(0,240,255,0.2)]'
                      : 'bg-neutral-900/90 text-neutral-200 border border-neutral-800 rounded-bl-none'
                  }`}
                >
                  <p className="whitespace-pre-line text-xs sm:text-[13px]">{m.text}</p>
                  <span className="block text-[9px] text-neutral-400 text-right mt-1.5 opacity-60">
                    {m.timestamp}
                  </span>
                </div>
                {m.sender === 'user' && (
                  <div className="w-7 h-7 rounded-full bg-neutral-800 border border-neutral-700 flex-shrink-0 flex items-center justify-center text-neutral-300">
                    <User className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center gap-2 text-cyan-400 text-xs">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>ZEE IS COMPOSING THOUGHTS...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestions Chips */}
          <div className="p-3 border-t border-neutral-800/80 bg-[#050914]/90 flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-[10px] font-mono-film text-neutral-400">
              <span className="flex items-center gap-1.5 uppercase font-semibold text-cyan-400">
                <Sparkles className="w-3 h-3 text-cyan-400" />
                {t.assistant.suggestedTitle}
              </span>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-cyan-950/60 border border-cyan-800/50 text-cyan-300 font-mono-film">
                {t.assistant.suggestions.length} PROMPTS • CLICK TO ASK
              </span>
            </div>

            {/* Scrollable Chips Area */}
            <div className="max-h-32 overflow-y-auto pr-1 flex flex-wrap gap-1.5 scrollbar-thin scrollbar-thumb-neutral-800">
              {t.assistant.suggestions.map((s, idx) => (
                <button
                  key={idx}
                  type="button"
                  onMouseEnter={() => soundEngine.playHover()}
                  onClick={() => handleSend(s)}
                  className="group px-2.5 py-1.5 rounded-lg bg-neutral-900/90 hover:bg-cyan-950/80 border border-neutral-800 hover:border-cyan-400/60 text-[10px] sm:text-[11px] font-mono-film text-neutral-300 hover:text-cyan-200 transition-all text-left flex items-center gap-1.5 shadow-sm active:scale-95"
                  title="Click to ask this cinematic question immediately"
                >
                  <span className="text-cyan-400 font-bold text-[9px] px-1 py-0.2 rounded bg-cyan-950 border border-cyan-800/60">
                    {idx < 9 ? `0${idx + 1}` : idx + 1}
                  </span>
                  <span className="truncate max-w-[260px] sm:max-w-[360px]">{s}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 sm:p-4 border-t border-neutral-800 bg-[#040712] flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t.assistant.placeholder}
              className="flex-1 bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-400 transition-colors"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="p-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 disabled:hover:bg-cyan-500 text-neutral-950 font-bold transition-all shadow-[0_0_15px_rgba(0,240,255,0.3)]"
              aria-label={t.assistant.send}
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

          {/* Disclaimer Footer */}
          <div className="px-4 py-2 bg-black/80 text-center text-[9px] font-mono-film text-neutral-400 border-t border-neutral-900">
            {t.assistant.disclaimer}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
