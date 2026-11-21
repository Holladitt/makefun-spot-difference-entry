// scenes/market.js — Scene 1: MIDNIGHT MARKET, the rainy Japanese night
// market. One original SVG scene (1000 x 600), drawn from code. Panel A
// shows the base scene, panel B applies the 8 differences.
import { lantern, signBoard, rain, stars } from '../scene.js';

export const MARKET_DIFFS = [
  {
    id: 'lantern-missing',
    short: 'Lantern',
    key: 'lantern',
    label: 'A paper lantern is missing from the string lights',
    x: 212,
    y: 82,
    r: 30,
  },
  {
    id: 'window-shape',
    short: 'Window',
    key: 'window',
    label: 'The ramen stall window changed shape',
    x: 178,
    y: 302,
    r: 42,
  },
  {
    id: 'cat-scarf',
    short: 'Cat scarf',
    key: 'scarf',
    label: 'The cat lost its red scarf',
    x: 332,
    y: 452,
    r: 32,
  },
  {
    id: 'dango-missing',
    short: 'Dango',
    key: 'dango',
    label: 'A dango skewer is missing from the stall counter',
    x: 562,
    y: 418,
    r: 28,
  },
  {
    id: 'sign-star',
    short: 'Star',
    key: 'star',
    label: 'The star on the ramen sign is gone',
    x: 178,
    y: 198,
    r: 26,
  },
  {
    id: 'umbrella-color',
    short: 'Umbrella',
    key: 'umbrella',
    label: 'The stall umbrella changed colour',
    x: 562,
    y: 248,
    r: 40,
  },
  {
    id: 'flower-missing',
    short: 'Flower pot',
    key: 'flower',
    label: 'A potted flower by the flower shop is missing',
    x: 832,
    y: 482,
    r: 30,
  },
  {
    id: 'clock-hands',
    short: 'Clock hands',
    key: 'clock',
    label: 'The clock tower shows a different time',
    x: 862,
    y: 138,
    r: 34,
  },
];

// The ramen stall (left). `b` is true for panel B.
function ramenStall(b) {
  const star = b
    ? ''
    : `<path d="M178 150 l6 13 14 1 -10 9 3 14 -13 -7 -13 7 3 -14 -10 -9 14 -1 z" fill="#ffe9a8" stroke="#c9402f" stroke-width="1.2"/>`;
  const windowShape = b
    ? `<rect x="146" y="272" width="64" height="60" rx="4" fill="#ffd98a" stroke="#5a3a22" stroke-width="3"/>
    <path d="M178 272 L178 332 M146 302 L210 302" stroke="#5a3a22" stroke-width="2.5"/>
    <circle cx="178" cy="302" r="10" fill="#fff3d6" opacity="0.85"/>`
    : `<circle cx="178" cy="302" r="32" fill="#ffd98a" stroke="#5a3a22" stroke-width="3"/>
    <path d="M178 270 L178 334 M146 302 L210 302" stroke="#5a3a22" stroke-width="2.5"/>
    <circle cx="178" cy="302" r="10" fill="#fff3d6" opacity="0.85"/>`;
  return `
  <g>
    <!-- building -->
    <rect x="58" y="210" width="244" height="240" fill="#6b4226" stroke="#3a2415" stroke-width="3"/>
    <rect x="58" y="210" width="244" height="26" fill="#8a5a33"/>
    <!-- tiled roof -->
    <path d="M40 214 L180 158 L320 214 Z" fill="#a03a30" stroke="#6e241d" stroke-width="3"/>
    <path d="M52 208 L180 160 L308 208" fill="none" stroke="#c95a48" stroke-width="2"/>
    <!-- sign -->
    ${signBoard(118, 178, 120, 42, '#f5e6c8', '#8a2f24', 'RAMEN', 'らあめん')}
    ${star}
    <!-- window: round in A, square in B -->
    ${windowShape}
    <!-- noren curtain -->
    <rect x="228" y="262" width="66" height="72" fill="#f5e6c8" stroke="#d8c49a" stroke-width="2"/>
    <path d="M228 262 L294 262 L294 300 L280 334 L266 300 L252 334 L238 300 L228 334 Z" fill="#f5e6c8" stroke="#d8c49a" stroke-width="1.5"/>
    <text x="261" y="292" text-anchor="middle" font-family="Georgia, serif" font-size="20" font-weight="bold" fill="#8a2f24">拉</text>
    <!-- counter with bowls -->
    <rect x="52" y="392" width="256" height="58" fill="#4a2e1a" stroke="#2a1a0c" stroke-width="3"/>
    <g>
      <ellipse cx="110" cy="398" rx="26" ry="8" fill="#e8dcc0"/>
      <path d="M86 398 a24 12 0 0 0 48 0 z" fill="#b8452f"/>
      <ellipse cx="110" cy="396" rx="18" ry="4" fill="#ffd98a"/>
      <ellipse cx="180" cy="398" rx="26" ry="8" fill="#e8dcc0"/>
      <path d="M156 398 a24 12 0 0 0 48 0 z" fill="#b8452f"/>
      <ellipse cx="180" cy="396" rx="18" ry="4" fill="#ffd98a"/>
      <ellipse cx="252" cy="398" rx="26" ry="8" fill="#e8dcc0"/>
      <path d="M228 398 a24 12 0 0 0 48 0 z" fill="#b8452f"/>
      <ellipse cx="252" cy="396" rx="18" ry="4" fill="#ffd98a"/>
    </g>
    <!-- steam -->
    <path d="M104 372 q6 -12 0 -22 q-6 -10 0 -18" stroke="#ffffff" stroke-width="3" fill="none" opacity="0.35" stroke-linecap="round"/>
    <path d="M176 372 q6 -12 0 -22 q-6 -10 0 -18" stroke="#ffffff" stroke-width="3" fill="none" opacity="0.3" stroke-linecap="round"/>
    <path d="M248 372 q6 -12 0 -22 q-6 -10 0 -18" stroke="#ffffff" stroke-width="3" fill="none" opacity="0.35" stroke-linecap="round"/>
    <!-- hanging lantern -->
    ${lantern(88, 250, 0.85, true)}
  </g>`;
}

