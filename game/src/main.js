// main.js — MIDNIGHT MARKET v3 bootstrap and game state.
// Three scenes, two ways to play: one scene at a time, or Play All through
// all three in order. One state object drives everything: the two panels
// render from the active scene's model, clicks test against that scene's
// differences, and the HUD, markers and sounds all read this state.
// No randomness in gameplay: differences are fixed, hints take the first
// unfound one in list order.
import { SCENES, hitDiff } from './scenes/index.js';
import { makeMarker, makeHint, makeMiss } from './markers.js';
import { bindPanel, createCrosshair } from './input.js';
import { updateHud, showScreen, setMuteButton, floatScore, buildLevelSelect } from './ui.js';
import * as sfx from './audio.js';

const HINTS = 3;
const FIND_BASE = 100;
const STREAK_STEP = 20; // extra points per streak level
const STREAK_CAP = 5; // streak bonus caps at +100
const MISS_PENALTY = 10;
const HINT_COST = 25;

const state = {
  phase: 'start', // 'start' | 'playing' | 'scene-complete' | 'won' | 'timeout'
  mode: 'single', // 'single' | 'all'
  sceneIndex: 0,
  scene: SCENES[0],
  totalScenes: SCENES.length,
  total: SCENES[0].diffs.length,
  found: new Set(),
  score: 0, // running total (all banked scenes + current scene)
  sceneScore: 0, // net score earned in the current scene
  clicks: 0, // this scene
  misses: 0, // this scene
  totalClicks: 0,
  totalMisses: 0,
  streak: 0,
  bestStreak: 0, // best streak in the current scene
  totalBestStreak: 0,
  hintsLeft: HINTS,
  timeLeft: SCENES[0].timeLimit,
  breakdown: [], // per-scene results in Play All
  totalFound: 0,
  totalTimeUsed: 0,
  totalBonus: 0,
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
    sceneHost.innerHTML = state.scene.render(variant);
    const svg = sceneHost.querySelector('svg');
    const overlay = overlaySvg();
    el.appendChild(overlay);
    const cross = createCrosshair();
    el.appendChild(cross);
    return { el, svg, overlay, variant };
  });
}

// Re-render both panels for the active scene (used on scene change).
function remountScene() {
  for (const p of panels) {
    const sceneHost = p.el.querySelector('.scene');
    sceneHost.innerHTML = state.scene.render(p.variant);
    p.svg = sceneHost.querySelector('svg');
    p.overlay.innerHTML = '';
  }
}

function clearMarkers() {
  for (const p of panels) p.overlay.innerHTML = '';
}

