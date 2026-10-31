import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Menu, X, Search, User, Compass } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../data/translations';
import { LanguageSwitcher } from './LanguageSwitcher';
import { soundEngine } from '../utils/audio';
import { triggerFilmTransition } from './CinematicShutterTransition';

interface NavbarProps {
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
  onOpenAssistant: () => void;
  onOpenSearch: () => void;
  audioActive: boolean;
  onToggleAudio: () => void;
  directorsCut: boolean;
  onToggleDirectorsCut: () => void;
}

export function Navbar({
  currentLang,
  onLanguageChange,
  onOpenAssistant,
  onOpenSearch,
}: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const t = translations[currentLang];

  useEffect(() => {
    let lastScrolled = false;
    const handleScroll = () => {
      const scrolled = window.scrollY > 50;
      if (scrolled !== lastScrolled) {
        lastScrolled = scrolled;
        setIsScrolled(scrolled);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: t.nav.approach, href: '#approach' },
    { label: t.nav.work, href: '#work' },
    { label: t.nav.arcade || 'GAMES', href: '#arcade' },
    { label: t.nav.academy || 'ACADEMY', href: '#academy' },
    { label: t.nav.about, href: '#about' },
  ];

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed inset-x-0 z-50 transition-all duration-500 font-mono-film flex justify-center ${
          isScrolled ? 'top-6 pointer-events-none' : 'top-0 pointer-events-auto bg-gradient-to-b from-[#020305]/90 to-transparent py-6'
        }`}
      >
        <div
          className={`flex items-center justify-between pointer-events-auto transition-all duration-700 ease-out ${
            isScrolled
              ? 'w-[90%] md:w-auto px-6 py-3 rounded-full bg-[#050810]/60 backdrop-blur-2xl border border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),inset_0_-1px_1px_rgba(255,255,255,0.02),0_8px_32px_rgba(0,0,0,0.6)]'
              : 'w-full max-w-7xl mx-auto px-6 lg:px-12 py-2'
          }`}
        >
          {/* Brand Signature / Logo */}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              soundEngine.playClick();
              triggerFilmTransition('#top', undefined, 'HERO');
            }}
            className="flex items-center gap-3 group mr-6 md:mr-10"
          >
            {isScrolled && (
              <Compass className="w-4 h-4 text-cyan-400 group-hover:rotate-45 transition-transform duration-500" />
            )}
            <span
              className={`font-cinematic font-medium uppercase tracking-[0.3em] transition-all duration-500 ${
                isScrolled ? 'text-xs text-white' : 'text-lg md:text-xl text-[#F2F0EB]/90 group-hover:text-white'
              }`}
            >
              ZEEHAD HAQUE
            </span>
          </a>

          {/* Desktop Navigation Chapters */}
          <nav className="hidden lg:flex items-center gap-6 mr-8">
             <AnimatePresence>
                {navLinks.map((link) => (
                  <motion.a
                    key={link.href}
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault();
                      soundEngine.playClick();
                      triggerFilmTransition(link.href, undefined, link.label);
                    }}
                    className={`relative uppercase tracking-[0.2em] group transition-colors duration-300 ${
                      isScrolled ? 'text-[9px] text-[#F2F0EB]/60 hover:text-white' : 'text-[11px] text-[#F2F0EB]/50 hover:text-cyan-400'
                    }`}
                  >
                    {link.label}
                    {/* Spatial glow under active/hover links on scrolled state */}
                    {isScrolled && (
                        <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-0 h-[1px] bg-cyan-400/0 group-hover:w-full group-hover:bg-cyan-400 group-hover:shadow-[0_0_8px_#00f0ff] transition-all duration-300" />
                    )}
                  </motion.a>
                ))}
             </AnimatePresence>
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center gap-4">
            {/* Quick Archive Search Drawer Trigger Button */}
            <button
              type="button"
              onClick={() => {
                soundEngine.playClick();
                onOpenSearch();
              }}
              className={`transition-colors duration-300 flex items-center justify-center rounded-full p-2 ${
                  isScrolled ? 'text-[#F2F0EB]/60 hover:text-white hover:bg-white/5' : 'text-[#F2F0EB]/50 hover:text-cyan-400'
              }`}
              aria-label="Search"
            >
              <Search className="w-[14px] h-[14px]" />
            </button>

            {/* Language Switcher */}
            <div className={isScrolled ? "scale-90 opacity-80" : ""}>
               <LanguageSwitcher currentLang={currentLang} onLanguageChange={onLanguageChange} />
            </div>

            {/* ZEE AI Companion Button */}
            <button
              type="button"
              onClick={onOpenAssistant}
              className={`transition-colors duration-300 flex items-center justify-center rounded-full p-2 ${
                  isScrolled ? 'text-cyan-400 hover:text-white hover:bg-cyan-500/20 shadow-[0_0_15px_rgba(0,240,255,0.1)]' : 'text-[#F2F0EB]/50 hover:text-cyan-400'
              }`}
            >
              <Sparkles className="w-[14px] h-[14px]" />
            </button>

             {/* Account / Admin placeholder */}
            <a
               href="/admin"
               className={`transition-colors duration-300 flex items-center justify-center rounded-full p-2 ${
                  isScrolled ? 'text-[#F2F0EB]/60 hover:text-white hover:bg-white/5' : 'text-[#F2F0EB]/50 hover:text-cyan-400'
              }`}
            >
              <User className="w-[14px] h-[14px]" />
            </a>

            {/* Mobile Menu Hamburger */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`lg:hidden transition-colors flex items-center justify-center p-2 rounded-full ${
                  isScrolled ? 'text-white hover:bg-white/10' : 'text-[#F2F0EB]/70'
              }`}
              aria-label="Toggle Mobile Menu"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Navigation Drawer (Spatial Glass Panel) */}
      <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
               initial={{ opacity: 0, y: -20, scale: 0.95 }}
               animate={{ opacity: 1, y: 0, scale: 1 }}
               exit={{ opacity: 0, scale: 0.95 }}
               transition={{ duration: 0.3, ease: 'easeOut' }}
               className="fixed top-24 inset-x-4 lg:hidden z-40 bg-[#050810]/70 backdrop-blur-3xl border border-white/10 rounded-3xl p-6 shadow-[0_20px_40px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.05)] overflow-hidden"
            >
              {/* Internal Glass Highlight */}
              <div className="absolute top-0 inset-x-0 h-[100px] bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />

              <div className="flex flex-col space-y-2 relative z-10 font-mono-film">
                {navLinks.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      onClick={(e) => {
                        e.preventDefault();
                        soundEngine.playClick();
                        setMobileMenuOpen(false);
                        triggerFilmTransition(link.href, undefined, link.label);
                      }}
                      className="block text-xs tracking-[0.2em] uppercase text-[#F2F0EB]/70 hover:text-white hover:bg-white/5 p-4 rounded-xl transition-all"
                    >
                      {link.label}
                    </a>
                ))}
              </div>
            </motion.div>
          )}
      </AnimatePresence>
    </>
  );
}