// The dango / street-food stall (middle). `b` is true for panel B.
function dangoStall(b) {
  const umbrellaFill = b ? '#2fa8a0' : '#e2483d';
  const umbrellaDark = b ? '#1f7a74' : '#b03228';
  const skewer = b
    ? ''
    : `<g>
      <line x1="540" y1="402" x2="540" y2="436" stroke="#8a6a3a" stroke-width="3" stroke-linecap="round"/>
      <circle cx="540" cy="408" r="7" fill="#ff8fb3"/>
      <circle cx="540" cy="420" r="7" fill="#f5f0dc"/>
      <circle cx="540" cy="432" r="7" fill="#8fc97a"/>
    </g>`;
  return `
  <g>
    <!-- stall body -->
    <rect x="448" y="330" width="228" height="120" fill="#7a4a2b" stroke="#3a2415" stroke-width="3"/>
    <rect x="448" y="330" width="228" height="18" fill="#a06a3a"/>
    <!-- awning -->
    <path d="M436 330 L688 330 L676 300 L448 300 Z" fill="#2f8f7b" stroke="#1f6a5c" stroke-width="2"/>
    <path d="M436 330 L470 300 M504 330 L520 300 M572 330 L570 300 M640 330 L620 300" stroke="#1f6a5c" stroke-width="1.5"/>
    <!-- sign -->
    ${signBoard(492, 306, 140, 30, '#f5e6c8', '#1f6a5c', 'DANGO', 'だんご')}
    <!-- umbrella: red in A, teal in B -->
    <g>
      <line x1="562" y1="300" x2="562" y2="212" stroke="#5a3a22" stroke-width="4" stroke-linecap="round"/>
      <path d="M492 252 Q562 196 632 252 Q562 232 492 252 Z" fill="${umbrellaFill}" stroke="${umbrellaDark}" stroke-width="2"/>
      <path d="M512 240 Q562 214 612 240" fill="none" stroke="${umbrellaDark}" stroke-width="1.5"/>
      <circle cx="562" cy="212" r="5" fill="${umbrellaDark}"/>
    </g>
    <!-- counter with skewers -->
    <rect x="440" y="408" width="244" height="42" fill="#4a2e1a" stroke="#2a1a0c" stroke-width="3"/>
    ${skewer}
    <g>
      <line x1="592" y1="402" x2="592" y2="436" stroke="#8a6a3a" stroke-width="3" stroke-linecap="round"/>
      <circle cx="592" cy="408" r="7" fill="#ff8fb3"/>
      <circle cx="592" cy="420" r="7" fill="#f5f0dc"/>
      <circle cx="592" cy="432" r="7" fill="#8fc97a"/>
      <line x1="636" y1="402" x2="636" y2="436" stroke="#8a6a3a" stroke-width="3" stroke-linecap="round"/>
      <circle cx="636" cy="408" r="7" fill="#ff8fb3"/>
      <circle cx="636" cy="420" r="7" fill="#f5f0dc"/>
      <circle cx="636" cy="432" r="7" fill="#8fc97a"/>
    </g>
    <!-- paper lanterns on the stall -->
    ${lantern(470, 356, 0.7, false)}
    ${lantern(654, 356, 0.7, false)}
  </g>`;
}

