/**
 * Fallback helpers for images across the Cinematic Universe.
 * Guarantees zero broken image icons, smooth YouTube fallback from maxresdefault to hqdefault,
 * and a cinematic SVG placeholder when ZEEHAD.png is missing.
 */

export const ZEEHAD_IMAGE_PATH = '/assets/images/ZEEHAD.png';

export const ZEEHAD_SVG_PLACEHOLDER = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1000" width="800" height="1000">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#020305"/>
      <stop offset="50%" stop-color="#081522"/>
      <stop offset="100%" stop-color="#020305"/>
    </linearGradient>
    <radialGradient id="glow" cx="50%" cy="40%" r="50%">
      <stop offset="0%" stop-color="#2C6EA6" stop-opacity="0.35"/>
      <stop offset="100%" stop-color="#020305" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#bg)"/>
  <circle cx="400" cy="400" r="320" fill="url(#glow)"/>
  <!-- Cinematic Framing Grid -->
  <line x1="100" y1="100" x2="140" y2="100" stroke="#7DBBFF" stroke-width="2" opacity="0.6"/>
  <line x1="100" y1="100" x2="100" y2="140" stroke="#7DBBFF" stroke-width="2" opacity="0.6"/>
  <line x1="700" y1="100" x2="660" y2="100" stroke="#7DBBFF" stroke-width="2" opacity="0.6"/>
  <line x1="700" y1="100" x2="700" y2="140" stroke="#7DBBFF" stroke-width="2" opacity="0.6"/>
  <line x1="100" y1="900" x2="140" y2="900" stroke="#7DBBFF" stroke-width="2" opacity="0.6"/>
  <line x1="100" y1="900" x2="100" y2="860" stroke="#7DBBFF" stroke-width="2" opacity="0.6"/>
  <line x1="700" y1="900" x2="660" y2="900" stroke="#7DBBFF" stroke-width="2" opacity="0.6"/>
  <line x1="700" y1="900" x2="700" y2="860" stroke="#7DBBFF" stroke-width="2" opacity="0.6"/>

  <!-- Aperture Blades Icon -->
  <g transform="translate(400, 390)" stroke="#7DBBFF" stroke-width="2" fill="none" opacity="0.8">
    <circle r="110" stroke="#2C6EA6" stroke-width="3"/>
    <circle r="130" stroke="#102B45" stroke-dasharray="4 8" stroke-width="1.5"/>
    <circle r="50" fill="#020305" stroke="#7DBBFF" stroke-width="2"/>
    <path d="M-80,-20 L20,-90" stroke="#7DBBFF" stroke-width="1.5"/>
    <path d="M20,-90 L85,-10" stroke="#7DBBFF" stroke-width="1.5"/>
    <path d="M85,-10 L45,80" stroke="#7DBBFF" stroke-width="1.5"/>
    <path d="M45,80 L-50,85" stroke="#7DBBFF" stroke-width="1.5"/>
    <path d="M-50,85 L-80,-20" stroke="#7DBBFF" stroke-width="1.5"/>
  </g>

  <!-- Telemetry and Instruction -->
  <text x="400" y="580" text-anchor="middle" font-family="'JetBrains Mono', monospace" font-size="24" fill="#F2F0EB" font-weight="700" letter-spacing="6">ZEEHAD.png</text>
  <text x="400" y="620" text-anchor="middle" font-family="'JetBrains Mono', monospace" font-size="14" fill="#7DBBFF" letter-spacing="4">DIRECTORIAL MONOLITH // DOSSIER 01</text>
  <text x="400" y="670" text-anchor="middle" font-family="'JetBrains Mono', monospace" font-size="15" fill="#8A96A3" letter-spacing="2">PLACE IMAGE IN:</text>
  <text x="400" y="700" text-anchor="middle" font-family="'JetBrains Mono', monospace" font-size="16" fill="#A9D4FF" font-weight="600" letter-spacing="1">assets/images/ZEEHAD.png</text>

  <text x="400" y="770" text-anchor="middle" font-family="'Plus Jakarta Sans', sans-serif" font-size="13" fill="#8A96A3" opacity="0.7">WRITER · DIRECTOR · CINEMATOGRAPHER · EDITOR</text>
</svg>
`)}`;

export function handleYouTubeThumbnailError(
  event: React.SyntheticEvent<HTMLImageElement, Event>,
  videoId: string
) {
  const target = event.currentTarget;
  const currentSrc = target.src;
  if (currentSrc.includes('maxresdefault.jpg')) {
    target.src = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
  } else if (currentSrc.includes('hqdefault.jpg')) {
    target.src = `https://i.ytimg.com/vi/${videoId}/mqdefault.jpg`;
  }
}
