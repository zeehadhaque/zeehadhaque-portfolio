import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { Language } from '../types';

interface LanguageSwitcherProps {
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
}

const LANGUAGES: { code: Language; name: string; nativeName: string; short: string }[] = [
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', short: 'বাং' },
  { code: 'en', name: 'English', nativeName: 'English', short: 'EN' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', short: 'हि' },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو', short: 'اردو' },
];

export function LanguageSwitcher({ currentLang, onLanguageChange }: LanguageSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const current = LANGUAGES.find((l) => l.code === currentLang) || LANGUAGES[1];

  return (
    <div className="relative" ref={containerRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 text-xs tracking-wider text-[#F2F0EB]/50 hover:text-cyan-400 transition-colors uppercase font-mono-film"
        aria-label="Select Language"
      >
        <span>{current.short}</span>
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-3 w-40 border border-white/10 bg-[#020305]/95 backdrop-blur-xl shadow-2xl py-2 z-50 rounded-sm"
          >
            {LANGUAGES.map((lang) => {
              const isSelected = lang.code === currentLang;
              return (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => {
                    onLanguageChange(lang.code);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-4 py-2 text-left text-xs transition-colors uppercase tracking-widest ${
                    isSelected
                      ? 'text-white bg-white/5'
                      : 'text-[#F2F0EB]/50 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span className="font-cinematic">{lang.nativeName}</span>
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
