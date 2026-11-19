export interface VideoRecord {
  id: string;
  videoId: string;
  originalTitle: string;
  displayTitle: string;
  genre: string;
  contentType:
    | "Full Film"
    | "Released Short Film"
    | "Part 1"
    | "Part 2"
    | "Trailer"
    | "Teaser"
    | "Announcement"
    | "Title Teaser"
    | "YouTube Shorts";
  projectStatus: string;
  thumbnail: string;
  officialThumbUrl: string;
  videoUrl: string;
  embedUrl: string;
  description: string;
  runtime: string;
  year: string;
  projectName: string;
  isShort?: boolean;
}

export const videoArchive: readonly VideoRecord[] = [
  {
    id: "video-01",
    videoId: "I11_0aB_IOM",
    originalTitle: "REFLECT | Psychological Short Film (Part 1)",
    displayTitle: "REFLECT — Part 1",
    genre: "Psychological Thriller / Short Film",
    contentType: "Part 1",
    projectStatus: "Released Short Film",
    thumbnail: "/assets/images/youtube-thumbnails/I11_0aB_IOM.jpg",
    officialThumbUrl: "https://i.ytimg.com/vi/I11_0aB_IOM/hqdefault.jpg",
    videoUrl: "https://youtu.be/I11_0aB_IOM?si=c0L-vx0YfwERI-18",
    embedUrl: "https://www.youtube-nocookie.com/embed/I11_0aB_IOM?rel=0&modestbranding=1",
    description: "An atmospheric exploration of psychological reflection and internal fractures. Part 1 examines sensory stillness, isolation, and unsaid tensions through deliberate frame pacing.",
    runtime: "Short Film",
    year: "2024",
    projectName: "REFLECT — PART 1"
  },
  {
    id: "video-02",
    videoId: "qeRZNvjSX8U",
    originalTitle: "REFLECT | Psychological Short Film (Part 2)",
    displayTitle: "REFLECT — Part 2",
    genre: "Psychological Thriller / Short Film",
    contentType: "Part 2",
    projectStatus: "Released Short Film",
    thumbnail: "/assets/images/youtube-thumbnails/qeRZNvjSX8U.jpg",
    officialThumbUrl: "https://i.ytimg.com/vi/qeRZNvjSX8U/hqdefault.jpg",
    videoUrl: "https://youtu.be/qeRZNvjSX8U?si=Se7qnXziqkUvvjmS",
    embedUrl: "https://www.youtube-nocookie.com/embed/qeRZNvjSX8U?rel=0&modestbranding=1",
    description: "The concluding chapter of REFLECT. Deepening perceptual instability and auditory dissonance culminate in a study of identity confrontation.",
    runtime: "Short Film",
    year: "2024",
    projectName: "REFLECT — PART 2"
  },
  {
    id: "video-03",
    videoId: "jcZx3QuT16g",
    originalTitle: "SHADOW / III - Official Trailer | A Silent Psychological Thriller",
    displayTitle: "SHADOW / III — Official Trailer",
    genre: "Silent Psychological Thriller",
    contentType: "Trailer",
    projectStatus: "Official Trailer",
    thumbnail: "/assets/images/youtube-thumbnails/jcZx3QuT16g.jpg",
    officialThumbUrl: "https://i.ytimg.com/vi/jcZx3QuT16g/hqdefault.jpg",
    videoUrl: "https://youtu.be/jcZx3QuT16g?si=CcQK9ry5xI-Px1Fj",
    embedUrl: "https://www.youtube-nocookie.com/embed/jcZx3QuT16g?rel=0&modestbranding=1",
    description: "Official atmospheric trailer for SHADOW / III. Introducing the claustrophobic corridors, silent dread, and temporal disorientation of the film.",
    runtime: "Trailer",
    year: "2025",
    projectName: "SHADOW / III"
  },
  {
    id: "video-04",
    videoId: "ZSttExMBavg",
    originalTitle: "SHADOW / III | Psychological Horror Thriller Short Film | Sihab Islam, Siam Islam, Zeehad Haque",
    displayTitle: "SHADOW / III (2026)",
    genre: "Psychological Thriller / Suspense / Supernatural Horror",
    contentType: "Released Short Film",
    projectStatus: "Released Short Film",
    thumbnail: "/assets/images/youtube-thumbnails/ZSttExMBavg.jpg",
    officialThumbUrl: "https://i.ytimg.com/vi/ZSttExMBavg/hqdefault.jpg",
    videoUrl: "https://youtu.be/ZSttExMBavg?si=th3wkBoBC-RVZ-wS",
    embedUrl: "https://www.youtube-nocookie.com/embed/ZSttExMBavg?rel=0&modestbranding=1",
    description: "3 Loops. 3 Illusions. 3 Confusions. A psychological and supernatural suspense narrative structured around time loops, eerie corridors, and visual stillness.",
    runtime: "7m 21s",
    year: "2026",
    projectName: "SHADOW / III"
  },
  {
    id: "video-05",
    videoId: "O88euzMxskQ",
    originalTitle: "FLOW : THE MYST | Official Announcement Teaser | A New Cinematic Experience | Zeehad Haque",
    displayTitle: "FLOW : THE MYST",
    genre: "Cinematic Experience / Mystery",
    contentType: "Announcement",
    projectStatus: "Announcement Teaser",
    thumbnail: "/assets/images/youtube-thumbnails/O88euzMxskQ.jpg",
    officialThumbUrl: "https://i.ytimg.com/vi/O88euzMxskQ/hqdefault.jpg",
    videoUrl: "https://youtu.be/O88euzMxskQ?si=fFpSKrfTsNs0hHBS",
    embedUrl: "https://www.youtube-nocookie.com/embed/O88euzMxskQ?rel=0&modestbranding=1",
    description: "Official announcement teaser unveiling FLOW : THE MYST, introducing ambient fog aesthetics and fluid cinematic motion.",
    runtime: "Teaser",
    year: "2025",
    projectName: "FLOW : THE MYST"
  },
  {
    id: "video-06",
    videoId: "zBJNLNok3Pc",
    originalTitle: "AUTOPSY | Official Teaser | A Psychological Thriller Short Film",
    displayTitle: "AUTOPSY — Official Teaser",
    genre: "Psychological Thriller Short Film",
    contentType: "Teaser",
    projectStatus: "In Development / Teaser",
    thumbnail: "/assets/images/youtube-thumbnails/zBJNLNok3Pc.jpg",
    officialThumbUrl: "https://i.ytimg.com/vi/zBJNLNok3Pc/hqdefault.jpg",
    videoUrl: "https://youtu.be/zBJNLNok3Pc?si=WfoE0v9Uhe6aOgVx",
    embedUrl: "https://www.youtube-nocookie.com/embed/zBJNLNok3Pc?rel=0&modestbranding=1",
    description: "Official teaser for AUTOPSY: A morgue-and-corridor setting explored through silence, sterile lighting, and growing psychological dread.",
    runtime: "Teaser",
    year: "2025",
    projectName: "AUTOPSY"
  },
  {
    id: "video-07",
    videoId: "Yj6-Iyc3u3Q",
    originalTitle: "📽️Lost #shorts #psychologicalthriller #suspense #cinematic #shortfilm #psychological",
    displayTitle: "Lost (Mobile Cinematic Short)",
    genre: "Psychological Thriller / Suspense",
    contentType: "YouTube Shorts",
    projectStatus: "Released Short-Form",
    thumbnail: "/assets/images/youtube-thumbnails/Yj6-Iyc3u3Q.jpg",
    officialThumbUrl: "https://i.ytimg.com/vi/Yj6-Iyc3u3Q/hqdefault.jpg",
    videoUrl: "https://youtube.com/shorts/Yj6-Iyc3u3Q?si=Ni0mPx97Y2AlFovx",
    embedUrl: "https://www.youtube-nocookie.com/embed/Yj6-Iyc3u3Q?rel=0&modestbranding=1",
    description: "A vertical cinematic format study. Minimalist framing capturing acute isolation and nocturnal suspense.",
    runtime: "Shorts",
    year: "2025",
    projectName: "Lost",
    isShort: true
  },
  {
    id: "video-08",
    videoId: "Zoqn6CyBIzU",
    originalTitle: "ওই বাড়িটার সামনে যেও না | DON'T GO THERE — Title Teaser | Psychological Mystery Thriller",
    displayTitle: "DON'T GO THERE / ওই বাড়িটার সামনে যেও না",
    genre: "Mystery / Survival / Action / Psychological Suspense",
    contentType: "Title Teaser",
    projectStatus: "Upcoming Film / Teaser",
    thumbnail: "/assets/images/youtube-thumbnails/Zoqn6CyBIzU.jpg",
    officialThumbUrl: "https://i.ytimg.com/vi/Zoqn6CyBIzU/hqdefault.jpg",
    videoUrl: "https://youtu.be/Zoqn6CyBIzU?si=mXwE0fLr-A8oMK3A",
    embedUrl: "https://www.youtube-nocookie.com/embed/Zoqn6CyBIzU?rel=0&modestbranding=1",
    description: "Official title teaser for the upcoming survival and psychological suspense film, set around an abandoned perimeter where curiosity turns dangerous.",
    runtime: "Teaser",
    year: "2026",
    projectName: "DON'T GO THERE / ওই বাড়িটার সামনে যেও না"
  }
];

export function getVideoById(id: string): VideoRecord | undefined {
  return videoArchive.find(v => v.id === id || v.videoId === id);
}
