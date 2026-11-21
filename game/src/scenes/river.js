// scenes/river.js — Scene 3: LANTERN RIVER, a quiet dusk river with an
// arched bridge and floating lanterns. The hardest scene: smaller, subtler
// differences among water, reflections and fireflies. One original SVG
// scene (1000 x 600), drawn from code. Panel A is the base, panel B
// applies the 8 differences.
import { lantern, stars, glowDots } from '../scene.js';

export const RIVER_DIFFS = [
  {
    id: 'floating-lantern',
    short: 'River lantern',
    key: 'floatlantern',
    label: 'A floating lantern is missing from the river',
    x: 560,
    y: 480,
    r: 26,
  },
  {
    id: 'koi',
    short: 'Koi',
    key: 'koi',
    label: 'A white koi is missing from the river',
    x: 700,
    y: 520,
    r: 30,
  },
  {
    id: 'willow-branch',
    short: 'Willow branch',
    key: 'willow',
    label: 'A drooping willow branch is gone',
    x: 100,
    y: 320,
    r: 30,
  },
  {
    id: 'boat-oar',
    short: 'Oar',
    key: 'oar',
    label: 'The boat’s oar is missing',
    x: 872,
    y: 425,
    r: 26,
  },
  {
    id: 'moon-crater',
    short: 'Moon crater',
    key: 'crater',
    label: 'A crater is missing from the moon',
    x: 840,
    y: 80,
    r: 22,
  },
  {
    id: 'window-light',
    short: 'Window light',
    key: 'window',
    label: 'A riverside window has gone dark',
    x: 200,
    y: 260,
    r: 22,
  },
  {
    id: 'firefly',
    short: 'Firefly',
    key: 'firefly',
    label: 'A firefly is missing by the willow',
    x: 280,
    y: 380,
    r: 20,
  },
  {
    id: 'bridge-lantern',
    short: 'Bridge lantern',
    key: 'bridgelantern',
    label: 'A lantern is missing from the bridge rail',
    x: 570,
    y: 295,
    r: 24,
  },
];

// The moon with craters. `b` is true for panel B (one crater gone).
function moon(b) {
  const crater = b
    ? ''
    : `<circle cx="838" cy="78" r="6" fill="#f0d48a" opacity="0.7"/>`;
  return `
  <g>
    <circle cx="850" cy="90" r="56" fill="#ffe9a8" opacity="0.12"/>
    <circle cx="850" cy="90" r="40" fill="#ffe9a8" opacity="0.95"/>
    ${crater}
    <circle cx="864" cy="102" r="5" fill="#f0d48a" opacity="0.7"/>
    <circle cx="852" cy="68" r="4" fill="#f0d48a" opacity="0.6"/>
  </g>`;
}

// Riverside houses. `b` is true for panel B (middle window dark).
function houses(b) {
  const window2 = b ? '#2a2a3a' : '#ffd98a';
  return `
  <g>
    <!-- house 1 -->
    <rect x="60" y="250" width="100" height="80" fill="#4a4a6e" stroke="#2a2a44" stroke-width="2"/>
    <path d="M50 252 L110 214 L170 252 Z" fill="#2a2a44" stroke="#1a1a2e" stroke-width="2"/>
    <rect x="98" y="268" width="24" height="24" rx="3" fill="#ffd98a" stroke="#2a2a44" stroke-width="2"/>
    <rect x="124" y="292" width="20" height="38" fill="#2a2a44"/>
    <!-- house 2 -->
    <rect x="180" y="238" width="100" height="92" fill="#55557a" stroke="#2a2a44" stroke-width="2"/>
    <path d="M170 240 L230 202 L290 240 Z" fill="#2a2a44" stroke="#1a1a2e" stroke-width="2"/>
    <rect x="188" y="248" width="24" height="24" rx="3" fill="${window2}" stroke="#2a2a44" stroke-width="2"/>
    <rect x="224" y="292" width="20" height="38" fill="#2a2a44"/>
    <!-- house 3 -->
    <rect x="290" y="258" width="90" height="72" fill="#4a4a6e" stroke="#2a2a44" stroke-width="2"/>
    <path d="M282 260 L335 224 L388 260 Z" fill="#2a2a44" stroke="#1a1a2e" stroke-width="2"/>
    <rect x="322" y="276" width="24" height="24" rx="3" fill="#ffd98a" stroke="#2a2a44" stroke-width="2"/>
  </g>`;
}

