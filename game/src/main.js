// main.js — MIDNIGHT MARKET bootstrap and game state.
// One state object drives everything: the two panels render from the same
// scene model, clicks test against the same 8 differences, and the HUD,
// markers and sounds all read this state. No randomness in gameplay:
// differences are fixed, hints take the first unfound one in list order.
import { DIFFS, DIFF_COUNT } from './differences.js';
import { renderScene } from './scene.js';
import { makeMarker, makeHint, makeMiss } from './markers.js';
import { bindPanel, createCrosshair } from './input.js';
import { updateHud, showScreen, setMuteButton, floatScore } from './ui.js';
import * as sfx from './audio.js';

const TIME_LIMIT = 180; // seconds
const HINTS = 3;
const FIND_POINTS = 100;
const MISS_PENALTY = 10;
const HINT_COST = 25;

const state = {
  phase: 'start', // 'start' | 'playing' | 'won' | 'timeout'
  found: new Set(),
  score: 0,
  clicks: 0,
  misses: 0,
  hintsLeft: HINTS,
  timeLeft: TIME_LIMIT,
  total: DIFF_COUNT,
};

let timerId = null;
let panels = []; // { el, svg, overlay }
let bindings = []; // per-panel input bindings (crosshair control)
let frozen = false; // true in ?shot= modes: the timer never ticks

function overlaySvg() {
  const ns = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(ns, 'svg');
  svg.setAttribute('viewBox', '0 0 1000 600');
  svg.setAttribute('class', 'overlay');
  svg.setAttribute('aria-hidden', 'true');
  return svg;
}

function mountPanels() {
  const defs = [
    { id: 'panel-a', variant: 'A', label: 'Left panel' },
    { id: 'panel-b', variant: 'B', label: 'Right panel' },
  ];
  panels = defs.map(({ id, variant }) => {
    const el = document.getElementById(id);
    const sceneHost = el.querySelector('.scene');
    sceneHost.innerHTML = renderScene(variant);
    const svg = sceneHost.querySelector('svg');
    const overlay = overlaySvg();
    el.appendChild(overlay);
    const cross = createCrosshair();
    el.appendChild(cross);
    return { el, svg, overlay, variant };
  });
}

function clearMarkers() {
  for (const p of panels) p.overlay.innerHTML = '';
}

function markFound(diff) {
  panels.forEach((p, i) => {
    // Stagger the ring on the right panel by a beat for a nicer feel.
    const g = makeMarker(diff, state.found.size - 1);
    if (i === 1) g.style.animationDelay = '0.08s';
    p.overlay.appendChild(g);
  });
}

function startTimer() {
  stopTimer();
  if (frozen) return;
  timerId = setInterval(() => {
    if (state.phase !== 'playing') return;
    state.timeLeft -= 1;
    if (state.timeLeft <= 10 && state.timeLeft > 0) sfx.playTick();
    if (state.timeLeft <= 0) {
      state.timeLeft = 0;
      endTimeout();
    }
    updateHud(state);
  }, 1000);
}

function stopTimer() {
  if (timerId !== null) {
    clearInterval(timerId);
    timerId = null;
  }
}

function startGame() {
  state.phase = 'playing';
  state.found = new Set();
  state.score = 0;
  state.clicks = 0;
  state.misses = 0;
  state.hintsLeft = HINTS;
  state.timeLeft = TIME_LIMIT;
  clearMarkers();
  for (const b of bindings) b.reset(); // crosshair back to the centre
  showScreen('');
  updateHud(state);
  startTimer();
  document.getElementById('panel-a').focus();
}

function endWin() {
  state.phase = 'won';
  stopTimer();
  const timeUsed = TIME_LIMIT - state.timeLeft;
  const bonus = state.timeLeft * 2;
  state.score += bonus;
  const accuracy = state.clicks === 0 ? 100 : Math.round(((state.clicks - state.misses) / state.clicks) * 100);
  updateHud(state);
  sfx.playWin();
  showScreen('win', { timeUsed, score: state.score, accuracy, bonus });
}

function endTimeout() {
  state.phase = 'timeout';
  stopTimer();
  updateHud(state);
  sfx.playMiss();
  showScreen('timeout', { found: state.found.size, total: state.total });
}

