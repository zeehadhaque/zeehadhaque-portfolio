export interface RegisteredLink {
  id: string;
  displayName: string;
  exactUrl: string;
  category: "contact" | "social" | "film" | "portfolio" | "institute" | "code" | "legacy" | "internal";
  isExternal: boolean;
  openBehavior: "_blank" | "_self";
  associatedProject?: string;
  description?: string;
}

export const linkRegistry: readonly RegisteredLink[] = [
  // Contact & Inquiries
  {
    id: "contact-email-primary",
    displayName: "Professional Email",
    exactUrl: "mailto:zeehadhaque@gmail.com",
    category: "contact",
    isExternal: true,
    openBehavior: "_blank",
    description: "Official professional email address for production, directing, and writing inquiries."
  },
  {
    id: "contact-email-action",
    displayName: "Email Zeehad",
    exactUrl: "mailto:zeehadhaque@gmail.com",
    category: "contact",
    isExternal: true,
    openBehavior: "_blank",
    description: "Direct mailto action for personal and studio communications."
  },
  {
    id: "contact-whatsapp-primary",
    displayName: "WhatsApp",
    exactUrl: "https://wa.me/8801629851155",
    category: "contact",
    isExternal: true,
    openBehavior: "_blank",
    description: "Direct WhatsApp business communication channel (+880 1629-851155)."
  },
  {
    id: "contact-whatsapp-inquiry",
    displayName: "WhatsApp Inquiry",
    exactUrl: "https://wa.me/8801629851155",
    category: "contact",
    isExternal: true,
    openBehavior: "_blank",
    description: "Fast-response WhatsApp messaging for film collaborations and bookings."
  },
  {
    id: "contact-section",
    displayName: "Contact",
    exactUrl: "#contact",
    category: "internal",
    isExternal: false,
    openBehavior: "_self",
    description: "Internal jump link to direct contact and transmission portal."
  },

  // IMDb & Industry Credentialing
  {
    id: "imdb-shadow-iii",
    displayName: "IMDb — SHADOW / III",
    exactUrl: "https://www.imdb.com/title/tt50571306/",
    category: "film",
    isExternal: true,
    openBehavior: "_blank",
    associatedProject: "SHADOW / III",
    description: "Official IMDb title page for SHADOW / III (2026)."
  },
  {
    id: "imdb-profile",
    displayName: "IMDb Profile",
    exactUrl: "https://www.imdb.com/name/nm19082308/",
    category: "film",
    isExternal: true,
    openBehavior: "_blank",
    description: "Official IMDb name profile for filmmaker Zeehad Haque (nm19082308)."
  },
  {
    id: "imdb-contributor",
    displayName: "IMDb Contributor Profile",
    exactUrl: "https://www.imdb.com/user/p.gtnf5csbffkwzrbmsvkfa2pssm",
    category: "film",
    isExternal: true,
    openBehavior: "_blank",
    description: "IMDb contributor profile verification ID."
  },
  {
    id: "letterboxd-profile",
    displayName: "Letterboxd Director Profile",
    exactUrl: "https://letterboxd.com/director/zeehad-haque/",
    category: "film",
    isExternal: true,
    openBehavior: "_blank",
    description: "Official Letterboxd director profile for Zeehad Haque."
  },
  {
    id: "tmdb-profile",
    displayName: "The Movie Database (TMDb)",
    exactUrl: "https://www.themoviedb.org/person/6603477-zeehad-haque",
    category: "film",
    isExternal: true,
    openBehavior: "_blank",
    description: "Verified TMDb filmmaker profile."
  },
  {
    id: "moviefone-profile",
    displayName: "Moviefone Celebrity Profile",
    exactUrl: "https://www.moviefone.com/celebrity/zeehad-haque/MOhuPZ93XNEPeyMAzAhNn4/main/",
    category: "film",
    isExternal: true,
    openBehavior: "_blank",
    description: "Moviefone celebrity database listing for Zeehad Haque."
  },
  {
    id: "filmfreeway-profile",
    displayName: "FilmFreeway Profile",
    exactUrl: "https://filmfreeway.com/ZeehadHaque",
    category: "film",
    isExternal: true,
    openBehavior: "_blank",
    description: "Official FilmFreeway filmmaker portal for festival submissions."
  },
  {
    id: "wikidata-entry",
    displayName: "Wikidata Entity",
    exactUrl: "https://www.wikidata.org/wiki/Q142020060",
    category: "film",
    isExternal: true,
    openBehavior: "_blank",
    description: "Structured Wikidata knowledge graph entity (Q142020060)."
  },
  {
    id: "instagram-profile",
    displayName: "Instagram (@heyyfalgun)",
    exactUrl: "https://www.instagram.com/heyyfalgun/",
    category: "social",
    isExternal: true,
    openBehavior: "_blank",
    description: "Personal Instagram visual diary and photography stream."
  },
  {
    id: "youtube-channel",
    displayName: "Official YouTube Channel",
    exactUrl: "https://www.youtube.com/@zeehadhaque",
    category: "social",
    isExternal: true,
    openBehavior: "_blank",
    description: "Official YouTube filmmaker channel (@zeehadhaque)."
  },

  // Portfolios & Repositories
  {
    id: "legacy-portfolio",
    displayName: "Legacy Portfolio",
    exactUrl: "https://zeehadhaque.zeehadhaque.workers.dev/",
    category: "legacy",
    isExternal: true,
    openBehavior: "_blank",
    description: "Cloudflare Workers production release and previous live site archive."
  },
  {
    id: "github-current-repo",
    displayName: "Current GitHub Repository",
    exactUrl: "https://github.com/zeehadhaque/zeehadhaque-portfolio",
    category: "code",
    isExternal: true,
    openBehavior: "_blank",
    description: "Authoritative active GitHub repository source for the portfolio project."
  },
  {
    id: "github-older-repo",
    displayName: "Older GitHub Repository",
    exactUrl: "https://github.com/zeehad-haque/zeehad-portfolio",
    category: "legacy",
    isExternal: true,
    openBehavior: "_blank",
    description: "Historical repository reference preserved from Content Bible audit."
  },

  // Core Film & Video Action Links
  {
    id: "action-watch-full-film",
    displayName: "Watch Full Film",
    exactUrl: "https://youtu.be/ZSttExMBavg",
    category: "film",
    isExternal: true,
    openBehavior: "_blank",
    associatedProject: "SHADOW / III",
    description: "Stream the complete released short film SHADOW / III (7m 21s)."
  },
  {
    id: "action-watch-teaser",
    displayName: "Watch Teaser",
    exactUrl: "https://youtu.be/Zoqn6CyBIzU",
    category: "film",
    isExternal: true,
    openBehavior: "_blank",
    associatedProject: "DON'T GO THERE",
    description: "Watch the official title teaser for DON'T GO THERE / ওই বাড়িটার সামনে যেও না."
  },
  {
    id: "video-reflect-1",
    displayName: "REFLECT — Part 1 (Short Film)",
    exactUrl: "https://youtu.be/I11_0aB_IOM",
    category: "film",
    isExternal: true,
    openBehavior: "_blank",
    associatedProject: "REFLECT",
    description: "REFLECT | Psychological Short Film (Part 1)."
  },
  {
    id: "video-reflect-2",
    displayName: "REFLECT — Part 2 (Short Film)",
    exactUrl: "https://youtu.be/qeRZNvjSX8U",
    category: "film",
    isExternal: true,
    openBehavior: "_blank",
    associatedProject: "REFLECT",
    description: "REFLECT | Psychological Short Film (Part 2)."
  },
  {
    id: "video-shadow-trailer",
    displayName: "SHADOW / III — Official Trailer",
    exactUrl: "https://youtu.be/jcZx3QuT16g",
    category: "film",
    isExternal: true,
    openBehavior: "_blank",
    associatedProject: "SHADOW / III",
    description: "SHADOW / III - Official Trailer | A Silent Psychological Thriller."
  },
  {
    id: "video-flow-myst",
    displayName: "FLOW : THE MYST — Announcement Teaser",
    exactUrl: "https://youtu.be/O88euzMxskQ",
    category: "film",
    isExternal: true,
    openBehavior: "_blank",
    associatedProject: "FLOW : THE MYST",
    description: "FLOW : THE MYST | Official Announcement Teaser | A New Cinematic Experience."
  },
  {
    id: "video-autopsy",
    displayName: "AUTOPSY — Official Teaser",
    exactUrl: "https://youtu.be/zBJNLNok3Pc",
    category: "film",
    isExternal: true,
    openBehavior: "_blank",
    associatedProject: "AUTOPSY",
    description: "AUTOPSY | Official Teaser | A Psychological Thriller Short Film."
  },
  {
    id: "video-shorts-lost",
    displayName: "YouTube Shorts — Lost",
    exactUrl: "https://youtube.com/shorts/Yj6-Iyc3u3Q",
    category: "film",
    isExternal: true,
    openBehavior: "_blank",
    associatedProject: "Lost",
    description: "📽️Lost #shorts #psychologicalthriller #suspense #cinematic."
  },

  // Internal Spatial Navigation & Feature Portals
  {
    id: "nav-foyer",
    displayName: "Grand Foyer",
    exactUrl: "#foyer",
    category: "internal",
    isExternal: false,
    openBehavior: "_self",
    description: "Arrival chamber and monumental mechanical architecture entrance."
  },
  {
    id: "nav-monoliths",
    displayName: "Crystalline Monoliths",
    exactUrl: "#monoliths",
    category: "internal",
    isExternal: false,
    openBehavior: "_self",
    description: "Spatial 3D gallery of cinematic disciplines and auteur works."
  },
  {
    id: "nav-screenings",
    displayName: "Screening Hall",
    exactUrl: "#screenings",
    category: "internal",
    isExternal: false,
    openBehavior: "_self",
    description: "High-fidelity cinema auditorium featuring all eight video archives."
  },
  {
    id: "nav-directors-suite",
    displayName: "Director's Suite",
    exactUrl: "#directors-suite",
    category: "internal",
    isExternal: false,
    openBehavior: "_self",
    description: "Editorial workspace detailing camera craft, color grading, and workflow."
  },
  {
    id: "nav-writers-room",
    displayName: "Writer's Room",
    exactUrl: "#writers-room",
    category: "internal",
    isExternal: false,
    openBehavior: "_self",
    description: "Narrative incubator housing the eight active in-development screenplays."
  },
  {
    id: "nav-institute",
    displayName: "Filmmaking Institute",
    exactUrl: "#institute",
    category: "institute",
    isExternal: false,
    openBehavior: "_self",
    description: "Comprehensive 30-day interactive filmmaking curriculum, XP, and Cine-Arcade."
  },
  {
    id: "nav-zee-core",
    displayName: "ZEE AI Assistant",
    exactUrl: "#zee-core",
    category: "internal",
    isExternal: false,
    openBehavior: "_self",
    description: "Conversational cinematic AI intelligence trained on Zeehad's methods."
  },
  {
    id: "nav-grand-exit",
    displayName: "Grand Exit",
    exactUrl: "#exit",
    category: "internal",
    isExternal: false,
    openBehavior: "_self",
    description: "Closing spatial portal with direct communication channels."
  },
  {
    id: "route-inbox-private",
    displayName: "Private Inbox",
    exactUrl: "/inbox",
    category: "internal",
    isExternal: false,
    openBehavior: "_self",
    description: "Protected administrative client route with authenticated Supabase backend."
  }
];

export function getLinkById(id: string): RegisteredLink | undefined {
  return linkRegistry.find(link => link.id === id);
}

export function getLinksByCategory(category: RegisteredLink["category"]): RegisteredLink[] {
  return linkRegistry.filter(link => link.category === category);
}
