export interface YouTubeFilm {
  id: string;
  youtubeUrl: string;
  embedUrl: string;
  thumbnail: string;
  thumbnailFallback: string;
  title: string;
  authorName: string;
  docketNumber: string;
  docketTitle: string;
  year: string;
  duration: string;
  aspectRatio: string;
  genre: string;
  role: string;
  synopsis: string;
}

/**
 * Authoritative 6 YouTube film dockets for Zeehad Haque.
 * Verified directly from YouTube oEmbed and creator sources.
 *
 * Canonical YouTube IDs:
 * 1. I11_0aB_IOM
 * 2. qeRZNvjSX8U
 * 3. ZSttExMBavg
 * 4. O88euzMxskQ
 * 5. zBJNLNok3Pc
 * 6. zdG0BPJ_7FA
 */
export const YOUTUBE_FILMS: YouTubeFilm[] = [
  {
    id: 'I11_0aB_IOM',
    youtubeUrl: 'https://youtu.be/I11_0aB_IOM',
    embedUrl: 'https://www.youtube-nocookie.com/embed/I11_0aB_IOM',
    thumbnail: 'https://i.ytimg.com/vi/I11_0aB_IOM/maxresdefault.jpg',
    thumbnailFallback: 'https://i.ytimg.com/vi/I11_0aB_IOM/hqdefault.jpg',
    title: 'REFLECT | Psychological Short Film (Part 1)',
    authorName: 'Zeehad Haque',
    docketNumber: 'DOCKET 01',
    docketTitle: 'রেফ্লেক্ট ১ (Reflect 1)',
    year: '2024',
    duration: '6m 45s',
    aspectRatio: '2.39:1',
    genre: 'Psychological Thriller · Time Loop',
    role: 'Writer, Director, Cinematographer & Editor',
    synopsis:
      'A chilling psychological experiment where a lone protagonist awakens inside an inescapable temporal paradox—discovering that his reflection in every mirror is acting seconds ahead of reality.',
  },
  {
    id: 'qeRZNvjSX8U',
    youtubeUrl: 'https://youtu.be/qeRZNvjSX8U',
    embedUrl: 'https://www.youtube-nocookie.com/embed/qeRZNvjSX8U',
    thumbnail: 'https://i.ytimg.com/vi/qeRZNvjSX8U/maxresdefault.jpg',
    thumbnailFallback: 'https://i.ytimg.com/vi/qeRZNvjSX8U/hqdefault.jpg',
    title: 'REFLECT | Psychological Short Film (Part 2)',
    authorName: 'Zeehad Haque',
    docketNumber: 'DOCKET 02',
    docketTitle: 'রেফ্লেক্ট ২ (Reflect 2)',
    year: '2024',
    duration: '8m 12s',
    aspectRatio: '2.39:1',
    genre: 'Psychological Thriller · Time Loop',
    role: 'Writer, Director, Cinematographer & Editor',
    synopsis:
      'The terrifying continuation of the time loop paradox. As multiple timelines bleed into one another, the protagonist must race against decaying temporal echoes before consciousness shatters permanently.',
  },
  {
    id: 'ZSttExMBavg',
    youtubeUrl: 'https://youtu.be/ZSttExMBavg',
    embedUrl: 'https://www.youtube-nocookie.com/embed/ZSttExMBavg',
    thumbnail: 'https://i.ytimg.com/vi/ZSttExMBavg/maxresdefault.jpg',
    thumbnailFallback: 'https://i.ytimg.com/vi/ZSttExMBavg/hqdefault.jpg',
    title: 'SHADOW | Psychological Thriller Short Film | Sihab Islam, Siam Islam, Zeehad Haque',
    authorName: 'Zeehad Haque',
    docketNumber: 'DOCKET 03',
    docketTitle: 'ছায়া / ৩ (Shadow / III)',
    year: '2025',
    duration: '7m 21s',
    aspectRatio: '2.39:1',
    genre: 'Psychological Thriller · Dream Loop',
    role: 'Writer, Director, Cinematographer & Editor',
    synopsis:
      'A psychological descent where reality, fear, dreams, and optical perception fracture into an endless recursive loop. A solitary individual trapped in architectural purgatory discovers that the shadows in the corridor move with an independent rhythm.',
  },
  {
    id: 'O88euzMxskQ',
    youtubeUrl: 'https://youtu.be/O88euzMxskQ',
    embedUrl: 'https://www.youtube-nocookie.com/embed/O88euzMxskQ',
    thumbnail: 'https://i.ytimg.com/vi/O88euzMxskQ/maxresdefault.jpg',
    thumbnailFallback: 'https://i.ytimg.com/vi/O88euzMxskQ/hqdefault.jpg',
    title: 'FLOW : THE MYST | Official Announcement Teaser | A New Cinematic Experience | Zeehad Haque',
    authorName: 'Zeehad Haque',
    docketNumber: 'DOCKET 04',
    docketTitle: 'ঘুরপাক (GHURPAK)',
    year: '2024',
    duration: '21m 15s',
    aspectRatio: '2.00:1',
    genre: 'Psychological Dark Comedy',
    role: 'Director, Co-Writer & Editor',
    synopsis:
      'An unexpected mishap during an illicit high-stakes negotiation in Old Dhaka sets off a dizzying cycle of paranoia, frantic cover-ups, and absurd moral rationalizations among three desperate conspirators.',
  },
  {
    id: 'zBJNLNok3Pc',
    youtubeUrl: 'https://youtu.be/zBJNLNok3Pc',
    embedUrl: 'https://www.youtube-nocookie.com/embed/zBJNLNok3Pc',
    thumbnail: 'https://i.ytimg.com/vi/zBJNLNok3Pc/maxresdefault.jpg',
    thumbnailFallback: 'https://i.ytimg.com/vi/zBJNLNok3Pc/hqdefault.jpg',
    title: 'AUTOPSY | Official Teaser | A Psychological Thriller Short Film',
    authorName: 'Zeehad Haque',
    docketNumber: 'DOCKET 05',
    docketTitle: 'অনুসন্ধান (Anusandhan) / AUTOPSY',
    year: '2025',
    duration: '12m 40s',
    aspectRatio: '2.00:1',
    genre: 'Psychological Thriller · Clinical Noir',
    role: 'Writer, Director & Editor',
    synopsis:
      'An obsessive amateur investigator looking into a routine neighborhood disappearance stumbles into a web of bizarre coincidences, deadpan encounters, and escalating psychological absurdity.',
  },
  {
    id: 'zdG0BPJ_7FA',
    youtubeUrl: 'https://youtu.be/zdG0BPJ_7FA',
    embedUrl: 'https://www.youtube-nocookie.com/embed/zdG0BPJ_7FA',
    thumbnail: 'https://i.ytimg.com/vi/zdG0BPJ_7FA/maxresdefault.jpg',
    thumbnailFallback: 'https://i.ytimg.com/vi/zdG0BPJ_7FA/hqdefault.jpg',
    title: 'ILLUSION — Official Title Track | Zeehad Haque | Upcoming Short Film',
    authorName: 'Zeehad Haque',
    docketNumber: 'DOCKET 06',
    docketTitle: 'ইল্যুশন (Illusion / Face of Reality)',
    year: '2025',
    duration: '6m 10s',
    aspectRatio: '2.39:1',
    genre: 'Psychological Mystery · Atmospheric Soundscape',
    role: 'Writer, Director & Sound Designer',
    synopsis:
      'Visual and auditory distortions collide at the threshold of waking reality. An atmospheric exploration of sound and subjective camera perception along riverside terrain.',
  },
];
