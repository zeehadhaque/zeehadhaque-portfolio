import { motion } from 'motion/react';
import { Target, Info } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../data/translations';

interface FooterProps {
  currentLang: Language;
}

export function Footer({ currentLang }: FooterProps) {
  
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative pt-24 pb-12 px-6 lg:px-12 z-10 border-t border-white/5 bg-[#010203]">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 text-[#F2F0EB]/50 font-mono-film uppercase tracking-[0.2em] text-[10px]">

        {/* Left Col: Target & Copyright */}
        <div className="md:col-span-4 flex flex-col gap-6 items-start">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="group flex items-center gap-3 border border-white/10 px-4 py-2 bg-[#020305]"
          >
            <Target className="w-4 h-4 text-cyan-400 group-hover:animate-pulse" />
            <span className="tracking-[0.3em] font-medium text-white">ALL RIGHTS RESERVED</span>
            <span className="text-[#F2F0EB]/30">/ @{currentYear}</span>
          </motion.div>

          <div className="leading-relaxed">
            INDEPENDENT ORIGINAL FILMS / 24FPS / 2.35:1 Anamorphic
          </div>
        </div>

        {/* Center Cols: Digital Core */}
        <div className="md:col-span-5 grid grid-cols-2 gap-8 pt-2">
          <div className="space-y-3">
            <span className="block text-[#F2F0EB]/20 tracking-[0.3em]">REEL ARCHIVES</span>
            <a href="#work" className="block hover:text-white transition-colors">WORK.LOG</a>
            <a href="https://youtube.com/@zeehadhaque" target="_blank" rel="noopener noreferrer" className="block hover:text-white transition-colors">YOUTUBE</a>
            <a href="https://vimeo.com/zeehadhque" target="_blank" rel="noopener noreferrer" className="block hover:text-white transition-colors">VIMEO</a>
          </div>
          <div className="space-y-3">
            <span className="block text-[#F2F0EB]/20 tracking-[0.3em]">CINE-ACADEMY</span>
            <a href="#academy" className="block hover:text-white transition-colors">ACADEMY.LOG</a>
            <a href="#arcade" className="block hover:text-white transition-colors">CINE.ARCADE</a>
            <a href="https://github.com/zeehadhaque" target="_blank" rel="noopener noreferrer" className="block hover:text-white transition-colors">GIT.HOST</a>
          </div>
        </div>

        {/* Right Col: Info */}
        <div className="md:col-span-3 flex md:justify-end items-start pt-2">
           <div className="flex items-start gap-3 text-red-500/60 uppercase group">
              <Info className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div className="leading-relaxed group-hover:text-amber-400 transition-colors">
                DIRECTOR AUTEUR NOTE: EXPERIMENTAL WORKS IN PROGRESS
              </div>
           </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between gap-4 text-[#F2F0EB]/20 font-mono-film text-[9px] uppercase tracking-widest">
         <span>GAZIPUR BD &gt; FRAME GLOBAL</span>
         <span>DESIGNED FOR CINEMATIC DISRUPTION</span>
      </div>

    </footer>
  );
}