function markFound(diff, index = state.found.size - 1) {
  panels.forEach((p, i) => {
    // Stagger the ring on the right panel by a beat for a nicer feel.
    const g = makeMarker(diff, index);
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

function bankedScore() {
  return state.breakdown.reduce((sum, row) => sum + row.score, 0);
}

function startScene(sceneIndex, mode) {
  state.mode = mode;
  state.sceneIndex = sceneIndex;
  state.scene = SCENES[sceneIndex];
  state.total = state.scene.diffs.length;
  state.phase = 'playing';
  state.found = new Set();
  state.sceneScore = 0;
  state.clicks = 0;
  state.misses = 0;
  state.streak = 0;
  state.bestStreak = 0;
  state.hintsLeft = HINTS;
  state.timeLeft = state.scene.timeLimit;
  if (mode === 'single') {
    state.score = 0;
    state.totalClicks = 0;
    state.totalMisses = 0;
    state.totalBestStreak = 0;
    state.breakdown = [];
    state.totalFound = 0;
    state.totalTimeUsed = 0;
    state.totalBonus = 0;
  } else {
    // Play All: keep the banked total from finished scenes.
    state.score = bankedScore();
  }
  remountScene();
  clearMarkers();
  for (const b of bindings) b.reset(); // crosshair back to the centre
  showScreen('');
  updateHud(state);
  startTimer();
  document.getElementById('panel-a').focus();
}

function startPlayAll() {
  // Fresh run: drop any banked results from a previous game.
  state.breakdown = [];
  state.totalFound = 0;
  state.totalTimeUsed = 0;
  state.totalBonus = 0;
  state.totalBestStreak = 0;
  state.totalClicks = 0;
  state.totalMisses = 0;
  startScene(0, 'all');
}

function endSceneWin() {
  stopTimer();
  const timeUsed = state.scene.timeLimit - state.timeLeft;
  const bonus = state.timeLeft * 2;
  state.score += bonus;
  state.sceneScore += bonus;
  state.totalFound += state.total;
  state.totalTimeUsed += timeUsed;
  state.totalBonus += bonus;
  state.totalBestStreak = Math.max(state.totalBestStreak, state.bestStreak);
  const accuracy = state.clicks === 0 ? 100 : Math.round(((state.clicks - state.misses) / state.clicks) * 100);
  state.breakdown.push({
    name: state.scene.name,
    score: state.sceneScore,
    found: state.total,
    total: state.total,
  });
  updateHud(state);
  sfx.playWin();
  if (state.mode === 'all' && state.sceneIndex < SCENES.length - 1) {
    state.phase = 'scene-complete';
    showScreen('scene-complete', {
      sceneName: state.scene.name,
      sceneScore: state.sceneScore,
      timeUsed,
      accuracy,
      bestStreak: state.bestStreak,
      bonus,
      nextLabel: `Next Scene: ${SCENES[state.sceneIndex + 1].name} →`,
    });
    return;
  }
  state.phase = 'won';
  const totalDiffs = state.mode === 'all'
    ? SCENES.reduce((sum, s) => sum + s.diffs.length, 0)
    : state.total;
  const overallAccuracy = state.totalClicks === 0
    ? 100
    : Math.round(((state.totalClicks - state.totalMisses) / state.totalClicks) * 100);
  showScreen('win', {
    timeUsed: state.totalTimeUsed,
    score: state.score,
    accuracy: overallAccuracy,
    bestStreak: state.totalBestStreak,
    bonus: state.totalBonus,
    totalFound: state.totalFound,
    totalDiffs,
    breakdown: state.breakdown,
  });
}

function endTimeout() {
  state.phase = 'timeout';
  stopTimer();
  updateHud(state);
  sfx.playMiss();
  showScreen('timeout', { found: state.found.size, total: state.total, sceneName: state.scene.name });
}

function onPick(diff, pt, panelEl) {
  if (state.phase !== 'playing') return;
  state.clicks += 1;
  state.totalClicks += 1;
  const panel = panels.find((p) => p.el === panelEl);
  if (diff) {
    state.found.add(diff.id);
    state.streak += 1;
    state.bestStreak = Math.max(state.bestStreak, state.streak);
    const points = FIND_BASE + STREAK_STEP * Math.min(state.streak - 1, STREAK_CAP);
    state.score += points;
    state.sceneScore += points;
    markFound(diff);
    floatScore(panelEl, pt.x, pt.y, `+${points}${state.streak >= 3 ? ` · Streak ×${state.streak}` : ''}`, true);
    if (state.streak >= 3) sfx.playStreak();
    else sfx.playFound();
    updateHud(state);
    if (state.found.size === state.total) endSceneWin();
    return;
  }
  if (!diff && hitDiff(state.scene, pt.x, pt.y, new Set())) {
    // Re-clicking a found difference: gentle reminder, no penalty.
    // (hitTest skips found differences, so this second test catches it.)
    floatScore(panelEl, pt.x, pt.y, 'Already found', true);
    return;
  }
  // A miss: streak breaks, small penalty, a red ripple, and the counter
  // stays honest.
  state.streak = 0;
  state.misses += 1;
  state.totalMisses += 1;
  state.score = Math.max(0, state.score - MISS_PENALTY);
  state.sceneScore = Math.max(0, state.sceneScore - MISS_PENALTY);
  const g = makeMiss(pt.x, pt.y);
  panel.overlay.appendChild(g);
  setTimeout(() => g.remove(), 900);
  floatScore(panelEl, pt.x, pt.y, `-${MISS_PENALTY}`, false);
  sfx.playMiss();
  updateHud(state);
}

function useHint() {
  if (state.phase !== 'playing' || state.hintsLeft <= 0) return;
  const next = state.scene.diffs.find((d) => !state.found.has(d.id));
  if (!next) return;
  state.hintsLeft -= 1;
  state.score = Math.max(0, state.score - HINT_COST);
  state.sceneScore = Math.max(0, state.sceneScore - HINT_COST);
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

function restartCurrentScene() {
  // Restart the current scene; in Play All the banked score from finished
  // scenes is kept.
  startScene(state.sceneIndex, state.mode);
}

function backToLevels() {
  state.phase = 'start';
  stopTimer();
  showScreen('start');
  updateHud(state);
}

function onKey(action) {
  if (action === 'hint') useHint();
  else if (action === 'restart') restartCurrentScene();
  else if (action === 'mute') toggleMute();
}

function hitTest(x, y) {
  return hitDiff(state.scene, x, y, state.found);
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
    const sceneIndex = Math.min(SCENES.length - 1, Math.max(0, Number(q.get('scene') || '1') - 1));
    const scene = SCENES[sceneIndex];
    state.sceneIndex = sceneIndex;
    state.scene = scene;
    state.total = scene.diffs.length;
    state.phase = 'playing';
    const n = Math.min(state.total, Math.max(0, Number(q.get('found') || '3')));
    state.timeLeft = scene.timeLimit - n * 12;
    for (let i = 0; i < n; i++) {
      state.found.add(scene.diffs[i].id);
      state.score += FIND_BASE;
      state.sceneScore += FIND_BASE;
      state.clicks += 1;
      state.totalClicks += 1;
      state.streak = n;
      state.bestStreak = n;
    }
    remountScene();
    // Markers are drawn after the remount (which clears the overlays).
    clearMarkers();
    for (let i = 0; i < n; i++) markFound(scene.diffs[i], i);
    showScreen('');
    updateHud(state);
    return;
  }
  if (shot === 'win') {
    // Final win screen: all three scenes finished, totals shown.
    const scene = SCENES[SCENES.length - 1];
    state.sceneIndex = SCENES.length - 1;
    state.scene = scene;
    state.total = scene.diffs.length;
    state.phase = 'won';
    state.timeLeft = 48;
    for (const d of scene.diffs) state.found.add(d.id);
    state.score = 2920;
    state.sceneScore = 900;
    state.clicks = 9;
    state.misses = 1;
    state.totalClicks = 27;
    state.totalMisses = 3;
    state.streak = 6;
    state.bestStreak = 6;
    state.totalBestStreak = 6;
    state.totalFound = 24;
    state.totalTimeUsed = 252;
    state.totalBonus = 396;
    remountScene();
    clearMarkers();
    scene.diffs.forEach((d, i) => markFound(d, i));
    showScreen('win', {
      timeUsed: 252,
      score: 2920,
      accuracy: 89,
      bestStreak: 6,
      bonus: 396,
      totalFound: 24,
      totalDiffs: 24,
      breakdown: [
        { name: 'Midnight Market', score: 1040, found: 8, total: 8 },
        { name: 'Shrine Festival', score: 980, found: 8, total: 8 },
        { name: 'Lantern River', score: 900, found: 8, total: 8 },
      ],
    });
    updateHud(state);
  }
}

function init() {
  mountPanels();
  for (const p of panels) {
    bindings.push(bindPanel(p.el, p.svg, { onPick, onKey, hitTest }));
  }
  buildLevelSelect((i) => startScene(i, 'single'));
  document.getElementById('play-all-btn').addEventListener('click', startPlayAll);
  document.getElementById('next-scene-btn').addEventListener('click', () => {
    startScene(state.sceneIndex + 1, 'all');
  });
  document.getElementById('sc-levels-btn').addEventListener('click', backToLevels);
  document.getElementById('play-again-btn').addEventListener('click', () => {
    if (state.mode === 'all') startPlayAll();
    else startScene(state.sceneIndex, 'single');
  });
  document.getElementById('win-levels-btn').addEventListener('click', backToLevels);
  document.getElementById('retry-btn').addEventListener('click', () => {
    if (state.mode === 'all') startPlayAll();
    else startScene(state.sceneIndex, 'single');
  });
  document.getElementById('timeout-levels-btn').addEventListener('click', backToLevels);
  document.getElementById('hint-btn').addEventListener('click', useHint);
  document.getElementById('restart-btn').addEventListener('click', restartCurrentScene);
  document.getElementById('mute-btn').addEventListener('click', toggleMute);
  setMuteButton(false);
  showScreen('start');
  updateHud(state);
  applyShotMode();

  // A small handle for automated tests (and nothing else): the live state
  // and a direct pick, so QA can drive the game without faking clicks.
  window.__game = {
    state,
    scenes: SCENES,
    startScene,
    startPlayAll,
    backToLevels,
    pickAt(x, y) {
      const d = hitDiff(state.scene, x, y, state.found);
      onPick(d || null, { x, y }, panels[0].el);
      return d ? d.id : null;
    },
    start: (sceneIndex = 0, mode = 'single') => startScene(sceneIndex, mode),
    hint: useHint,
  };
}

init();
