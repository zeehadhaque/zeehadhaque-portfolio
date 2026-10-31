import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Film, Eye, Sparkles, Sliders, Layers, Compass, BookOpen } from 'lucide-react';
import { useUniverseStore } from '../../store/universeStore';
import { soundEngine } from '../../utils/audio';
import { ZEEHAD_IMAGE_PATH, ZEEHAD_SVG_PLACEHOLDER } from '../../utils/imageFallback';

export const ProfileDossierModal: React.FC = () => {
  const profileDossierOpen = useUniverseStore((s) => s.profileDossierOpen);
  const setProfileDossierOpen = useUniverseStore((s) => s.setProfileDossierOpen);
  const [activeTab, setActiveTab] = useState<
    | 'identity'
    | 'philosophy'
    | 'cinematography'
    | 'directing'
    | 'writing'
    | 'editing'
    | 'explorations'
  >('identity');

  const [imgSrc, setImgSrc] = useState(ZEEHAD_IMAGE_PATH);

  useEffect(() => {
    if (profileDossierOpen) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }
    return () => document.body.classList.remove('modal-open');
  }, [profileDossierOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && profileDossierOpen) {
        setProfileDossierOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [profileDossierOpen, setProfileDossierOpen]);

  if (!profileDossierOpen) return null;

  const handleClose = () => {
    soundEngine.playClick();
    setProfileDossierOpen(false);
  };

  const tabs = [
    { id: 'identity', label: 'IDENTITY', icon: Film },
    { id: 'philosophy', label: 'PHILOSOPHY', icon: Eye },
    { id: 'cinematography', label: 'CINEMATOGRAPHY', icon: Sparkles },
    { id: 'directing', label: 'DIRECTING', icon: Compass },
    { id: 'writing', label: 'WRITING', icon: BookOpen },
    { id: 'editing', label: 'EDITING', icon: Sliders },
    { id: 'explorations', label: 'EXPLORATIONS', icon: Layers },
  ] as const;

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 bg-[#020305]/85 backdrop-blur-xl animate-in fade-in duration-200"
        onClick={handleClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-5xl max-h-[92vh] bg-[#06090E] border border-[#102B45] rounded-xl shadow-2xl overflow-y-auto text-[#F2F0EB]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header Bar */}
          <div className="sticky top-0 z-20 flex items-center justify-between px-6 py-4 bg-[#06090E]/95 border-b border-[#102B45] backdrop-blur-md">
            <div>
              <span className="font-mono text-[10px] text-[#7DBBFF] tracking-[0.2em] block uppercase">
                DIRECTORIAL MONOLITH // DOSSIER 01
              </span>
              <h2 className="font-headline font-black text-xl text-[#F2F0EB] tracking-wider">
                ZEEHAD HAQUE
              </h2>
            </div>
            <button
              onClick={handleClose}
              className="p-1.5 rounded-lg border border-[#102B45] text-[#8A96A3] hover:text-[#F2F0EB] hover:bg-[#102B45] transition-colors font-mono text-xs"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-1.5 px-6 py-3 border-b border-[#102B45] overflow-x-auto bg-[#04070D]">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    soundEngine.playClick();
                  }}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded font-mono text-xs whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-[#102B45] text-[#7DBBFF] border border-[#2C6EA6]'
                      : 'text-[#8A96A3] hover:text-[#F2F0EB] hover:bg-[#081522]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Tab Content Body */}
          <div className="p-6 sm:p-8 space-y-6">
            {activeTab === 'identity' && (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                <div className="md:col-span-5">
                  <div className="aspect-[4/5] rounded-lg overflow-hidden border border-[#102B45] bg-[#020305] relative shadow-xl">
                    <img
                      src={imgSrc}
                      alt="Zeehad Haque"
                      onError={() => setImgSrc(ZEEHAD_SVG_PLACEHOLDER)}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#020305] via-transparent to-transparent opacity-60" />
                    <div className="absolute bottom-3 left-3 right-3 p-3 rounded bg-[#020305]/80 backdrop-blur-sm border border-[#102B45] font-mono text-[10px]">
                      <div className="text-[#7DBBFF] font-bold">ZEEHAD HAQUE</div>
                      <div className="text-[#8A96A3]">GAZIPUR, DHAKA // BANGLADESH</div>
                    </div>
                  </div>
                </div>

                <div className="md:col-span-7 space-y-4">
                  <span className="font-mono text-xs text-[#7DBBFF] tracking-widest uppercase">
                    CANONICAL CREATIVE DOSSIER
                  </span>
                  <h3 className="font-headline font-bold text-2xl text-[#F2F0EB]">
                    Writer · Director · Cinematographer · Editor
                  </h3>
                  <p className="text-sm text-[#F2F0EB]/90 leading-relaxed font-normal">
                    Independent filmmaker exploring psychological storytelling, structural tension, and nocturnal atmospheres. Working from Gazipur and Dhaka, Bangladesh, Zeehad crafts cinematic experiences defined by deliberate pacing, sensory silences, and stark visual contrasts.
                  </p>

                  <div className="pt-4 border-t border-[#102B45] space-y-3 font-mono text-xs">
                    <div className="flex justify-between py-1 border-b border-[#102B45]/50">
                      <span className="text-[#8A96A3]">IDENTITY:</span>
                      <span className="text-[#F2F0EB]">Independent Filmmaker / Visual Storyteller</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-[#102B45]/50">
                      <span className="text-[#8A96A3]">CORE INTERESTS:</span>
                      <span className="text-[#7DBBFF]">Psychological Thriller · Mystery · Dark Comedy</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-[#102B45]/50">
                      <span className="text-[#8A96A3]">HARDWARE & WORKFLOW:</span>
                      <span className="text-[#F2F0EB]">Mobile-first Auteur · Redmi Note 14 Pro+ 5G</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-[#102B45]/50">
                      <span className="text-[#8A96A3]">POST-PRODUCTION:</span>
                      <span className="text-[#F2F0EB]">DaVinci Resolve Studio (2.35:1 & 2.00:1)</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-[#8A96A3]">LOCATION:</span>
                      <span className="text-[#F2F0EB]">Gazipur, Dhaka, Bangladesh</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'philosophy' && (
              <div className="space-y-6 max-w-3xl">
                <blockquote className="font-quote italic text-2xl sm:text-3xl text-[#7DBBFF] leading-snug pl-4 border-l-2 border-[#2C6EA6]">
                  "Stories told through light, silence, and movement."
                </blockquote>
                <p className="text-sm sm:text-base text-[#F2F0EB]/90 leading-relaxed">
                  In a media landscape crowded with frantic exposition, Zeehad’s directorial focus turns toward what remains unsaid. Silence is treated not as an absence of sound, but as an active sensory force that amplifies psychological tension.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 font-mono text-xs">
                  <div className="p-4 rounded-lg bg-[#020305]/70 border border-[#102B45]">
                    <div className="text-[#7DBBFF] font-bold mb-1">01 // LIGHT</div>
                    <p className="text-[#8A96A3] text-[11px] leading-relaxed">
                      Directional moonlight, practical fixtures, and high-contrast shadows defining human isolation.
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-[#020305]/70 border border-[#102B45]">
                    <div className="text-[#7DBBFF] font-bold mb-1">02 // SILENCE</div>
                    <p className="text-[#8A96A3] text-[11px] leading-relaxed">
                      Suspension of dialogue to allow room tone, footsteps, and spatial acoustics to drive tension.
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-[#020305]/70 border border-[#102B45]">
                    <div className="text-[#7DBBFF] font-bold mb-1">03 // MOVEMENT</div>
                    <p className="text-[#8A96A3] text-[11px] leading-relaxed">
                      Slow deliberate push-ins, low-angle tracking, and locked frames revealing psychological shifts.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'cinematography' && (
              <div className="space-y-4 max-w-3xl">
                <h4 className="font-headline font-bold text-xl text-[#F2F0EB]">
                  Mobile-First Auteur Cinematography
                </h4>
                <p className="text-sm text-[#F2F0EB]/90 leading-relaxed">
                  Demonstrating that cinematic grammar relies on lens choice, light motivation, and blocking rather than cumbersome industrial machinery. By pushing the sensor capabilities of the Redmi Note 14 Pro+ 5G with manual exposure locking, custom ND/mist diffusion, and 24 FPS cadence, each frame achieves disciplined texture.
                </p>
                <div className="p-4 rounded-lg bg-[#020305] border border-[#102B45] font-mono text-xs space-y-2">
                  <div className="text-[#7DBBFF] font-bold">CINEMATOGRAPHIC SPECIFICATIONS</div>
                  <div className="grid grid-cols-2 gap-2 text-[11px] text-[#8A96A3]">
                    <div>• Aspect Ratios: 2.39:1 Anamorphic & 2.00:1 Univisium</div>
                    <div>• Shutter Angle: 180° (1/48s at 24fps)</div>
                    <div>• Color Science: Custom Bleach Bypass & Cool Shadow Rolloff</div>
                    <div>• Key Lighting: Motivated Single-Source & Cyan Rim Accents</div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'directing' && (
              <div className="space-y-4 max-w-3xl">
                <h4 className="font-headline font-bold text-xl text-[#F2F0EB]">
                  Atmospheric Staging & Actor Blocking
                </h4>
                <p className="text-sm text-[#F2F0EB]/90 leading-relaxed">
                  Directing focused on subtext, physical proximity, and architectural confinement. Actors are blocked within corridors, thresholds, and reflective glass surfaces to externalize claustrophobia and paranoia without requiring theatrical speech.
                </p>
              </div>
            )}

            {activeTab === 'writing' && (
              <div className="space-y-4 max-w-3xl">
                <h4 className="font-headline font-bold text-xl text-[#F2F0EB]">
                  Visual Screenplays & Narrative Loops
                </h4>
                <p className="text-sm text-[#F2F0EB]/90 leading-relaxed">
                  Screenwriting structured around nonlinear loops, absurd escalation, and moral consequence. From the time-loop recursion of <em>Reflect</em> to the Old Dhaka negotiation absurdity of <em>Ghurpak</em> and the morgue investigation of <em>Autopsy</em>, writing emphasizes visual action over exposition.
                </p>
              </div>
            )}

            {activeTab === 'editing' && (
              <div className="space-y-4 max-w-3xl">
                <h4 className="font-headline font-bold text-xl text-[#F2F0EB]">
                  Rhythmic Assembly & Sound Bridges
                </h4>
                <p className="text-sm text-[#F2F0EB]/90 leading-relaxed">
                  Editing conducted with mathematical respect for cadence: extended holds on character reactions followed by abrupt match cuts. J-cuts and L-cuts bleed sub-bass audio across scenes, preparing the audience's subconscious for impending psychological revelations.
                </p>
              </div>
            )}

            {activeTab === 'explorations' && (
              <div className="space-y-4 max-w-3xl font-mono text-xs">
                <h4 className="font-headline font-bold text-xl text-[#F2F0EB]">
                  Current Creative Explorations
                </h4>
                <p className="text-sm text-[#F2F0EB]/90 leading-relaxed font-sans mb-4">
                  Ongoing screenplays, aesthetic experiments, and narrative worldbuilding currently in active development:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { title: 'GHURPAK (ঘুরপাক)', desc: 'Psychological Dark Comedy / Old Dhaka Conspirators' },
                    { title: 'ONUSONDHAN (অনুসন্ধান)', desc: 'Obsessive Amateur Investigation / Routine Disappearance' },
                    { title: 'SESH BIKEL (শেষ বিকেলে)', desc: 'Coming-of-Age Friendship Drama / Final Meetup' },
                    { title: 'SHYAMOL DEEP (শ্যামল দ্বীপ)', desc: 'Atmospheric Mystery / Forest Isolation' },
                    { title: 'PROTIDDHONI (প্রতিধ্বনি)', desc: 'Literary Drama / Pre-Recorded Audio Tapes' },
                    { title: "DON'T GO THERE (ওই বাড়িটার সামনে যেও না)", desc: 'Colonial Estate Survival Suspense' },
                  ].map((exp, i) => (
                    <div key={i} className="p-3 rounded bg-[#020305] border border-[#102B45]">
                      <div className="text-[#7DBBFF] font-bold text-[11px] mb-1">{exp.title}</div>
                      <div className="text-[#8A96A3] text-[10px]">{exp.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
