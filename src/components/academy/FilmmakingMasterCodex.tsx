import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  GraduationCap,
  BookOpen,
  Camera,
  Sun,
  Flame,
  Clapperboard,
  Headphones,
  Scissors,
  Search,
  Copy,
  Check,
  Download,
  Sparkles,
  ChevronRight,
  Sliders,
  FileText,
  HelpCircle,
  Eye,
  Info,
} from 'lucide-react';
import { Language } from '../../types';
import { soundEngine } from '../../utils/audio';
import { ACADEMY_MODULES, CurriculumLesson, CurriculumModule } from '../../data/academyCurriculum';
import { FILMMAKING_GLOSSARY, GlossaryTerm } from '../../data/filmmakerGlossary';
import { PRODUCTION_TEMPLATES, ProductionTemplate } from '../../data/filmmakerTemplates';
import { InteractiveDofSimulator } from './InteractiveDofSimulator';
import { InteractiveLightingStudio } from './InteractiveLightingStudio';
import { InteractiveScriptBreakdown } from './InteractiveScriptBreakdown';
import { ShotListGenerator } from './ShotListGenerator';

interface FilmmakingMasterCodexProps {
  currentLang: Language;
  directorsCut?: boolean;
}

type TabKey = 'curriculum' | 'lab' | 'lexicon' | 'vault';