// The flower shop (right) with the clock tower above it. `b` is true for panel B.
function flowerShop(b) {
  const flower = b
    ? ''
    : `<g>
      <path d="M832 470 L832 452" stroke="#3f7a3a" stroke-width="3"/>
      <circle cx="832" cy="446" r="7" fill="#ff8fb3"/>
      <circle cx="824" cy="452" r="6" fill="#ffb3c8"/>
      <circle cx="840" cy="452" r="6" fill="#ff6a9a"/>
      <circle cx="832" cy="452" r="4" fill="#ffe9a8"/>
      <path d="M812 482 L852 482 L848 506 L816 506 Z" fill="#b8452f" stroke="#7e2f20" stroke-width="2"/>
    </g>`;
  // Clock hands: 9:00 in A, 10:10 in B.
  const hands = b
    ? `<line x1="862" y1="138" x2="862" y2="118" stroke="#2a1c12" stroke-width="3" stroke-linecap="round"/>
       <line x1="862" y1="138" x2="878" y2="130" stroke="#2a1c12" stroke-width="3" stroke-linecap="round"/>`
    : `<line x1="862" y1="138" x2="862" y2="118" stroke="#2a1c12" stroke-width="3" stroke-linecap="round"/>
       <line x1="862" y1="138" x2="844" y2="138" stroke="#2a1c12" stroke-width="3" stroke-linecap="round"/>`;
  return `
  <g>
    <!-- clock tower -->
    <rect x="836" y="96" width="52" height="120" fill="#5a3a6e" stroke="#3a2450" stroke-width="3"/>
    <path d="M828 100 L862 74 L896 100 Z" fill="#7b5ea7" stroke="#4a3570" stroke-width="2"/>
    <circle cx="862" cy="138" r="26" fill="#f5e6c8" stroke="#2a1c12" stroke-width="3"/>
    <circle cx="862" cy="120" r="2" fill="#2a1c12"/><circle cx="862" cy="156" r="2" fill="#2a1c12"/>
    <circle cx="844" cy="138" r="2" fill="#2a1c12"/><circle cx="880" cy="138" r="2" fill="#2a1c12"/>
    ${hands}
    <circle cx="862" cy="138" r="3" fill="#b8452f"/>
    <!-- shop -->
    <rect x="740" y="216" width="216" height="234" fill="#6e4a8a" stroke="#3a2450" stroke-width="3"/>
    <rect x="740" y="216" width="216" height="24" fill="#8a6ab0"/>
    <path d="M724 220 L848 168 L972 220 Z" fill="#9a6ab8" stroke="#6a4a88" stroke-width="3"/>
    ${signBoard(778, 240, 140, 34, '#f5e6c8', '#5a3a6e', 'FLOWERS', 'はなや')}
    <!-- shop window with bouquets -->
    <rect x="762" y="292" width="86" height="84" rx="6" fill="#ffd98a" stroke="#4a3570" stroke-width="3"/>
    <circle cx="784" cy="330" r="10" fill="#ff8fb3"/><circle cx="806" cy="322" r="9" fill="#ffb3c8"/><circle cx="822" cy="336" r="9" fill="#ff6a9a"/>
    <path d="M784 340 L784 366 M806 332 L806 366 M822 346 L822 366" stroke="#3f7a3a" stroke-width="3"/>
    <rect x="872" y="292" width="62" height="84" rx="6" fill="#e8dcc0" stroke="#4a3570" stroke-width="3"/>
    <text x="903" y="330" text-anchor="middle" font-family="Georgia, serif" font-size="22" font-weight="bold" fill="#5a3a6e">花</text>
    <text x="903" y="356" text-anchor="middle" font-family="Georgia, serif" font-size="11" fill="#5a3a6e">OPEN</text>
    <!-- potted flower: present in A, missing in B -->
    ${flower}
    <!-- door -->
    <rect x="880" y="392" width="56" height="58" rx="4" fill="#4a2a5a" stroke="#2a1a3a" stroke-width="2"/>
    <circle cx="930" cy="422" r="3" fill="#ffe9a8"/>
  </g>`;
}

