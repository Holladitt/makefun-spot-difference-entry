// differences.js — the 8 differences of MIDNIGHT MARKET.
// One source of truth: every difference is a circle in scene coordinates
// (the scene is 1000 x 600). Panel A shows the base scene, panel B shows
// the variant. `key` tells scene.js which element to change for panel B.
// `r` is the forgiving hitbox radius in scene units; input.js adds a
// further tolerance on top.
export const DIFFS = [
  {
    id: 'lantern-missing',
    short: 'Lentera',
    key: 'lantern',
    label: 'A paper lantern is missing from the string lights',
    x: 212,
    y: 82,
    r: 30,
  },
  {
    id: 'window-shape',
    short: 'Jendela',
    key: 'window',
    label: 'The ramen stall window changed shape',
    x: 178,
    y: 302,
    r: 42,
  },
  {
    id: 'cat-scarf',
    short: 'Syal kucing',
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
    short: 'Bintang',
    key: 'star',
    label: 'The star on the ramen sign is gone',
    x: 178,
    y: 198,
    r: 26,
  },
  {
    id: 'umbrella-color',
    short: 'Payung',
    key: 'umbrella',
    label: 'The stall umbrella changed colour',
    x: 562,
    y: 248,
    r: 40,
  },
  {
    id: 'flower-missing',
    short: 'Bunga',
    key: 'flower',
    label: 'A potted flower by the flower shop is missing',
    x: 832,
    y: 482,
    r: 30,
  },
  {
    id: 'clock-hands',
    short: 'Jam',
    key: 'clock',
    label: 'The clock tower shows a different time',
    x: 862,
    y: 138,
    r: 34,
  },
];

export const DIFF_COUNT = DIFFS.length;

// Hit test: true when scene point (x, y) is inside a difference's circle,
// with a forgiving extra tolerance in scene units.
export function hitDiff(x, y, tolerance = 14) {
  for (const d of DIFFS) {
    const dx = x - d.x;
    const dy = y - d.y;
    if (dx * dx + dy * dy <= (d.r + tolerance) * (d.r + tolerance)) return d;
  }
  return null;
}
