// scene.js — shared drawing helpers for the three MIDNIGHT MARKET scenes.
// Every scene is drawn as one original SVG from code (1000 x 600 units).
// Panels A and B come from the same render function; decorative randomness
// is seeded fresh on every render, so both panels — and every screenshot —
// are identical. No assets, no fonts, no network.
export function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// One paper lantern, drawn at (x, y) with the given scale.
export function lantern(x, y, s, glow) {
  return `
  <g transform="translate(${x} ${y}) scale(${s})">
    ${glow ? `<ellipse cx="0" cy="2" rx="30" ry="26" fill="#ff7a5c" opacity="0.25"><animate attributeName="opacity" values="0.18;0.3;0.18" dur="3s" repeatCount="indefinite"/></ellipse>` : ''}
    <line x1="0" y1="-26" x2="0" y2="-12" stroke="#3a2a1c" stroke-width="2"/>
    <rect x="-14" y="-12" width="28" height="6" rx="2" fill="#c9402f"/>
    <ellipse cx="0" cy="4" rx="17" ry="18" fill="#ff6a55"/>
    <ellipse cx="0" cy="4" rx="17" ry="18" fill="none" stroke="#e04a38" stroke-width="1.5"/>
    <path d="M-13 -6 Q0 -12 13 -6 M-15 4 L15 4 M-13 14 Q0 20 13 14" stroke="#c9402f" stroke-width="1.4" fill="none"/>
    <rect x="-5" y="4" width="10" height="9" rx="2" fill="#ffe9a8"/>
    <rect x="-14" y="20" width="28" height="5" rx="2" fill="#c9402f"/>
  </g>`;
}

// A shop sign board with text.
export function signBoard(x, y, w, h, bg, fg, text, sub) {
  return `
  <g>
    <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="6" fill="${bg}" stroke="#2a1c12" stroke-width="2"/>
    <text x="${x + w / 2}" y="${y + h / 2 - 2}" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="17" font-weight="bold" fill="${fg}" letter-spacing="2">${text}</text>
    ${sub ? `<text x="${x + w / 2}" y="${y + h - 7}" text-anchor="middle" font-family="Georgia, serif" font-size="9" fill="${fg}" opacity="0.85" letter-spacing="3">${sub}</text>` : ''}
  </g>`;
}

// Rain streaks, seeded so both panels match exactly.
export function rain(seed, count = 46) {
  const rand = mulberry32(seed);
  let out = '';
  for (let i = 0; i < count; i++) {
    const x = Math.floor(rand() * 1000);
    const y = Math.floor(rand() * 560);
    const len = 10 + Math.floor(rand() * 14);
    out += `<line x1="${x}" y1="${y}" x2="${x - 4}" y2="${y + len}" stroke="#a9c2ff" stroke-width="1.4" opacity="0.14"/>`;
  }
  return out;
}

// Stars in the sky, seeded.
export function stars(seed, count = 42, maxY = 190) {
  const rand = mulberry32(seed);
  let out = '';
  for (let i = 0; i < count; i++) {
    const x = Math.floor(rand() * 1000);
    const y = Math.floor(rand() * maxY);
    const r = 0.8 + rand() * 1.4;
    out += `<circle cx="${x}" cy="${y}" r="${r.toFixed(1)}" fill="#ffe9c4" opacity="${(0.35 + rand() * 0.5).toFixed(2)}"/>`;
  }
  return out;
}

// Soft glowing dots (fireflies, embers) that gently pulse.
export function glowDots(points, color = '#ffe9a8', r = 3) {
  return points
    .map(
      ([x, y], i) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${color}" opacity="0.8">
        <animate attributeName="opacity" values="0.25;0.9;0.25" dur="${2.4 + (i % 3) * 0.7}s" repeatCount="indefinite"/>
      </circle>`
    )
    .join('');
}

// A small burst of firework lines from a point.
export function firework(x, y, color, r = 26) {
  let lines = '';
  for (let a = 0; a < 10; a++) {
    const rad = (a * Math.PI) / 5;
    const x2 = x + Math.cos(rad) * r;
    const y2 = y + Math.sin(rad) * r;
    lines += `<line x1="${x}" y1="${y}" x2="${x2.toFixed(0)}" y2="${y2.toFixed(0)}" stroke="${color}" stroke-width="2.5" stroke-linecap="round" opacity="0.9"/>`;
  }
  return `<g>${lines}<circle cx="${x}" cy="${y}" r="4" fill="${color}"/></g>`;
}
