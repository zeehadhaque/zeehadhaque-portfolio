import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Language } from '../types';
import { translations } from '../data/translations';

interface ProfileSectionProps {
  currentLang: Language;
}

const CANDIDATE_IMAGES = [
  '/assets/images/profile/profile.jpg',
  '/assets/images/profile/profile.jpeg',
  '/assets/images/profile/profile.png',
  '/assets/images/profile/profile.webp',
  '/assets/images/profile/placeholder.svg',
];

export function ProfileSection({ currentLang }: ProfileSectionProps) {
  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);
  const t = translations[currentLang];

  const currentSrc = CANDIDATE_IMAGES[currentImgIndex];

  const handleImageError = () => {
    if (currentImgIndex < CANDIDATE_IMAGES.length - 1) {
      setCurrentImgIndex((prev) => prev + 1);
    }
  };

  useEffect(() => {
    // Reset when component mounts to attempt loading primary profile.jpg
    setCurrentImgIndex(0);
  }, []);

  return (
    <section id="profile" className="relative py-32 px-6 lg:px-12 z-10 border-t border-white/5 bg-[#020305] overflow-hidden">
      <div id="about" className="absolute -top-24 left-0" />
      <div className="max-w-7xl mx-auto">
        {/* Section Header with Staggered Fade-in */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-20 pb-8 border-b border-white/10"
        >
          <div>
             <div className="flex items-center gap-4 mb-4">
              <span className="w-12 h-[1px] bg-cyan-400/50" />
              <span className="font-mono-film text-[10px] uppercase tracking-[0.3em] text-[#F2F0EB]/50">
                PORTRAIT // THE CINEMATOGRAPHER
              </span>
            </div>
            <h2 className="font-cinematic text-4xl sm:text-5xl font-medium text-white tracking-[0.05em]">
              ZEEHAD HAQUE
            </h2>
          </div>

          <div className="font-mono-film text-[10px] text-[#F2F0EB]/40 tracking-[0.25em] uppercase bg-white/5 px-4 py-2 rounded-full border border-white/5 backdrop-blur-md">
            GAZIPUR, DHAKA, BANGLADESH
          </div>
        </motion.div>

        {/* Main Grid: Cinematic Portrait Showcase + Liquid Glass Elements */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-center">

          {/* Spatial Portrait Showcase */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-4 relative perspective-1000 group"
          >
            {/* Spatial UI Glass Container */}
            <div className="relative w-full aspect-[3/4] rounded-[2rem] bg-[#050810]/40 backdrop-blur-2xl border border-white/10 overflow-hidden shadow-[inset_0_1px_1px_rgba(255,255,255,0.15),0_30px_60px_rgba(0,0,0,0.8)] group-hover:-translate-y-3 group-hover:rotate-y-2 group-hover:shadow-[inset_0_1px_2px_rgba(255,255,255,0.3),0_40px_80px_rgba(0,0,0,0.9)] transition-all duration-700 ease-[0.16,1,0.3,1]">
              <motion.img
                key={currentSrc}
                src={currentSrc}
                alt="Zeehad Haque — Filmmaker & Cinematographer"
                onError={handleImageError}
                onLoad={() => setImageLoaded(true)}
                initial={{ scale: 1.05, opacity: 0 }}
                animate={{ scale: 1, opacity: imageLoaded ? 1 : 0.7 }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
                className="w-full h-full object-cover filter grayscale contrast-125 brightness-75 group-hover:scale-110 transition-transform duration-[1.5s] ease-out"
              />

              {/* Reflection Highlight Layer */}
              <div className="absolute top-0 inset-x-0 h-[100px] bg-gradient-to-b from-white/10 to-transparent pointer-events-none mix-blend-overlay" />
              <div className="absolute inset-0 shadow-[inset_0_0_100px_rgba(0,0,0,0.9)] pointer-events-none" />

              {/* Viewfinder Overlays inside Glass */}
              <div className="absolute top-6 left-6 font-mono-film text-[9px] text-white tracking-[0.3em] bg-black/30 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                RAW 24P
              </div>

              <div className="absolute bottom-6 right-6 font-mono-film text-[9px] text-white tracking-[0.3em] bg-black/30 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                50MM // f/1.8
              </div>
            </div>
          </motion.div>

          {/* Liquid Glass Editorial Biography */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.9, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-8 flex flex-col justify-between"
          >
            <div className="relative p-10 sm:p-12 rounded-[2rem] bg-[#050810]/30 backdrop-blur-2xl border border-white/5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),0_20px_40px_rgba(0,0,0,0.5)] group hover:border-white/10 transition-colors duration-500">
               {/* Internal refraction glow */}
               <div className="absolute top-0 right-1/4 w-[300px] h-[300px] bg-cyan-500/5 blur-[120px] rounded-full pointer-events-none transition-opacity duration-700 opacity-0 group-hover:opacity-100" />

               <div className="relative z-10 space-y-6 text-[#F2F0EB]/60 leading-[1.8] font-cinematic font-light text-lg">
                <p className="text-[#F2F0EB] text-xl font-medium">
                  {t.about.bioParagraph1}
                </p>
                <p>
                  {t.about.bioParagraph2}
                </p>
                <p>
                  {t.about.bioParagraph3}
                </p>
              </div>

              <div className="relative z-10 mt-12 pt-8 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-8 font-mono-film text-[10px] text-[#F2F0EB]/40 tracking-[0.2em] uppercase">
                <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                  <span className="block text-[#F2F0EB]/30 mb-2">APPROACH</span>
                  <span className="block text-cyan-400 font-bold tracking-widest mb-1">MOBILE-FIRST AUTEUR WORKFLOW</span>
                  <span className="block text-[#F2F0EB]/60">{t.about.deviceNote}</span>
                </div>
                <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                  <span className="block text-[#F2F0EB]/30 mb-2">CREDENTIALS</span>
                  <span className="block text-white font-bold tracking-widest mb-1">2026 – PRESENT</span>
                  <span className="block text-[#F2F0EB]/60">ALL FILMS RELEASED YOUTUBE</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