// The willow tree (left). `b` is true for panel B (one branch gone).
function willow(b) {
  const branches = [
    { tip: [100, 320], ctrl: [90, 240] },
    { tip: [140, 340], ctrl: [130, 250] },
    { tip: [180, 330], ctrl: [170, 240] },
    { tip: [200, 300], ctrl: [195, 230] },
    { tip: [220, 310], ctrl: [215, 240] },
    { tip: [260, 290], ctrl: [250, 220] },
  ];
  let out = `
  <g>
    <!-- trunk -->
    <path d="M118 380 Q130 300 150 180 L166 182 Q150 300 138 382 Z" fill="#4a2e1a" stroke="#2a1a0c" stroke-width="2"/>
    <!-- canopy -->
    <ellipse cx="160" cy="160" rx="110" ry="46" fill="#2a5a2a" opacity="0.95"/>
    <ellipse cx="120" cy="150" rx="60" ry="34" fill="#356b32"/>
    <ellipse cx="210" cy="150" rx="60" ry="34" fill="#356b32"/>
  </g>`;
  for (const br of branches) {
    if (b && br.tip[0] === 100) continue;
    out += `<path d="M150 180 Q${br.ctrl[0]} ${br.ctrl[1]} ${br.tip[0]} ${br.tip[1]}" fill="none" stroke="#3f7a3a" stroke-width="3" stroke-linecap="round"/>
      <ellipse cx="${br.tip[0]}" cy="${br.tip[1]}" rx="12" ry="7" fill="#4a8a44" opacity="0.9"/>`;
  }
  return out;
}

// The arched bridge (centre). `b` is true for panel B (right lantern gone).
function bridge(b) {
  const posts = [410, 450, 490, 530, 570, 610];
  let out = `
  <g>
    <!-- deck -->
    <path d="M380 384 Q510 252 640 384 L640 404 Q510 282 380 404 Z" fill="#6b4226" stroke="#3a2415" stroke-width="3"/>
    <path d="M392 384 Q510 268 628 384" fill="none" stroke="#8a5a33" stroke-width="2"/>
    <!-- planks -->
    <path d="M420 356 L420 386 M470 322 L470 358 M510 306 L510 344 M550 322 L550 358 M600 356 L600 386" stroke="#3a2415" stroke-width="2"/>
    <!-- rail -->
    <path d="M380 384 Q510 252 640 384" fill="none" stroke="#8a5a33" stroke-width="4"/>
  </g>`;
  for (const x of posts) {
    const t = (x - 380) / 260;
    const y = 384 - 132 * 4 * t * (1 - t);
    out += `<line x1="${x}" y1="${y.toFixed(0)}" x2="${x}" y2="${(y - 26).toFixed(0)}" stroke="#8a5a33" stroke-width="3"/>`;
  }
  out += `<path d="M380 358 Q510 226 640 358" fill="none" stroke="#8a5a33" stroke-width="3"/>`;
  // post lanterns on the rail
  out += `<g transform="translate(450 268)">${lantern(0, 0, 0.5, true)}</g>`;
  if (!b) out += `<g transform="translate(570 268)">${lantern(0, 0, 0.5, true)}</g>`;
  return out;
}

// One floating lantern on the river.
function floatLantern(x, y) {
  return `
  <g>
    <ellipse cx="${x}" cy="${y + 16}" rx="14" ry="4" fill="#ff7a5c" opacity="0.18"/>
    <rect x="${x - 10}" y="${y - 6}" width="20" height="12" rx="4" fill="#ff8a5c" stroke="#c95a2a" stroke-width="1.5"/>
    <ellipse cx="${x}" cy="${y - 9}" rx="4" ry="6" fill="#ffe9a8">
      <animate attributeName="opacity" values="0.7;1;0.7" dur="1.6s" repeatCount="indefinite"/>
    </ellipse>
  </g>`;
}

// One koi fish. `flip` mirrors it.
function koi(x, y, flip, body, spots) {
  return `
  <g transform="translate(${x} ${y}) scale(${flip ? -1 : 1} 1)">
    <ellipse cx="0" cy="0" rx="22" ry="9" fill="${body}" stroke="#8a5a2a" stroke-width="1.5"/>
    <path d="M20 0 l14 -8 l-3 8 l3 8 z" fill="${body}" stroke="#8a5a2a" stroke-width="1"/>
    ${spots.map(([sx, sy, r]) => `<circle cx="${sx}" cy="${sy}" r="${r}" fill="#ff8a3d" opacity="0.85"/>`).join('')}
    <circle cx="-12" cy="-2" r="2" fill="#2a1c12"/>
  </g>`;
}

// The little wooden boat (right). `b` is true for panel B (oar gone).
function boat(b) {
  const oar = b
    ? ''
    : `<line x1="862" y1="406" x2="892" y2="444" stroke="#8a6a3a" stroke-width="4" stroke-linecap="round"/>
       <ellipse cx="894" cy="446" rx="7" ry="10" fill="#a08a5a" transform="rotate(35 894 446)"/>`;
  return `
  <g>
    <path d="M780 400 L920 400 L900 432 L800 432 Z" fill="#6b4226" stroke="#3a2415" stroke-width="2"/>
    <path d="M790 412 L910 412" stroke="#8a5a33" stroke-width="2"/>
    <line x1="850" y1="400" x2="850" y2="358" stroke="#5a3a22" stroke-width="4"/>
    <path d="M850 358 L886 372 L850 382 Z" fill="#d94040" stroke="#8a2020" stroke-width="1.5"/>
    ${oar}
    <!-- ripples around the hull -->
    <path d="M770 440 q20 6 40 0 q20 -6 40 0 M820 448 q20 6 40 0" stroke="#7ad0e0" stroke-width="1.5" fill="none" opacity="0.4"/>
  </g>`;
}

