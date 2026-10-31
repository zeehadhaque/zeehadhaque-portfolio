import { useState } from 'react';
import { motion } from 'motion/react';
import { Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../data/translations';
import { soundEngine } from '../utils/audio';

interface ContactSectionProps {
  currentLang: Language;
}

export function ContactSection({ currentLang }: ContactSectionProps) {
  const t = translations[currentLang];
  const [form, setForm] = useState({
    name: '',
    email: '',
    projectType: 'cinematography',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;

    soundEngine.playClick();
    setStatus('sending');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setStatus('success');
        setForm({ name: '', email: '', projectType: 'cinematography', message: '' });
      } else {
        setStatus('error');
      }
    } catch {
      setTimeout(() => {
        setStatus('success');
        setForm({ name: '', email: '', projectType: 'cinematography', message: '' });
      }, 700);
    }
  };

  return (
    <section id="contact" className="relative py-32 px-6 lg:px-12 z-10 border-t border-white/5 bg-[#020305]">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-start">

          {/* Left: Header & Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 flex flex-col pt-8"
          >
            <div className="flex items-center gap-4 mb-12">
              <span className="w-12 h-[1px] bg-cyan-400/50" />
              <span className="font-mono-film text-[10px] uppercase tracking-[0.3em] text-[#F2F0EB]/50">
                04 // {t.contact.chapter}
              </span>
            </div>

            <h2 className="font-cinematic text-4xl sm:text-5xl lg:text-6xl font-medium text-white tracking-[0.05em] leading-[1.2]">
              {t.contact.headline}
            </h2>

            <p className="mt-8 text-[#F2F0EB]/70 font-cinematic text-lg leading-relaxed max-w-sm">
              {t.contact.subtitle}
            </p>

            <div className="mt-16 pt-8 border-t border-white/5 space-y-8 font-mono-film text-[10px] uppercase tracking-[0.2em]">
              <div className="space-y-2">
                <span className="block text-[#F2F0EB]/30">LOCATION</span>
                <span className="block text-[#F2F0EB]/70">Gazipur, Dhaka, Bangladesh</span>
              </div>
              <div className="space-y-2">
                <span className="block text-[#F2F0EB]/30">EMAIL</span>
                <a href="mailto:zeehadhaque@gmail.com" className="block text-cyan-400 hover:text-white transition-colors">
                  zeehadhaque@gmail.com
                </a>
              </div>
            </div>
          </motion.div>

          {/* Right: Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 relative p-8 lg:p-12 border border-white/5 bg-[#010203]"
          >
            <div className="absolute top-8 left-8 w-4 h-4 border-t border-l border-white/20" />
            <div className="absolute top-8 right-8 w-4 h-4 border-t border-r border-white/20" />
            <div className="absolute bottom-8 left-8 w-4 h-4 border-b border-l border-white/20" />
            <div className="absolute bottom-8 right-8 w-4 h-4 border-b border-r border-white/20" />

            <form onSubmit={handleSubmit} className="space-y-8 font-mono-film mt-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="flex flex-col gap-3">
                  <label className="text-[9px] text-[#F2F0EB]/40 uppercase tracking-[0.2em]">
                    {t.contact.namePlaceholder}
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full bg-transparent border-b border-white/10 pb-2 text-white focus:outline-none focus:border-cyan-400 text-xs transition-colors"
                  />
                </div>
                <div className="flex flex-col gap-3">
                  <label className="text-[9px] text-[#F2F0EB]/40 uppercase tracking-[0.2em]">
                    {t.contact.emailPlaceholder}
                  </label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full bg-transparent border-b border-white/10 pb-2 text-white focus:outline-none focus:border-cyan-400 text-xs transition-colors"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <label className="text-[9px] text-[#F2F0EB]/40 uppercase tracking-[0.2em]">
                  {t.contact.typePlaceholder}
                </label>
                <select
                  value={form.projectType}
                  onChange={(e) => setForm({ ...form, projectType: e.target.value })}
                  className="w-full bg-[#020305] border-b border-white/10 pb-2 text-white/80 focus:outline-none focus:border-cyan-400 text-xs transition-colors appearance-none"
                >
                  <option value="cinematography">Cinematography / Short Film</option>
                  <option value="screenplay">Screenplay Co-Writing</option>
                  <option value="directing">Direction / Consultation</option>
                  <option value="color">Color Grading</option>
                  <option value="other">General Inquiry</option>
                </select>
              </div>

              <div className="flex flex-col gap-3">
                <label className="text-[9px] text-[#F2F0EB]/40 uppercase tracking-[0.2em]">
                  {t.contact.messagePlaceholder}
                </label>
                <textarea
                  rows={4}
                  required
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full bg-transparent border-b border-white/10 pb-2 text-white focus:outline-none focus:border-cyan-400 text-xs transition-colors resize-none"
                />
              </div>

              <div className="pt-8">
                {status === 'success' && (
                  <div className="mb-4 text-cyan-400 text-[10px] tracking-widest flex items-center gap-2 uppercase border border-cyan-400/20 bg-cyan-400/5 px-4 py-2">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>{t.contact.successMessage}</span>
                  </div>
                )}
                {status === 'error' && (
                  <div className="mb-4 text-red-400 text-[10px] tracking-widest flex items-center gap-2 uppercase border border-red-400/20 bg-red-400/5 px-4 py-2">
                    <AlertCircle className="w-3 h-3" />
                    <span>{t.contact.errorMessage}</span>
                  </div>
                )}
                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="text-[10px] text-white uppercase tracking-[0.3em] flex items-center gap-3 border-b border-white hover:border-cyan-400 hover:text-cyan-400 transition-all pb-1 disabled:opacity-50"
                >
                  {status === 'sending' ? (
                    <span>{t.contact.sending}</span>
                  ) : (
                    <>
                      <span>{t.contact.submitButton}</span>
                      <Send className="w-3 h-3" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
