// scenes/shrine.js — Scene 2: SHRINE FESTIVAL, a warm red-and-gold night
// festival at a shrine. One original SVG scene (1000 x 600), drawn from
// code. Panel A shows the base scene, panel B applies the 8 differences.
import { lantern, signBoard, stars, firework, glowDots } from '../scene.js';

export const SHRINE_DIFFS = [
  {
    id: 'torii-finial',
    short: 'Finial',
    key: 'finial',
    label: 'The golden finial on the torii gate is gone',
    x: 160,
    y: 138,
    r: 22,
  },
  {
    id: 'drumstick',
    short: 'Drumstick',
    key: 'drumstick',
    label: 'One taiko drumstick is missing',
    x: 555,
    y: 420,
    r: 26,
  },
  {
    id: 'goldfish',
    short: 'Goldfish',
    key: 'goldfish',
    label: 'A goldfish is missing from the scooping tank',
    x: 315,
    y: 480,
    r: 26,
  },
  {
    id: 'stone-flame',
    short: 'Stone flame',
    key: 'flame',
    label: 'The flame in the right stone lantern is out',
    x: 660,
    y: 401,
    r: 24,
  },
  {
    id: 'ema',
    short: 'Ema plaque',
    key: 'ema',
    label: 'An ema plaque is missing from the rack',
    x: 704,
    y: 318,
    r: 24,
  },
  {
    id: 'fox-mask',
    short: 'Fox mask',
    key: 'mask',
    label: 'The fox mask is gone from the festival kid',
    x: 780,
    y: 472,
    r: 28,
  },
  {
    id: 'firework',
    short: 'Firework',
    key: 'firework',
    label: 'A pink firework burst is missing from the sky',
    x: 850,
    y: 70,
    r: 30,
  },
  {
    id: 'takoyaki',
    short: 'Takoyaki',
    key: 'takoyaki',
    label: 'A takoyaki ball is missing from the stall counter',
    x: 860,
    y: 440,
    r: 24,
  },
];

// The torii gate (left). `b` is true for panel B (finial gone).
function toriiGate(b) {
  const finial = b
    ? ''
    : `<circle cx="160" cy="138" r="9" fill="#ffe9a8" stroke="#c9a227" stroke-width="2"/>
       <rect x="156" y="146" width="8" height="8" fill="#c9a227"/>`;
  return `
  <g>
    ${finial}
    <!-- top lintel -->
    <rect x="50" y="150" width="220" height="16" rx="4" fill="#a02c20" stroke="#6e1a12" stroke-width="2"/>
    <rect x="50" y="150" width="220" height="5" rx="2" fill="#c94a38"/>
    <!-- centre plaque -->
    <rect x="140" y="166" width="40" height="26" rx="3" fill="#2a1c12" stroke="#c9a227" stroke-width="2"/>
    <text x="160" y="185" text-anchor="middle" font-family="Georgia, serif" font-size="15" font-weight="bold" fill="#ffe9a8">神</text>
    <!-- second lintel -->
    <rect x="66" y="192" width="188" height="14" rx="3" fill="#a02c20" stroke="#6e1a12" stroke-width="2"/>
    <!-- pillars -->
    <rect x="88" y="166" width="16" height="294" fill="#a02c20" stroke="#6e1a12" stroke-width="2"/>
    <rect x="216" y="166" width="16" height="294" fill="#a02c20" stroke="#6e1a12" stroke-width="2"/>
    <rect x="88" y="166" width="16" height="10" fill="#c94a38"/>
    <rect x="216" y="166" width="16" height="10" fill="#c94a38"/>
  </g>`;
}

