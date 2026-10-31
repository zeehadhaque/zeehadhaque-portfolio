export interface CreativeInterestItem {
  id: string;
  label: string;
  desc: string;
}

export const creativeInterests: CreativeInterestItem[] = [
  { id: 'cinematography', label: 'CINEMATOGRAPHY', desc: 'Composition, light ratio & anamorphic framing' },
  { id: 'visual-storytelling', label: 'VISUAL STORYTELLING', desc: 'Narrative told through camera motion & silence' },
  { id: 'psychological-thriller', label: 'PSYCHOLOGICAL THRILLER', desc: 'Inner dread, paranoiac loops & sensory distortion' },
  { id: 'mystery', label: 'MYSTERY', desc: 'Atmospheric ambiguity & existential enigmas' },
  { id: 'cinematic-shorts', label: 'CINEMATIC SHORT FILMS', desc: 'High-density auteur visual projects' },
  { id: 'directing', label: 'DIRECTING', desc: 'Visual rhythm, actor blocking & mood orchestration' },
  { id: 'writing', label: 'WRITING', desc: 'Character-driven screenplays & dream logic structures' },
  { id: 'atmospheric-filmmaking', label: 'ATMOSPHERIC FILMMAKING', desc: 'Rain, night, silence, memory & space' },
  { id: 'experimental-visuals', label: 'EXPERIMENTAL VISUALS', desc: 'Mobile-first sensor limits pushed to cinematic extremes' },
];