function onPick(diff, pt, panelEl) {
  if (state.phase !== 'playing') return;
  state.clicks += 1;
  const panel = panels.find((p) => p.el === panelEl);
  if (diff && !state.found.has(diff.id)) {
    state.found.add(diff.id);
    state.score += FIND_POINTS;
    markFound(diff);
    floatScore(panelEl, pt.x, pt.y, `+${FIND_POINTS}`, true);
    sfx.playFound();
    updateHud(state);
    if (state.found.size === state.total) endWin();
    return;
  }
  if (diff && state.found.has(diff.id)) {
    // Re-clicking a found difference: gentle reminder, no penalty.
    floatScore(panelEl, pt.x, pt.y, 'Already found', true);
    return;
  }
  // A miss: small penalty, a red ripple, and the counter stays honest.
  state.misses += 1;
  state.score = Math.max(0, state.score - MISS_PENALTY);
  const g = makeMiss(pt.x, pt.y);
  panel.overlay.appendChild(g);
  setTimeout(() => g.remove(), 900);
  floatScore(panelEl, pt.x, pt.y, `-${MISS_PENALTY}`, false);
  sfx.playMiss();
  updateHud(state);
}

function useHint() {
  if (state.phase !== 'playing' || state.hintsLeft <= 0) return;
  const next = DIFFS.find((d) => !state.found.has(d.id));
  if (!next) return;
  state.hintsLeft -= 1;
  state.score = Math.max(0, state.score - HINT_COST);
  for (const p of panels) {
    const g = makeHint(next);
    p.overlay.appendChild(g);
    setTimeout(() => g.remove(), 1700);
  }
  sfx.playHint();
  updateHud(state);
}

function toggleMute() {
  sfx.setMuted(!sfx.isMuted());
  setMuteButton(sfx.isMuted());
}

function onKey(action) {
  if (action === 'hint') useHint();
  else if (action === 'restart') startGame();
  else if (action === 'mute') toggleMute();
}

// Screenshot modes (?shot=...): deterministic states for the entry's
// screenshots, taken from the real running game. The timer is frozen in
// these modes so every capture is identical.
function applyShotMode() {
  const q = new URLSearchParams(location.search);
  const shot = q.get('shot');
  if (!shot) return;
  frozen = true;
  if (shot === 'start') {
    showScreen('start');
    updateHud(state);
    return;
  }
  if (shot === 'play') {
    const n = Math.min(DIFF_COUNT, Math.max(0, Number(q.get('found') || '3')));
    state.phase = 'playing';
    state.timeLeft = TIME_LIMIT - n * 12;
    for (let i = 0; i < n; i++) {
      state.found.add(DIFFS[i].id);
      state.score += FIND_POINTS;
      state.clicks += 1;
      markFound(DIFFS[i]);
    }
    showScreen('');
    updateHud(state);
    return;
  }
  if (shot === 'win') {
    state.phase = 'won';
    state.timeLeft = 84;
    for (const d of DIFFS) state.found.add(d.id);
    state.score = 1040;
    state.clicks = 9;
    state.misses = 1;
    showScreen('win', { timeUsed: 96, score: 1040, accuracy: 89, bonus: 168 });
    updateHud(state);
  }
}

function init() {
  mountPanels();
  for (const p of panels) {
    bindings.push(bindPanel(p.el, p.svg, { onPick, onKey }));
  }
  document.getElementById('start-btn').addEventListener('click', startGame);
  document.getElementById('play-again-btn').addEventListener('click', startGame);
  document.getElementById('retry-btn').addEventListener('click', startGame);
  document.getElementById('hint-btn').addEventListener('click', useHint);
  document.getElementById('restart-btn').addEventListener('click', startGame);
  document.getElementById('mute-btn').addEventListener('click', toggleMute);
  setMuteButton(false);
  showScreen('start');
  updateHud(state);
  applyShotMode();

  // A small handle for automated tests (and nothing else): the live state
  // and a direct pick, so QA can drive the game without faking clicks.
  window.__game = {
    state,
    pickAt(x, y) {
      const d = DIFFS.find((dd) => {
        const dx = x - dd.x;
        const dy = y - dd.y;
        return dx * dx + dy * dy <= (dd.r + 14) * (dd.r + 14);
      });
      onPick(d || null, { x, y }, panels[0].el);
      return d ? d.id : null;
    },
    start: startGame,
    hint: useHint,
  };
  document.body.dataset.phase = state.phase;
}

init();