// The shrine building (centre) on stone steps.
function shrineBuilding() {
  return `
  <g>
    <!-- steps -->
    <rect x="400" y="440" width="220" height="16" fill="#8a7a6a" stroke="#5a4a3a" stroke-width="2"/>
    <rect x="412" y="424" width="196" height="16" fill="#9a8a7a" stroke="#5a4a3a" stroke-width="2"/>
    <rect x="424" y="408" width="172" height="16" fill="#a89a8a" stroke="#5a4a3a" stroke-width="2"/>
    <!-- body -->
    <rect x="400" y="250" width="220" height="158" fill="#f5e6c8" stroke="#5a2a1a" stroke-width="3"/>
    <rect x="400" y="250" width="220" height="14" fill="#a02c20"/>
    <!-- corner pillars -->
    <rect x="400" y="250" width="16" height="158" fill="#a02c20"/>
    <rect x="604" y="250" width="16" height="158" fill="#a02c20"/>
    <!-- curved roof -->
    <path d="M380 256 Q510 196 640 256 L628 268 Q510 224 392 268 Z" fill="#2a1a3a" stroke="#120a20" stroke-width="2"/>
    <path d="M380 256 Q510 196 640 256" fill="none" stroke="#c9a227" stroke-width="2.5"/>
    <circle cx="510" cy="212" r="8" fill="#c9a227" stroke="#8a6d1a" stroke-width="2"/>
    <!-- shimenawa rope with shide streamers -->
    <path d="M416 302 Q510 318 604 302" fill="none" stroke="#c9a227" stroke-width="5" stroke-linecap="round"/>
    <path d="M470 308 L464 330 L472 326 L466 348 L478 330 L472 324 Z" fill="#f5f0dc"/>
    <path d="M510 312 L504 334 L512 330 L506 352 L518 334 L512 328 Z" fill="#f5f0dc"/>
    <path d="M550 308 L544 330 L552 326 L546 348 L558 330 L552 324 Z" fill="#f5f0dc"/>
    <!-- door -->
    <rect x="486" y="330" width="48" height="78" fill="#4a2415" stroke="#2a1a0c" stroke-width="2"/>
    <circle cx="526" cy="372" r="3" fill="#ffe9a8"/>
    <!-- offering box -->
    <rect x="480" y="408" width="60" height="34" fill="#7a4a2b" stroke="#3a2415" stroke-width="2"/>
    <path d="M480 418 L540 418 M480 428 L540 428" stroke="#3a2415" stroke-width="1.5"/>
    <!-- flanking lanterns -->
    ${lantern(436, 330, 0.55, true)}
    ${lantern(584, 330, 0.55, true)}
  </g>`;
}

// Ema plaque rack (right of the shrine). `b` is true for panel B.
function emaRack(b) {
  const plaques = [
    { x: 650, y: 300 },
    { x: 690, y: 300 },
    { x: 650, y: 340 },
    { x: 690, y: 340 },
  ];
  let out = `
  <g>
    <rect x="640" y="282" width="88" height="10" rx="3" fill="#7a4a2b" stroke="#3a2415" stroke-width="2"/>
    <rect x="640" y="282" width="10" height="110" fill="#7a4a2b" stroke="#3a2415" stroke-width="2"/>
    <rect x="718" y="282" width="10" height="110" fill="#7a4a2b" stroke="#3a2415" stroke-width="2"/>
  </g>`;
  for (const p of plaques) {
    if (b && p.x === 690 && p.y === 300) continue;
    out += `<g>
      <rect x="${p.x}" y="${p.y}" width="28" height="36" rx="4" fill="#e8c98a" stroke="#8a6a3a" stroke-width="2"/>
      <circle cx="${p.x + 14}" cy="${p.y + 8}" r="2.5" fill="#8a6a3a"/>
      <path d="M${p.x + 6} ${p.y + 20} L${p.x + 22} ${p.y + 20} M${p.x + 8} ${p.y + 26} L${p.x + 20} ${p.y + 26}" stroke="#8a6a3a" stroke-width="1.5"/>
    </g>`;
  }
  return out;
}

// One stone lantern (toro). `flame` is false for panel B's right lantern.
function stoneLantern(x, y, flame) {
  return `
  <g>
    <rect x="${x - 18}" y="${y}" width="36" height="10" fill="#8a8a7a" stroke="#5a5a4a" stroke-width="2"/>
    <rect x="${x - 6}" y="${y - 34}" width="12" height="34" fill="#9a9a8a" stroke="#5a5a4a" stroke-width="2"/>
    <rect x="${x - 16}" y="${y - 52}" width="32" height="20" rx="3" fill="#7a7a6a" stroke="#4a4a3a" stroke-width="2"/>
    ${flame ? `<ellipse cx="${x}" cy="${y - 42}" rx="6" ry="8" fill="#ffe9a8"><animate attributeName="opacity" values="0.7;1;0.7" dur="1.8s" repeatCount="indefinite"/></ellipse>` : ''}
    <path d="M${x - 22} ${y - 52} L${x} ${y - 70} L${x + 22} ${y - 52} Z" fill="#6a6a5a" stroke="#4a4a3a" stroke-width="2"/>
    <circle cx="${x}" cy="${y - 72}" r="4" fill="#8a8a7a"/>
  </g>`;
}

