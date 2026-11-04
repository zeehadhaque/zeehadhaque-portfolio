import type { FilmProject, FutureProject, NavigationItem, SiteIdentity } from "../types/content";

export const siteIdentity: SiteIdentity = {
  name: "Zeehad Haque",
  roles: "Director · Writer · Cinematographer · Editor",
  location: "Gazipur, Dhaka, Bangladesh",
  email: "zeehadhaque@gmail.com",
  whatsapp: "+8801629851155",
  statement: "I DON'T JUST CAPTURE FRAMES. I CREATE WORLDS.",
};

export const portraitAsset = "/assets/images/profile/haque-portrait.webp";

export const navigationItems: readonly NavigationItem[] = [
  { label: "Home", href: "#home" },
  { label: "On Set", href: "#on-set" },
  { label: "Off Set", href: "#off-set" },
  { label: "Films", href: "#films" },
  { label: "Frame Archive", href: "#frame-archive" },
  { label: "Projects", href: "#projects" },
  { label: "Academy", href: "#academy" },
  { label: "Contact", href: "#contact" },
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