// The cat by the ramen stall. `b` is true for panel B (scarf gone).
function cat(b) {
  const scarf = b
    ? ''
    : `<path d="M308 464 Q332 454 356 464 L354 476 Q332 468 310 476 Z" fill="#d94040"/>
       <path d="M346 472 L358 494 L350 497 L340 474 Z" fill="#b03228"/>`;
  return `
  <g>
    <!-- tail -->
    <path d="M306 500 Q288 496 286 476 Q288 462 300 466" fill="none" stroke="#f2e3c6" stroke-width="9" stroke-linecap="round"/>
    <!-- body -->
    <ellipse cx="332" cy="492" rx="30" ry="24" fill="#f2e3c6" stroke="#d8c49a" stroke-width="2"/>
    <path d="M312 474 Q318 490 332 492 Q346 490 352 474 Q344 468 332 468 Q320 468 312 474" fill="#e8a04c" opacity="0.85"/>
    <!-- head -->
    <circle cx="332" cy="442" r="24" fill="#f2e3c6" stroke="#d8c49a" stroke-width="2"/>
    <path d="M314 424 L310 404 L326 416 Z" fill="#f2e3c6" stroke="#d8c49a" stroke-width="2"/>
    <path d="M350 424 L354 404 L338 416 Z" fill="#f2e3c6" stroke="#d8c49a" stroke-width="2"/>
    <path d="M314 424 L311 408 L323 417 Z" fill="#e8a04c"/>
    <path d="M350 424 L353 408 L341 417 Z" fill="#e8a04c"/>
    <!-- face -->
    <circle cx="324" cy="440" r="3" fill="#2a1c12"/>
    <circle cx="340" cy="440" r="3" fill="#2a1c12"/>
    <path d="M330 448 L334 448 L332 452 Z" fill="#d94040"/>
    <path d="M328 454 Q332 458 336 454" stroke="#2a1c12" stroke-width="1.5" fill="none" stroke-linecap="round"/>
    <circle cx="320" cy="448" r="4" fill="#ff9a8a" opacity="0.6"/>
    <circle cx="344" cy="448" r="4" fill="#ff9a8a" opacity="0.6"/>
    <!-- whiskers -->
    <path d="M312 444 L296 440 M312 450 L297 452 M352 444 L368 440 M352 450 L367 452" stroke="#b09a78" stroke-width="1.2"/>
    ${scarf}
  </g>`;
}

// A small frog sitting on a barrel near the dango stall.
function frog() {
  return `
  <g>
    <ellipse cx="706" cy="500" rx="26" ry="20" fill="#8a5a33" stroke="#4a2e1a" stroke-width="2"/>
    <path d="M686 486 L726 486" stroke="#4a2e1a" stroke-width="2"/>
    <circle cx="706" cy="462" r="20" fill="#7ac74f" stroke="#4a7a2a" stroke-width="2"/>
    <circle cx="696" cy="446" r="7" fill="#7ac74f" stroke="#4a7a2a" stroke-width="2"/>
    <circle cx="716" cy="446" r="7" fill="#7ac74f" stroke="#4a7a2a" stroke-width="2"/>
    <circle cx="696" cy="446" r="3.5" fill="#2a1c12"/>
    <circle cx="716" cy="446" r="3.5" fill="#2a1c12"/>
    <path d="M698 470 Q706 476 714 470" stroke="#2a1c12" stroke-width="1.8" fill="none" stroke-linecap="round"/>
    <circle cx="690" cy="462" r="3" fill="#ff9a8a" opacity="0.7"/>
    <circle cx="722" cy="462" r="3" fill="#ff9a8a" opacity="0.7"/>
  </g>`;
}