// The takoyaki stall (right). `b` is true for panel B.
function takoyakiStall(b) {
  const balls = [
    { x: 800, y: 440 },
    { x: 830, y: 440 },
    { x: 860, y: 440 },
    { x: 800, y: 458 },
    { x: 830, y: 458 },
    { x: 860, y: 458 },
  ];
  let out = `
  <g>
    <!-- body -->
    <rect x="720" y="360" width="240" height="120" fill="#7a3a2b" stroke="#3a1a12" stroke-width="3"/>
    <rect x="720" y="360" width="240" height="16" fill="#a04a38"/>
    <!-- striped awning -->
    <path d="M708 360 L972 360 L960 330 L720 330 Z" fill="#f5e6c8" stroke="#3a1a12" stroke-width="2"/>
    <path d="M744 360 L736 330 M792 360 L788 330 M840 360 L840 330 M888 360 L892 330 M936 360 L944 330" stroke="#a02c20" stroke-width="10" opacity="0.85"/>
    <!-- sign -->
    ${signBoard(770, 332, 140, 30, '#f5e6c8', '#8a2f24', 'TAKOYAKI', 'たこやき')}
    <!-- counter -->
    <rect x="720" y="430" width="240" height="50" fill="#4a2e1a" stroke="#2a1a0c" stroke-width="3"/>
  </g>`;
  for (const ball of balls) {
    if (b && ball.x === 860 && ball.y === 440) continue;
    out += `<circle cx="${ball.x}" cy="${ball.y}" r="8" fill="#c98a4a" stroke="#8a5a2a" stroke-width="1.5"/>
      <circle cx="${ball.x - 2}" cy="${ball.y - 2}" r="2.5" fill="#8fc97a"/>`;
  }
  return out;
}

// The taiko drum on its stand. `b` is true for panel B (right stick gone).
function taikoDrum(b) {
  const stickR = b
    ? ''
    : `<line x1="540" y1="446" x2="562" y2="414" stroke="#c9a227" stroke-width="5" stroke-linecap="round"/>
       <circle cx="563" cy="412" r="6" fill="#e8dcc0"/>`;
  return `
  <g>
    <!-- stand -->
    <path d="M470 520 L500 470 M560 520 L530 470" stroke="#5a3a22" stroke-width="6" stroke-linecap="round"/>
    <path d="M462 520 L568 520" stroke="#5a3a22" stroke-width="5" stroke-linecap="round"/>
    <!-- drum -->
    <ellipse cx="515" cy="470" rx="56" ry="38" fill="#a02c20" stroke="#6e1a12" stroke-width="3"/>
    <ellipse cx="515" cy="470" rx="44" ry="28" fill="#f5e6c8" stroke="#c9a227" stroke-width="3"/>
    <circle cx="515" cy="470" r="4" fill="#a02c20"/>
    ${[0, 45, 90, 135, 180, 225, 270, 315].map((a) => {
      const rad = (a * Math.PI) / 180;
      return `<circle cx="${515 + Math.cos(rad) * 50}" cy="${470 + Math.sin(rad) * 32}" r="3" fill="#c9a227"/>`;
    }).join('')}
    <!-- left stick -->
    <line x1="490" y1="446" x2="468" y2="414" stroke="#c9a227" stroke-width="5" stroke-linecap="round"/>
    <circle cx="467" cy="412" r="6" fill="#e8dcc0"/>
    ${stickR}
  </g>`;
}

