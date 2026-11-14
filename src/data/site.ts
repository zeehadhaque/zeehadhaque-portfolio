import type { FilmProject, FutureProject, NavigationItem, SiteIdentity } from "../types/content";

export const siteIdentity: SiteIdentity = {
  name: "Zeehad Haque",
  birthIdentity: "Zeehad Haque (born Khairul Islam Jihad on 23 July, 2004)",
  roles: "Director · Writer · Cinematographer · Editor",
  location: "Gazipur, Dhaka, Bangladesh",
  email: "zeehadhaque@gmail.com",
  whatsapp: "+8801629851155",
  statement: "I DON'T JUST CAPTURE FRAMES. I CREATE WORLDS.",
  biography: "Zeehad Haque (born Khairul Islam Jihad on 23 July, 2004) is an independent filmmaker from Gazipur, Bangladesh. He writes, directs, shoots and edits stories shaped by psychological tension, visual silence and atmosphere. He is drawn to the moments when framing, movement, light and sound can say what dialogue cannot.",
  creativeFocus: [
    "Psychological suspense & mystery",
    "Visual silence & visual storytelling",
    "Cinematic framing & camera movement",
    "Editing, colour grading & sound design",
  ],
  workingMethod: "I begin with what a scene should make the audience feel. From there, I shape the frame, blocking, movement, available light, edit rhythm and sound until every choice belongs to the story.",
  filmmakingApproach: "My practice is independent and mobile-first: I work with available tools, natural light and real locations, treating constraints as part of the visual language. Every frame, movement, silence and sound cue should earn its place in the story.",
  productionWorkflow: [
    { number: "01", title: "Concept & writing", description: "I turn the central emotion into a visual idea, screenplay, scene structure and practical shot plan." },
    { number: "02", title: "Direction & camera", description: "I shape performance, composition, camera movement, available light and visual continuity around the scene." },
    { number: "03", title: "Editing & rhythm", description: "I build the narrative through shot selection, pacing, transitions, silence and carefully placed sound." },
    { number: "04", title: "Colour & finishing", description: "I refine the image, match shots, shape the atmosphere and prepare the final export." },
  ],
  toolsAndCraft: [
    "Mobile filmmaking — Redmi Note 14 Pro+ 5G",
    "Camera app — Blackmagic Camera",
    "Editing — CapCut",
    "Colour grading & finishing — DaVinci Resolve",
    "Encoding & media workflow — FFmpeg",
    "Sound design — ambience, silence, rhythm and detail",
  ],
  creativeProjects: [
    { title: "SHADOW / III", category: "Psychological thriller · Short film", description: "A psychological and supernatural suspense experiment built around visual silence, repetition, loops and uncertainty.", status: "Short film" },
    { title: "CHAKRA", category: "Silent thriller · Short film", description: "A no-dialogue visual narrative using stillness, location transitions and match-cut thinking to carry the story.", status: "Short film" },
    { title: "TUKRE: THE TRAGIC TERRITORIES", category: "Poetic tragedy · Short film", description: "A personal, introspective piece shaped by memory, fragmented emotion, visual motifs and carefully designed sound.", status: "Short film" },
    { title: "DON'T GO THERE", category: "Mystery · Survival · Action · Psychological suspense", description: "A suspense-driven project introduced through its teaser.", status: "Teaser", href: "https://youtu.be/Zoqn6CyBIzU" },
    { title: "AUTOPSY", category: "Psychological · Supernatural thriller", description: "A morgue-and-corridor setting explored through atmosphere, psychological tension and visual unease.", status: "Teaser / project" },
    { title: "ILLUSION: FACE OF REALITY", category: "Psychological · Double-role concept", description: "A dialogue-free concept exploring duality and the uncertain boundary between perception and reality.", status: "Film concept" },
    { title: "GHURPAK", category: "Dark comedy", description: "A dark-comedy screenplay project.", status: "In development" },
    { title: "WAQT: WHERE WE WERE", category: "Poetic tragedy", description: "A time-and-memory driven screenplay built around aftermath, objects, silence and sound.", status: "Screenplay" },
  ],
};

export const identityPortraitAsset = "/assets/images/profile/zeehad-obsidian-portrait.jpg";
export const portraitAsset = "/assets/images/profile/zeehad-obsidian-portrait.jpg";

export const navigationItems: readonly NavigationItem[] = [
  { label: "Foyer", href: "#foyer" },
  { label: "Screenings", href: "#screening-hall" },
  { label: "Projection", href: "#projection-room" },
  { label: "Suite", href: "#directors-suite" },
  { label: "Institute", href: "#institute" },
];

export const filmProjects: readonly FilmProject[] = [
  {
    id: "film-01",
    title: null,
    label: "Watch film",
    sourceUrl: "https://youtu.be/zBJNLNok3Pc",
    videoId: "zBJNLNok3Pc",
  },
  {
    id: "film-02",
    title: null,
    label: "Watch film",
    sourceUrl: "https://youtu.be/O88euzMxskQ",
    videoId: "O88euzMxskQ",
  },
  {
    id: "film-03",
    title: null,
    label: "Watch film",
    sourceUrl: "https://youtu.be/ZSttExMBavg",
    videoId: "ZSttExMBavg",
  },
  {
    id: "film-04",
    title: null,
    label: "Watch film",
    sourceUrl: "https://youtu.be/jcZx3QuT16g",
    videoId: "jcZx3QuT16g",
  },
  {
    id: "film-05",
    title: null,
    label: "Watch film",
    sourceUrl: "https://youtu.be/qeRZNvjSX8U",
    videoId: "qeRZNvjSX8U",
  },
  {
    id: "film-06",
    title: null,
    label: "Watch film",
    sourceUrl: "https://youtu.be/I11_0aB_IOM",
    videoId: "I11_0aB_IOM",
  },
  {
    id: "film-07",
    title: null,
    label: "Watch film",
    sourceUrl: "https://youtube.com/shorts/Yj6-Iyc3u3Q",
    videoId: "Yj6-Iyc3u3Q",
    isShort: true,
  },
  {
    id: "film-08",
    title: "Don't Go There — Teaser",
    label: "Watch teaser",
    sourceUrl: "https://youtu.be/Zoqn6CyBIzU",
    videoId: "Zoqn6CyBIzU",
  },
];

export const futureProjects: readonly FutureProject[] = [
  { title: "GHURPAK", genre: "Psychological Thriller + Comedy" },
  { title: "ONUSONDHAN", genre: "Thriller Mystery / Comedy" },
  { title: "SESH BIKEL: THE LAST MEETUP", genre: "Coming-of-Age Friendship Comedy Drama" },
  { title: "SHYAMOL DEEP", genre: "Slice-of-Life Friendship Adventure Drama" },
  { title: "PROTIDDHONI", genre: "Literary Psychological Drama" },
  { title: "নক্ষত্রের ওপারে", genre: "Psychological Mystery / Supernatural" },
  { title: "ওই বাড়িটার সামনে যেও না", genre: "Mystery / Survival / Action / Psychological Suspense" },
  { title: "AUTOPSY", genre: "Thriller" },
];

export const academyFeatures = [
  "Bangla / English language switching",
  "Filmmaking learning roadmap",
  "30-day learning program",
  "XP and ranks",
  "Lessons and examinations",
  "Cine-Arcade",
  "Interactive learning",
  "Admin-controlled entitlements",
] as const;

export const zeeWelcome =
  "Yo 👋 ami ZEE — Zeehad-er website assistant. Ki jante chaccho? Film, story, cinematography, behind-the-scenes… ba emni golpo o kora jabe 😌";