// String lights across the top. `b` is true for panel B (lantern at 212 gone).
function stringLights(b) {
  const lanterns = [
    { x: 118, y: 66 },
    { x: 212, y: 82 },
    { x: 318, y: 70 },
    { x: 700, y: 76 },
    { x: 918, y: 64 },
  ];
  let out = `<path d="M0 40 Q250 110 500 56 Q750 104 1000 44" fill="none" stroke="#3a2a1c" stroke-width="2"/>`;
  for (const l of lanterns) {
    if (b && l.x === 212) continue;
    out += lantern(l.x, l.y, 0.8, true);
  }
  return out;
}

// Street, puddles with lantern reflections, and the moon.
function streetAndSky() {
  return `
  <g>
    <rect x="0" y="0" width="1000" height="600" fill="url(#sky)"/>
    ${stars(20261121)}
    <!-- moon -->
    <circle cx="880" cy="86" r="44" fill="#ffe9a8" opacity="0.9"/>
    <circle cx="880" cy="86" r="58" fill="#ffe9a8" opacity="0.12"/>
    <circle cx="868" cy="76" r="8" fill="#f0d48a" opacity="0.7"/>
    <circle cx="894" cy="98" r="6" fill="#f0d48a" opacity="0.7"/>
    <circle cx="884" cy="70" r="4" fill="#f0d48a" opacity="0.6"/>
    <!-- distant rooftops -->
    <path d="M0 210 L60 178 L120 210 L180 182 L240 210 L300 186 L360 210 L420 184 L480 210 L540 186 L600 210 L660 182 L720 210 L780 186 L840 210 L900 184 L960 210 L1000 190 L1000 240 L0 240 Z" fill="#241a3d"/>
    <!-- street -->
    <rect x="0" y="450" width="1000" height="150" fill="#241a33"/>
    <path d="M0 450 L1000 450" stroke="#3d2f66" stroke-width="2"/>
    <!-- warm light pooling on the wet street under the lanterns -->
    <ellipse cx="500" cy="478" rx="430" ry="24" fill="#ffb347" opacity="0.07"/>
    <ellipse cx="180" cy="470" rx="150" ry="16" fill="#ff7a5c" opacity="0.08"/>
    <ellipse cx="840" cy="470" rx="130" ry="14" fill="#c9a8ff" opacity="0.07"/>
    <g fill="#2e2342">
      <ellipse cx="120" cy="520" rx="60" ry="10"/><ellipse cx="420" cy="560" rx="80" ry="12"/>
      <ellipse cx="700" cy="540" rx="70" ry="10"/><ellipse cx="920" cy="570" rx="60" ry="9"/>
    </g>
    <!-- puddles reflecting the lanterns -->
    <ellipse cx="150" cy="545" rx="46" ry="8" fill="#ff7a5c" opacity="0.16"/>
    <ellipse cx="150" cy="545" rx="26" ry="4" fill="#ffe9a8" opacity="0.2"/>
    <ellipse cx="560" cy="565" rx="52" ry="8" fill="#7ad0c0" opacity="0.14"/>
    <ellipse cx="860" cy="540" rx="40" ry="7" fill="#c9a8ff" opacity="0.16"/>
    ${rain(20261121)}
  </g>`;
}

// Render one panel. `variant` is 'A' (base) or 'B' (differences applied).
export function renderScene(variant) {
  const b = variant === 'B';
  return `<svg viewBox="0 0 1000 600" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Midnight Market scene, panel ${variant}">
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#171233"/>
      <stop offset="0.55" stop-color="#2d1b69"/>
      <stop offset="1" stop-color="#3a2060"/>
    </linearGradient>
  </defs>
  ${streetAndSky()}
  ${stringLights(b)}
  ${ramenStall(b)}
  ${dangoStall(b)}
  ${flowerShop(b)}
  ${cat(b)}
  ${frog()}
</svg>`;
}

export const MARKET = {
  id: 'market',
  name: 'Midnight Market',
  tagline: 'A rainy night market — lanterns, ramen and a very patient cat',
  timeLimit: 180,
  difficulty: 'Easy',
  par: '1:30',
  diffs: MARKET_DIFFS,
  render: renderScene,
};