// The goldfish scooping tank. `b` is true for panel B (middle fish gone).
function goldfishTank(b) {
  const fish = [
    { x: 295, y: 478 },
    { x: 315, y: 482 },
    { x: 335, y: 476 },
  ];
  let out = `
  <g>
    <rect x="268" y="458" width="96" height="46" rx="6" fill="#7a4a2b" stroke="#3a2415" stroke-width="3"/>
    <rect x="276" y="464" width="80" height="32" rx="4" fill="#7ad0e0" opacity="0.85"/>
    <path d="M276 472 Q316 468 356 472 M276 484 Q316 488 356 484" stroke="#4a9ab0" stroke-width="1.5" fill="none" opacity="0.6"/>
  </g>`;
  for (const f of fish) {
    if (b && f.x === 315) continue;
    out += `<g>
      <ellipse cx="${f.x}" cy="${f.y}" rx="9" ry="6" fill="#ff8a3d" stroke="#c95a1a" stroke-width="1.5"/>
      <path d="M${f.x + 8} ${f.y} l8 -5 l-2 5 l2 5 z" fill="#ff8a3d" stroke="#c95a1a" stroke-width="1"/>
      <circle cx="${f.x - 3}" cy="${f.y - 1}" r="1.6" fill="#2a1c12"/>
    </g>`;
  }
  return out;
}

// A festival kid in yukata with a fox mask. `b` is true for panel B.
function kid(b) {
  const face = b
    ? `<circle cx="774" cy="470" r="2.5" fill="#2a1c12"/><circle cx="786" cy="470" r="2.5" fill="#2a1c12"/>
       <path d="M776 478 Q780 481 784 478" stroke="#2a1c12" stroke-width="1.5" fill="none" stroke-linecap="round"/>`
    : `<g>
      <ellipse cx="780" cy="470" rx="13" ry="15" fill="#f5f0dc" stroke="#d8c49a" stroke-width="1.5"/>
      <path d="M768 458 L764 446 L776 454 Z" fill="#f5f0dc" stroke="#d8c49a" stroke-width="1.5"/>
      <path d="M792 458 L796 446 L784 454 Z" fill="#f5f0dc" stroke="#d8c49a" stroke-width="1.5"/>
      <path d="M768 458 L766 450 L774 455 Z" fill="#d94040"/>
      <path d="M792 458 L794 450 L786 455 Z" fill="#d94040"/>
      <circle cx="774" cy="470" r="2.5" fill="#2a1c12"/><circle cx="786" cy="470" r="2.5" fill="#2a1c12"/>
      <path d="M780 476 L780 480" stroke="#d94040" stroke-width="1.8"/>
    </g>`;
  return `
  <g>
    <!-- yukata body -->
    <path d="M764 492 L796 492 L802 540 L758 540 Z" fill="#3a5a8a" stroke="#22385a" stroke-width="2"/>
    <path d="M764 492 L780 510 L796 492" fill="none" stroke="#ffe9a8" stroke-width="2"/>
    <rect x="772" y="510" width="16" height="5" fill="#ffe9a8"/>
    <!-- head -->
    <circle cx="780" cy="472" r="16" fill="#f2d0a8" stroke="#c9a27a" stroke-width="2"/>
    <path d="M764 466 Q780 448 796 466 Q788 456 780 458 Q772 456 764 466" fill="#2a1c12"/>
    ${face}
  </g>`;
}

// Paper lantern string across the top.
function stringLights() {
  const spots = [
    { x: 100, y: 70 },
    { x: 280, y: 80 },
    { x: 480, y: 66 },
    { x: 680, y: 78 },
    { x: 920, y: 66 },
  ];
  let out = `<path d="M0 44 Q250 104 500 58 Q750 100 1000 48" fill="none" stroke="#3a1c12" stroke-width="2"/>`;
  for (const s of spots) out += lantern(s.x, s.y, 0.8, true);
  return out;
}

