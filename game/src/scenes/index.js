// scenes/index.js — the three MIDNIGHT MARKET scenes and the shared hit
// test. Every scene is one object: its art (render), its 8 differences,
// its time limit and its difficulty. The game in main.js only ever talks
// to a scene through this module.
import { MARKET } from './market.js';
import { SHRINE } from './shrine.js';
import { RIVER } from './river.js';

export const SCENES = [MARKET, SHRINE, RIVER];

export function getScene(id) {
  return SCENES.find((s) => s.id === id) || SCENES[0];
}

export function sceneIndex(id) {
  return SCENES.findIndex((s) => s.id === id);
}

// Hit test against one scene's differences: true when scene point (x, y)
// is inside a difference's circle, with a forgiving extra tolerance.
// Already-found differences are skipped, so a click near a found
// difference can still reach a neighbouring unfound one.
export function hitDiff(scene, x, y, found = new Set(), tolerance = 14) {
  for (const d of scene.diffs) {
    if (found.has(d.id)) continue;
    const dx = x - d.x;
    const dy = y - d.y;
    if (dx * dx + dy * dy <= (d.r + tolerance) * (d.r + tolerance)) return d;
  }
  return null;
}