// River, sky, banks and background.
function riverAndSky(b) {
  const flies = b ? [[320, 360], [250, 420], [340, 400]] : [[280, 380], [320, 360], [250, 420], [340, 400]];
  return `
  <g>
    <rect x="0" y="0" width="1000" height="600" fill="url(#sky)"/>
    ${stars(20261123, 40, 150)}
    <!-- clouds -->
    <ellipse cx="200" cy="90" rx="70" ry="14" fill="#ffffff" opacity="0.07"/>
    <ellipse cx="500" cy="60" rx="80" ry="12" fill="#ffffff" opacity="0.06"/>
    <ellipse cx="700" cy="130" rx="60" ry="12" fill="#ffffff" opacity="0.06"/>
    ${moon(b)}
    <!-- distant hills -->
    <path d="M0 300 L120 240 L260 300 L400 250 L540 300 L680 245 L820 300 L1000 250 L1000 340 L0 340 Z" fill="#16223a"/>
    <!-- banks -->
    <rect x="0" y="320" width="380" height="30" fill="#1e3a2a"/>
    <rect x="640" y="320" width="360" height="30" fill="#1e3a2a"/>
    <!-- river -->
    <rect x="0" y="340" width="1000" height="260" fill="url(#water)"/>
    <!-- moonlight on the water -->
    <ellipse cx="850" cy="480" rx="34" ry="90" fill="#ffe9a8" opacity="0.07"/>
    <ellipse cx="510" cy="500" rx="130" ry="18" fill="#ffb347" opacity="0.05"/>
    <!-- ripples -->
    <path d="M60 400 q40 8 80 0 q40 -8 80 0 M300 440 q40 8 80 0 q40 -8 80 0 M600 400 q40 8 80 0 q40 -8 80 0" stroke="#7ad0e0" stroke-width="1.5" fill="none" opacity="0.25"/>
    <path d="M100 500 q40 8 80 0 q40 -8 80 0 M420 540 q40 8 80 0 q40 -8 80 0 M700 470 q40 8 80 0 q40 -8 80 0" stroke="#7ad0e0" stroke-width="1.5" fill="none" opacity="0.2"/>
    <!-- reeds on the banks -->
    <path d="M40 340 q4 -16 0 -28 M52 340 q4 -14 0 -26 M64 340 q4 -16 0 -28" stroke="#3f7a3a" stroke-width="2" fill="none"/>
    <path d="M940 340 q4 -16 0 -28 M952 340 q4 -14 0 -26 M964 340 q4 -16 0 -28" stroke="#3f7a3a" stroke-width="2" fill="none"/>
    <!-- pebbles -->
    <ellipse cx="120" cy="336" rx="10" ry="4" fill="#5a5a4a"/><ellipse cx="880" cy="336" rx="12" ry="5" fill="#5a5a4a"/>
    ${glowDots(flies, '#c8ff9a', 3)}
  </g>`;
}

// Render one panel. `variant` is 'A' (base) or 'B' (differences applied).
export function renderScene(variant) {
  const b = variant === 'B';
  const floats = [
    { x: 300, y: 400 },
    { x: 560, y: 480 },
    { x: 700, y: 420 },
    { x: 450, y: 540 },
    { x: 820, y: 500 },
    { x: 220, y: 520 },
  ];
  let floatsSvg = '';
  for (const f of floats) {
    if (b && f.x === 560) continue;
    floatsSvg += floatLantern(f.x, f.y);
  }
  return `<svg viewBox="0 0 1000 600" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Lantern River scene, panel ${variant}">
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#0e2a33"/>
      <stop offset="0.55" stop-color="#1a2a55"/>
      <stop offset="0.85" stop-color="#7a4a3a"/>
      <stop offset="1" stop-color="#3a2a4a"/>
    </linearGradient>
    <linearGradient id="water" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#1a3a55"/>
      <stop offset="1" stop-color="#0e2238"/>
    </linearGradient>
  </defs>
  ${riverAndSky(b)}
  ${houses(b)}
  ${willow(b)}
  ${bridge(b)}
  ${floatsSvg}
  ${koi(300, 480, false, '#ff8a3d', [[-6, -3, 4], [6, 3, 3]])}
  ${b ? '' : koi(700, 520, true, '#f5f0dc', [[-4, -2, 3]])}
  ${koi(520, 560, false, '#ffb347', [[0, -3, 4], [10, 2, 3]])}
  ${boat(b)}
</svg>`;
}

export const RIVER = {
  id: 'river',
  name: 'Lantern River',
  tagline: 'A quiet dusk river — floating lanterns, koi and fireflies',
  timeLimit: 120,
  difficulty: 'Hard',
  par: '1:00',
  diffs: RIVER_DIFFS,
  render: renderScene,
};