// Ground, sky and background trees.
function groundAndSky(b) {
  return `
  <g>
    <rect x="0" y="0" width="1000" height="600" fill="url(#sky)"/>
    ${stars(20261122, 36, 170)}
    ${firework(180, 90, '#ffe9a8', 26)}
    ${b ? '' : firework(850, 70, '#ff8fb3', 28)}
    ${firework(620, 120, '#c9d8ff', 16)}
    <!-- distant pines -->
    <path d="M0 240 L40 180 L80 240 L120 190 L160 240 L200 200 L240 240 L280 190 L320 240 L0 240 Z" fill="#1e0e1a"/>
    <path d="M700 240 L740 180 L780 240 L820 190 L860 240 L900 200 L940 240 L980 190 L1000 220 L1000 240 L700 240 Z" fill="#1e0e1a"/>
    <!-- sakura branch, top right -->
    <path d="M1000 120 Q940 140 900 110 Q960 100 1000 90 Z" fill="#3a2030"/>
    <circle cx="930" cy="108" r="10" fill="#ff8fb3" opacity="0.9"/><circle cx="952" cy="96" r="8" fill="#ffb3c8" opacity="0.9"/>
    <circle cx="912" cy="92" r="7" fill="#ff6a9a" opacity="0.9"/><circle cx="966" cy="118" r="8" fill="#ff8fb3" opacity="0.9"/>
    <!-- stone courtyard -->
    <rect x="0" y="450" width="1000" height="150" fill="#3a2a22"/>
    <path d="M0 490 L1000 490 M0 540 L1000 540" stroke="#2a1e18" stroke-width="2"/>
    <path d="M200 450 L200 600 M500 450 L500 600 M800 450 L800 600" stroke="#2a1e18" stroke-width="1.5"/>
    <!-- stone path from torii to shrine -->
    <ellipse cx="180" cy="520" rx="34" ry="10" fill="#8a7a6a" opacity="0.5"/>
    <ellipse cx="300" cy="530" rx="34" ry="10" fill="#8a7a6a" opacity="0.5"/>
    <ellipse cx="420" cy="520" rx="34" ry="10" fill="#8a7a6a" opacity="0.5"/>
    <!-- pebbles and grass -->
    <ellipse cx="120" cy="570" rx="10" ry="5" fill="#5a4a3a"/><ellipse cx="640" cy="560" rx="12" ry="6" fill="#5a4a3a"/>
    <ellipse cx="920" cy="570" rx="10" ry="5" fill="#5a4a3a"/>
    <path d="M60 560 q4 -12 0 -20 M68 560 q4 -10 0 -18 M76 560 q4 -12 0 -20" stroke="#4a7a3a" stroke-width="2" fill="none"/>
    <path d="M940 480 q4 -12 0 -20 M948 480 q4 -10 0 -18" stroke="#4a7a3a" stroke-width="2" fill="none"/>
    <!-- nobori festival banner -->
    <line x1="700" y1="300" x2="700" y2="440" stroke="#5a3a22" stroke-width="4"/>
    <rect x="700" y="292" width="34" height="120" fill="#f5e6c8" stroke="#a02c20" stroke-width="2"/>
    <text x="717" y="330" text-anchor="middle" font-family="Georgia, serif" font-size="26" font-weight="bold" fill="#a02c20">祭</text>
    <text x="717" y="360" text-anchor="middle" font-family="Georgia, serif" font-size="26" font-weight="bold" fill="#a02c20">り</text>
    ${glowDots([[60, 300], [940, 250], [360, 200], [760, 180]], '#ffe9a8', 3)}
  </g>`;
}

// Render one panel. `variant` is 'A' (base) or 'B' (differences applied).
export function renderScene(variant) {
  const b = variant === 'B';
  return `<svg viewBox="0 0 1000 600" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Shrine Festival scene, panel ${variant}">
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#2a0e1e"/>
      <stop offset="0.55" stop-color="#4a1a30"/>
      <stop offset="1" stop-color="#5a2430"/>
    </linearGradient>
  </defs>
  ${groundAndSky(b)}
  ${stringLights()}
  ${toriiGate(b)}
  ${shrineBuilding()}
  ${emaRack(b)}
  ${stoneLantern(330, 430, true)}
  ${stoneLantern(660, 430, !b)}
  ${takoyakiStall(b)}
  ${taikoDrum(b)}
  ${goldfishTank(b)}
  ${kid(b)}
</svg>`;
}

export const SHRINE = {
  id: 'shrine',
  name: 'Shrine Festival',
  tagline: 'Fireworks, taiko drums and takoyaki under the torii',
  timeLimit: 150,
  difficulty: 'Medium',
  par: '1:15',
  diffs: SHRINE_DIFFS,
  render: renderScene,
};
