// input.js — mouse clicks and keyboard play on a scene panel.
// Every click is converted to scene coordinates (0..1000 x 0..600) from the
// panel's rendered size, so hitboxes stay correct at any viewport size.
// Keyboard play moves a visible crosshair with the arrow keys and confirms
// with Enter or Space, so the whole game is playable without a mouse.
import { hitDiff } from './differences.js';

const STEP = 18; // scene units per arrow press
const STEP_BIG = 54; // with Shift held

// Convert a pointer event to scene coordinates using the scene SVG's box.
export function scenePointFromEvent(evt, svgEl) {
  const rect = svgEl.getBoundingClientRect();
  if (rect.width === 0 || rect.height === 0) return null;
  const x = ((evt.clientX - rect.left) / rect.width) * 1000;
  const y = ((evt.clientY - rect.top) / rect.height) * 600;
  if (x < 0 || x > 1000 || y < 0 || y > 600) return null;
  return { x, y };
}

// Build a crosshair element for a panel. It is positioned with left/top in
// percent of the panel, so it tracks the panel at any size.
export function createCrosshair() {
  const el = document.createElement('div');
  el.className = 'crosshair';
  el.setAttribute('aria-hidden', 'true');
  el.innerHTML = '<span class="ch-h"></span><span class="ch-v"></span><span class="ch-dot"></span>';
  return el;
}

// Wire one panel (the div wrapping a scene SVG + overlay + crosshair).
// handlers: { onPick(diff|null, point, panel), onKey(action) } where action
// is 'hint' | 'restart' | 'mute' for the global shortcuts.
export function bindPanel(panelEl, svgEl, handlers) {
  const cross = panelEl.querySelector('.crosshair');
  let pos = { x: 500, y: 300 };
  let crossVisible = false;

  function placeCross() {
    cross.style.left = `${(pos.x / 1000) * 100}%`;
    cross.style.top = `${(pos.y / 600) * 100}%`;
  }
  placeCross();

  function showCross() {
    if (!crossVisible) {
      crossVisible = true;
      cross.classList.add('on');
    }
  }

  // Mouse: clicking anywhere on the panel tests the point against the
  // differences and reports the result.
  panelEl.addEventListener('pointerdown', (evt) => {
    const pt = scenePointFromEvent(evt, svgEl);
    if (!pt) return;
    pos = pt;
    placeCross();
    showCross();
    handlers.onPick(hitDiff(pt.x, pt.y), pt, panelEl);
  });

  panelEl.addEventListener('pointermove', (evt) => {
    const pt = scenePointFromEvent(evt, svgEl);
    if (!pt) return;
    pos = pt;
    placeCross();
  });

  // Keyboard: arrows move the crosshair, Enter/Space clicks at it.
  panelEl.addEventListener('keydown', (evt) => {
    const step = evt.shiftKey ? STEP_BIG : STEP;
    let used = true;
    if (evt.key === 'ArrowLeft') pos.x = Math.max(0, pos.x - step);
    else if (evt.key === 'ArrowRight') pos.x = Math.min(1000, pos.x + step);
    else if (evt.key === 'ArrowUp') pos.y = Math.max(0, pos.y - step);
    else if (evt.key === 'ArrowDown') pos.y = Math.min(600, pos.y + step);
    else if (evt.key === 'Enter' || evt.key === ' ') {
      handlers.onPick(hitDiff(pos.x, pos.y), { ...pos }, panelEl);
    } else if (evt.key === 'h' || evt.key === 'H') handlers.onKey('hint');
    else if (evt.key === 'r' || evt.key === 'R') handlers.onKey('restart');
    else if (evt.key === 'm' || evt.key === 'M') handlers.onKey('mute');
    else used = false;
    if (used) {
      evt.preventDefault();
      showCross();
      placeCross();
    }
  });

  panelEl.addEventListener('focus', showCross);

  return {
    // Reset the crosshair to the centre (used on restart).
    reset() {
      pos = { x: 500, y: 300 };
      placeCross();
    },
    position() {
      return { ...pos };
    },
  };
}
