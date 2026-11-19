# Video Metadata Audit — Complete Eight-Video Registry
**Auteur:** Zeehad Haque  
**Audit Timestamp:** 2026-11-20T01:02:00+06:00  
**Verification Method:** Official YouTube oEmbed Metadata API + Local Asset Extraction + Headless Browser Verification

---

## 1. Verified Video Audit Table

| # | Video ID | Exact Original YouTube Title | Verified Display Title | Verified Genre | Content Type | Thumbnail Source | Original Video URL | Embed URL | Verification Status |
|---|---|---|---|---|---|---|---|---|---|
| **01** | `I11_0aB_IOM` | REFLECT \| Psychological Short Film (Part 1) | REFLECT — Part 1 | Psychological Thriller / Short Film | Part 1 | `public/assets/images/youtube-thumbnails/I11_0aB_IOM.jpg` | https://youtu.be/I11_0aB_IOM | `https://www.youtube-nocookie.com/embed/I11_0aB_IOM` | **VERIFIED (Active)** |
| **02** | `qeRZNvjSX8U` | REFLECT \| Psychological Short Film (Part 2) | REFLECT — Part 2 | Psychological Thriller / Short Film | Part 2 | `public/assets/images/youtube-thumbnails/qeRZNvjSX8U.jpg` | https://youtu.be/qeRZNvjSX8U | `https://www.youtube-nocookie.com/embed/qeRZNvjSX8U` | **VERIFIED (Active)** |
| **03** | `jcZx3QuT16g` | SHADOW / III - Official Trailer \| A Silent Psychological Thriller | SHADOW / III — Official Trailer | Silent Psychological Thriller | Trailer | `public/assets/images/youtube-thumbnails/jcZx3QuT16g.jpg` | https://youtu.be/jcZx3QuT16g | `https://www.youtube-nocookie.com/embed/jcZx3QuT16g` | **VERIFIED (Active)** |
| **04** | `ZSttExMBavg` | SHADOW / III \| Psychological Horror Thriller Short Film \| Sihab Islam, Siam Islam, Zeehad Haque | SHADOW / III (2026) | Psychological Thriller / Suspense / Supernatural Horror | Released Short Film | `public/assets/images/youtube-thumbnails/ZSttExMBavg.jpg` | https://youtu.be/ZSttExMBavg | `https://www.youtube-nocookie.com/embed/ZSttExMBavg` | **VERIFIED (Active)** |
| **05** | `O88euzMxskQ` | FLOW : THE MYST \| Official Announcement Teaser \| A New Cinematic Experience \| Zeehad Haque | FLOW : THE MYST | Cinematic Experience / Mystery | Announcement | `public/assets/images/youtube-thumbnails/O88euzMxskQ.jpg` | https://youtu.be/O88euzMxskQ | `https://www.youtube-nocookie.com/embed/O88euzMxskQ` | **VERIFIED (Active)** |
| **06** | `zBJNLNok3Pc` | AUTOPSY \| Official Teaser \| A Psychological Thriller Short Film | AUTOPSY — Official Teaser | Psychological Thriller Short Film | Teaser | `public/assets/images/youtube-thumbnails/zBJNLNok3Pc.jpg` | https://youtu.be/zBJNLNok3Pc | `https://www.youtube-nocookie.com/embed/zBJNLNok3Pc` | **VERIFIED (Active)** |
| **07** | `Yj6-Iyc3u3Q` | 📽️Lost #shorts #psychologicalthriller #suspense #cinematic #shortfilm #psychological | Lost (Mobile Cinematic Short) | Psychological Thriller / Suspense | YouTube Shorts | `public/assets/images/youtube-thumbnails/Yj6-Iyc3u3Q.jpg` | https://youtube.com/shorts/Yj6-Iyc3u3Q | `https://www.youtube-nocookie.com/embed/Yj6-Iyc3u3Q` | **VERIFIED (Active)** |
| **08** | `Zoqn6CyBIzU` | ওই বাড়িটার সামনে যেও না \| DON'T GO THERE — Title Teaser \| Psychological Mystery Thriller | DON'T GO THERE / ওই বাড়িটার সামনে যেও না | Mystery / Survival / Action / Psychological Suspense | Title Teaser | `public/assets/images/youtube-thumbnails/Zoqn6CyBIzU.jpg` | https://youtu.be/Zoqn6CyBIzU | `https://www.youtube-nocookie.com/embed/Zoqn6CyBIzU` | **VERIFIED (Active)** |

---

## 2. Technical & Content Integrity Assurances

1. **Zero Placeholders:** No synthetic movie posters or generic unverified photography used.
2. **Exact Original Thumbnails Preserved:** Downloaded directly from the YouTube high-resolution CDN into `public/assets/images/youtube-thumbnails/` with fallback to official `i.ytimg.com` endpoints.
3. **No External Redirects Required:** All eight videos can be screened natively inside the castle via the interactive `VideoModal` player utilizing privacy-enhanced `youtube-nocookie.com` iframe embeds with player parameters `rel=0&modestbranding=1`.
4. **Metadata Centralization:** Centralized in `src/data/videoArchive.ts` and consumed uniformly across all portfolio views.