export function FilmmakingMasterCodex({ currentLang, directorsCut }: FilmmakingMasterCodexProps) {
  const [activeTab, setActiveTab] = useState<TabKey>('curriculum');

  // Curriculum State
  const [selectedModuleId, setSelectedModuleId] = useState<string>('cinematography');
  const [selectedLesson, setSelectedLesson] = useState<CurriculumLesson | null>(
    ACADEMY_MODULES[0].lessons[0]
  );

  // Virtual Lab Active Sub-tool
  const [activeLabTool, setActiveLabTool] = useState<'dof' | 'lighting' | 'script' | 'shotlist'>('dof');

  // Lexicon Search & Filter
  const [lexiconSearch, setLexiconSearch] = useState('');
  const [lexiconCategory, setLexiconCategory] = useState<string>('ALL');

  // Vault Template Selection & Copy
  const [selectedTemplate, setSelectedTemplate] = useState<ProductionTemplate>(PRODUCTION_TEMPLATES[0]);
  const [copiedTemplateId, setCopiedTemplateId] = useState<string | null>(null);

  const activeModule = useMemo(() => {
    return ACADEMY_MODULES.find((m) => m.id === selectedModuleId) || ACADEMY_MODULES[0];
  }, [selectedModuleId]);

  // Filtered Glossary
  const filteredGlossary = useMemo(() => {
    return FILMMAKING_GLOSSARY.filter((t) => {
      const matchCat = lexiconCategory === 'ALL' || t.category === lexiconCategory;
      const q = lexiconSearch.toLowerCase().trim();
      const matchSearch =
        !q ||
        t.term.toLowerCase().includes(q) ||
        t.shortDef.toLowerCase().includes(q) ||
        t.bengaliDef.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
  }, [lexiconSearch, lexiconCategory]);

  const handleCopyTemplate = (t: ProductionTemplate) => {
    soundEngine.playClick();
    navigator.clipboard.writeText(t.content);
    setCopiedTemplateId(t.id);
    setTimeout(() => setCopiedTemplateId(null), 2200);
  };

  const handleDownloadTemplate = (t: ProductionTemplate) => {
    soundEngine.playClick();
    const blob = new Blob([t.content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${t.id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <section
      id="academy"
      className="relative py-28 px-4 sm:px-6 lg:px-12 z-10 border-t border-neutral-900 bg-gradient-to-b from-[#02050f] via-[#040816] to-[#02050f] overflow-hidden"
    >
      {/* Subtle Background Accent Lighting */}

      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="mb-10 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-3 mb-3">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400  animate-pulse" />
            <span className="font-mono-film text-xs uppercase tracking-[0.35em] text-cyan-400">
              {currentLang === 'bn'
                ? 'অধ্যায় ০৪ // সিনেমা নির্মাণ বিদ্যাপীঠ ও কোডেক্স'
                : 'CHAPTER 04 // THE AUTEUR’S CODEX & FILM ACADEMY'}
            </span>
          </div>

          <h2 className="font-cinematic text-3xl sm:text-5xl lg:text-6xl font-black uppercase text-white tracking-[0.12em]">
            {currentLang === 'bn' ? 'সিনেমা নির্মাণের মহাজ্ঞান' : 'MASTER FILMMAKING CODEX'}
          </h2>

          <p className="mt-3 max-w-3xl text-sm sm:text-base text-neutral-400 font-sans leading-relaxed">
            {currentLang === 'bn'
              ? 'স্বাধীন চলচ্চিত্র নির্মাণ, সিনেমাটোগ্রাফি, অপটিক্যাল বিজ্ঞান, চিত্রনাট্য এবং সাউন্ড ডিজাইনের একটি সম্পূর্ণ উন্মুক্ত বিদ্যাপীঠ। যে কেউ চলচ্চিত্র ভালোবাসে, তারা এখান থেকেই সবকিছু শিখতে পারবে।'
              : 'An exhaustive master academy and interactive reference suite covering cinematography optics, Rembrandt lighting setups, 3-act narrative engineering, psychoacoustics, and production workflows.'}
          </p>
        </div>

        {/* Master Tabbed Navigation */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-8 border-b border-neutral-800/80 pb-4">
          <button
            type="button"
            onClick={() => {
              soundEngine.playClick();
              setActiveTab('curriculum');
            }}
            data-cursor="LEARN"
            className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl border text-xs sm:text-sm font-mono-film transition-all ${
              activeTab === 'curriculum'
                ? 'bg-cyan-500/20 border-cyan-400 text-white font-bold '
                : 'bg-neutral-900/40 border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-700'
            }`}
          >
            <GraduationCap className="w-4 h-4 text-cyan-400" />
            <span>1. MASTERCLASS CURRICULUM</span>
          </button>

          <button
            type="button"
            onClick={() => {
              soundEngine.playClick();
              setActiveTab('lab');
            }}
            data-cursor="LAB"
            className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl border text-xs sm:text-sm font-mono-film transition-all ${
              activeTab === 'lab'
                ? 'bg-amber-500/20 border-amber-400 text-white font-bold '
                : 'bg-neutral-900/40 border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-700'
            }`}
          >
            <Sliders className="w-4 h-4 text-amber-400" />
            <span>2. VIRTUAL FILMMAKER LAB</span>
          </button>

          <button
            type="button"
            onClick={() => {
              soundEngine.playClick();
              setActiveTab('lexicon');
            }}
            data-cursor="LEXICON"
            className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl border text-xs sm:text-sm font-mono-film transition-all ${
              activeTab === 'lexicon'
                ? 'bg-pink-500/20 border-pink-400 text-white font-bold '
                : 'bg-neutral-900/40 border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-700'
            }`}
          >
            <BookOpen className="w-4 h-4 text-pink-400" />
            <span>3. AUTEUR’S LEXICON (100+ TERMS)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              soundEngine.playClick();
              setActiveTab('vault');
            }}
            data-cursor="VAULT"
            className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl border text-xs sm:text-sm font-mono-film transition-all ${
              activeTab === 'vault'
                ? 'bg-emerald-500/20 border-emerald-400 text-white font-bold '
                : 'bg-neutral-900/40 border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-700'
            }`}
          >
            <FileText className="w-4 h-4 text-emerald-400" />
            <span>4. PRODUCTION VAULT & TEMPLATES</span>
          </button>
        </div>

        {/* TAB 1: CURRICULUM */}
        {activeTab === 'curriculum' && (
          <div className="space-y-6">
            {/* Module Picker Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {ACADEMY_MODULES.map((mod) => {
                const isActive = selectedModuleId === mod.id;
                return (
                  <button
                    key={mod.id}
                    type="button"
                    onClick={() => {
                      soundEngine.playClick();
                      setSelectedModuleId(mod.id);
                      setSelectedLesson(mod.lessons[0]);
                    }}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      isActive
                        ? 'bg-cyan-950/40 border-cyan-400 text-white '
                        : 'bg-neutral-900/50 border-neutral-800/80 text-neutral-400 hover:border-neutral-700 hover:text-neutral-200'
                    }`}
                  >
                    <div className="text-[10px] font-mono-film text-cyan-400">
                      MOD {mod.moduleNumber}
                    </div>
                    <div className="text-xs font-bold font-cinematic truncate mt-0.5">
                      {mod.title.split('&')[0]}
                    </div>
                    <div className="text-[9px] text-neutral-500 font-mono-film truncate mt-0.5">
                      {mod.bengaliTitle}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Active Module Header */}
            <div className="p-4 sm:p-6 rounded-2xl bg-neutral-900/60 border border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="text-xs font-mono-film text-cyan-400 uppercase tracking-widest mb-1">
                  MODULE {activeModule.moduleNumber} // {activeModule.bengaliTitle}
                </div>
                <h3 className="text-xl sm:text-2xl font-bold font-cinematic text-white uppercase tracking-wider">
                  {activeModule.title}
                </h3>
                <p className="text-xs text-neutral-400 font-sans mt-1">
                  {activeModule.description}
                </p>
              </div>

              <div className="flex items-center gap-1.5 text-xs font-mono-film text-neutral-400 self-start sm:self-auto bg-neutral-950 px-3 py-1.5 rounded-xl border border-neutral-800">
                <span>{activeModule.lessons.length} CORE LESSONS</span>
              </div>
            </div>

            {/* Lesson Explorer Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Lesson List Column */}
              <div className="lg:col-span-4 space-y-2.5">
                {activeModule.lessons.map((lesson) => {
                  const isSel = selectedLesson?.id === lesson.id;
                  return (
                    <button
                      key={lesson.id}
                      type="button"
                      onClick={() => {
                        soundEngine.playClick();
                        setSelectedLesson(lesson);
                      }}
                      className={`w-full p-3.5 rounded-xl border text-left transition-all ${
                        isSel
                          ? 'bg-cyan-500/15 border-cyan-400/80 text-white '
                          : 'bg-neutral-900/40 border-neutral-800/80 text-neutral-400 hover:border-neutral-700 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="text-[9px] font-mono-film font-bold uppercase px-1.5 py-0.5 rounded bg-neutral-800 text-cyan-300">
                          {lesson.badge}
                        </span>
                        <span className="text-[9px] font-mono-film text-neutral-500">
                          {lesson.estimatedReadTime}
                        </span>
                      </div>
                      <div className="text-xs font-bold text-neutral-200 truncate">
                        {lesson.title}
                      </div>
                      <div className="text-[10px] text-neutral-400 truncate mt-0.5">
                        {lesson.subtitle}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Selected Lesson Reader View */}
              <div className="lg:col-span-8 bg-neutral-900/80 border border-neutral-800 p-5 sm:p-8 rounded-2xl shadow-xl space-y-6">
                {selectedLesson && (
                  <>
                    <div className="border-b border-neutral-800 pb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-[10px] font-mono-film font-bold text-cyan-400 uppercase tracking-widest px-2 py-0.5 rounded bg-cyan-950 border border-cyan-800">
                          {selectedLesson.badge}
                        </span>
                        <span className="text-xs font-mono-film text-neutral-400">
                          {selectedLesson.estimatedReadTime}
                        </span>
                      </div>
                      <h3 className="text-xl sm:text-2xl font-bold font-cinematic text-white uppercase tracking-wide">
                        {selectedLesson.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-neutral-400 font-sans mt-1">
                        {selectedLesson.subtitle}
                      </p>
                    </div>

                    {/* Core Rule Callout */}
                    <div className="p-4 rounded-xl border border-amber-500/40 bg-amber-950/20 text-neutral-200 text-xs sm:text-sm italic leading-relaxed shadow-inner">
                      <strong className="text-amber-300 font-mono-film not-italic uppercase tracking-wider block mb-1">
                        THE GOLDEN PRINCIPLE:
                      </strong>
                      "{selectedLesson.coreRule}"
                    </div>

                    {/* Deep Dive Breakdown */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-mono-film font-bold text-cyan-300 uppercase tracking-wider">
                        TECHNICAL DEEP DIVE & PRACTICE:
                      </h4>
                      <div className="space-y-2.5">
                        {selectedLesson.deepDive.map((para, pidx) => (
                          <div
                            key={pidx}
                            className="p-3 rounded-lg bg-neutral-950/60 border border-neutral-800/80 text-xs text-neutral-300 leading-relaxed font-sans"
                          >
                            {para}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Technical Specs Table */}
                    {selectedLesson.technicalSpecs && (
                      <div className="space-y-2">
                        <h4 className="text-[10px] font-mono-film font-bold text-neutral-400 uppercase tracking-wider">
                          METRICS & BENCHMARKS:
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {selectedLesson.technicalSpecs.map((spec, sidx) => (
                            <div
                              key={sidx}
                              className="p-2.5 rounded-lg bg-neutral-950 border border-neutral-800/80 flex items-center justify-between text-xs"
                            >
                              <span className="text-neutral-400 font-mono-film text-[10px]">{spec.label}:</span>
                              <span className="text-white font-mono-film font-bold">{spec.value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Visual Formula */}
                    {selectedLesson.visualFormula && (
                      <div className="p-3 rounded-lg bg-cyan-950/30 border border-cyan-800/60 text-xs font-mono-film text-cyan-300">
                        <span className="text-[9px] uppercase tracking-wider text-cyan-400/70 block mb-0.5">
                          Mathematical Formulation:
                        </span>
                        {selectedLesson.visualFormula}
                      </div>
                    )}

                    {/* Director Pro Tip */}
                    <div className="p-4 rounded-xl border border-pink-500/40 bg-pink-950/20 text-xs text-neutral-200 leading-relaxed">
                      <strong className="text-pink-300 font-mono-film uppercase tracking-wider block mb-1">
                        AUTEUR FIELD SECRET:
                      </strong>
                      {selectedLesson.directorProTip}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: VIRTUAL FILMMAKER LAB */}
        {activeTab === 'lab' && (
          <div className="space-y-6">
            {/* Lab Tool Selector Bar */}
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => {
                  soundEngine.playClick();
                  setActiveLabTool('dof');
                }}
                className={`px-4 py-2 rounded-xl border text-xs font-mono-film transition-all ${
                  activeLabTool === 'dof'
                    ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 font-bold '
                    : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
                }`}
              >
                1. DEPTH OF FIELD SIMULATOR
              </button>

              <button
                type="button"
                onClick={() => {
                  soundEngine.playClick();
                  setActiveLabTool('lighting');
                }}
                className={`px-4 py-2 rounded-xl border text-xs font-mono-film transition-all ${
                  activeLabTool === 'lighting'
                    ? 'bg-amber-500/20 border-amber-400 text-amber-300 font-bold '
                    : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
                }`}
              >
                2. 3-POINT & REMBRANDT STUDIO
              </button>

              <button
                type="button"
                onClick={() => {
                  soundEngine.playClick();
                  setActiveLabTool('script');
                }}
                className={`px-4 py-2 rounded-xl border text-xs font-mono-film transition-all ${
                  activeLabTool === 'script'
                    ? 'bg-pink-500/20 border-pink-400 text-pink-300 font-bold '
                    : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
                }`}
              >
                3. SHOOTING SCRIPT ANNOTATOR
              </button>

              <button
                type="button"
                onClick={() => {
                  soundEngine.playClick();
                  setActiveLabTool('shotlist');
                }}
                className={`px-4 py-2 rounded-xl border text-xs font-mono-film transition-all ${
                  activeLabTool === 'shotlist'
                    ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 font-bold '
                    : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
                }`}
              >
                4. SHOT LIST GENERATOR
              </button>
            </div>

            {/* Active Tool Renderer */}
            <div>
              {activeLabTool === 'dof' && <InteractiveDofSimulator />}
              {activeLabTool === 'lighting' && <InteractiveLightingStudio />}
              {activeLabTool === 'script' && <InteractiveScriptBreakdown />}
              {activeLabTool === 'shotlist' && <ShotListGenerator />}
            </div>
          </div>
        )}

        {/* TAB 3: AUTEUR'S LEXICON (100+ TERMS) */}
        {activeTab === 'lexicon' && (
          <div className="space-y-6">
            {/* Search & Category Filter Bar */}
            <div className="p-4 sm:p-5 rounded-2xl bg-neutral-900/60 border border-neutral-800 flex flex-col md:flex-row gap-4 justify-between items-center">
              <div className="relative w-full md:w-80">
                <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search 100+ terms (e.g. Anamorphic, Rembrandt, Kuleshov)..."
                  value={lexiconSearch}
                  onChange={(e) => setLexiconSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-pink-400 font-mono-film"
                />
              </div>

              {/* Category Filter Chips */}
              <div className="flex flex-wrap gap-1.5 w-full md:w-auto">
                {['ALL', 'Camera & Optics', 'Lighting & Grip', 'Directing & Acting', 'Sound & Foley', 'Editing & Post', 'Production & Set'].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => {
                      soundEngine.playClick();
                      setLexiconCategory(cat);
                    }}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-mono-film transition-all ${
                      lexiconCategory === cat
                        ? 'bg-pink-500/20 border border-pink-400 text-pink-300 font-bold'
                        : 'bg-neutral-950 border border-neutral-800 text-neutral-400 hover:text-neutral-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Glossary Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredGlossary.map((g) => (
                <div
                  key={g.term}
                  className="p-4 rounded-xl border border-neutral-800/90 bg-neutral-900/40 hover:bg-neutral-900/80 transition-all flex flex-col justify-between space-y-3 shadow-sm hover:border-pink-500/50"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="text-[9px] font-mono-film uppercase px-2 py-0.5 rounded bg-neutral-800 text-neutral-300">
                        {g.category}
                      </span>
                      {g.phonetic && (
                        <span className="text-[9px] font-mono-film text-neutral-500">
                          /{g.phonetic}/
                        </span>
                      )}
                    </div>

                    <h4 className="text-base font-bold text-white font-cinematic uppercase tracking-wide">
                      {g.term}
                    </h4>

                    {/* Bengali Description */}
                    <div className="text-[11px] text-pink-300/90 font-mono-film mt-0.5">
                      {g.bengaliDef}
                    </div>

                    <p className="text-xs text-neutral-300 font-sans leading-relaxed mt-2">
                      {g.inDepth}
                    </p>
                  </div>

                  {/* Pro Tip Footer */}
                  <div className="pt-2.5 border-t border-neutral-800/80 text-[11px] text-neutral-400 font-sans italic">
                    <strong className="text-pink-400 not-italic font-mono-film uppercase">TIP: </strong>
                    {g.proTip}
                  </div>
                </div>
              ))}
            </div>

            {filteredGlossary.length === 0 && (
              <div className="text-center py-16 text-neutral-500 font-mono-film text-xs">
                No filmmaking terms found matching "{lexiconSearch}".
              </div>
            )}
          </div>
        )}

        {/* TAB 4: PRODUCTION VAULT & TEMPLATES */}
        {activeTab === 'vault' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Template Picker Column */}
              <div className="lg:col-span-4 space-y-2.5">
                <div className="text-[10px] font-mono-film text-neutral-400 uppercase tracking-wider mb-2">
                  Select Production Template:
                </div>
                {PRODUCTION_TEMPLATES.map((tmpl) => {
                  const isCur = selectedTemplate.id === tmpl.id;
                  return (
                    <button
                      key={tmpl.id}
                      type="button"
                      onClick={() => {
                        soundEngine.playClick();
                        setSelectedTemplate(tmpl);
                      }}
                      className={`w-full p-3.5 rounded-xl border text-left transition-all ${
                        isCur
                          ? 'bg-emerald-500/20 border-emerald-400 text-white '
                          : 'bg-neutral-900/50 border-neutral-800 text-neutral-400 hover:border-neutral-700 hover:text-white'
                      }`}
                    >
                      <div className="text-[9px] font-mono-film text-emerald-400 uppercase">
                        {tmpl.category}
                      </div>
                      <div className="text-xs font-bold font-mono-film text-neutral-200 mt-0.5">
                        {tmpl.title}
                      </div>
                      <div className="text-[10px] text-neutral-400 mt-0.5">
                        {tmpl.bengaliTitle}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Template Reader & Download Column */}
              <div className="lg:col-span-8 bg-neutral-900/80 border border-neutral-800 rounded-2xl p-5 sm:p-7 shadow-xl space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-800 pb-4">
                  <div>
                    <div className="text-[10px] font-mono-film text-emerald-400 uppercase">
                      {selectedTemplate.category} // {selectedTemplate.fileSizeEst}
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold font-cinematic text-white uppercase">
                      {selectedTemplate.title}
                    </h3>
                    <div className="text-xs text-neutral-400 font-mono-film">
                      {selectedTemplate.bengaliTitle}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    <button
                      type="button"
                      onClick={() => handleCopyTemplate(selectedTemplate)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-xs font-mono-film text-neutral-200 transition-all"
                    >
                      {copiedTemplateId === selectedTemplate.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5 text-neutral-400" />
                      )}
                      <span>{copiedTemplateId === selectedTemplate.id ? 'COPIED' : 'COPY'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDownloadTemplate(selectedTemplate)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/70 text-xs font-mono-film text-emerald-300 transition-all "
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>DOWNLOAD .TXT</span>
                    </button>
                  </div>
                </div>

                {/* Preformatted Template Box */}
                <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800/90 font-mono-film text-[11px] leading-relaxed text-neutral-300 overflow-x-auto max-h-[480px] select-all whitespace-pre">
                  {selectedTemplate.content}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
