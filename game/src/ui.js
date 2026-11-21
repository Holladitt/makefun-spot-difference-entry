// ui.js — the HUD, the level select, the screens and the little floating
// score popups. All text the player sees lives here (or in index.html);
// the game logic in main.js only hands ui.js numbers.
import { SCENES } from './scenes/index.js';

const $ = (id) => document.getElementById(id);

let lastSceneId = null;
let lastTotal = 0;

export function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

// Update every HUD field from the current game state.
export function updateHud(state) {
  const scene = state.scene;
  $('scene-label').textContent = `Scene ${state.sceneIndex + 1} of ${state.totalScenes} · ${scene.name}`;
  const remaining = state.total - state.found.size;
  $('counter').textContent = `Remaining ${remaining} / ${state.total}`;
  $('score').textContent = String(state.score);
  $('streak').textContent = `×${state.streak}`;
  $('streak-stat').classList.toggle('hot', state.streak >= 3);
  $('hints-left').textContent = String(state.hintsLeft);
  $('timer').textContent = formatTime(state.timeLeft);
  $('timer').classList.toggle('urgent', state.timeLeft <= 30 && state.phase === 'playing');
  $('hint-btn').disabled = state.hintsLeft <= 0 || state.phase !== 'playing';

  // Time pressure, visible as a draining bar under the header.
  const frac = state.timeLeft / scene.timeLimit;
  const fill = $('timebar-fill');
  fill.style.width = `${Math.max(0, Math.min(1, frac)) * 100}%`;
  fill.classList.toggle('urgent', state.timeLeft <= 30 && state.phase === 'playing');

  // Progress dots: one per difference, filled when found.
  const dots = $('dots');
  if (dots.childElementCount !== state.total) {
    dots.innerHTML = '';
    for (let i = 0; i < state.total; i++) {
      const d = document.createElement('span');
      d.className = 'dot';
      dots.appendChild(d);
    }
  }
  [...dots.children].forEach((d, i) => {
    d.classList.toggle('found', i < state.found.size);
  });

  // Found-differences strip: rebuilt when the scene changes, so the chips
  // always name the current scene's differences.
  const list = $('found-list');
  if (lastSceneId !== scene.id || lastTotal !== state.total) {
    lastSceneId = scene.id;
    lastTotal = state.total;
    list.innerHTML = '';
    for (const d of scene.diffs) {
      const c = document.createElement('span');
      c.className = 'chip';
      c.dataset.diff = d.id;
      list.appendChild(c);
    }
  }
  [...list.children].forEach((c) => {
    const d = scene.diffs.find((x) => x.id === c.dataset.diff);
    if (!d) return;
    const isFound = state.found.has(d.id);
    c.classList.toggle('found', isFound);
    c.textContent = isFound ? `✓ ${d.short}` : '?';
  });

  // Observable phase for tests/debugging (also drives body-level CSS hooks).
  document.body.dataset.phase = state.phase;
}

// Build the level-select cards on the start screen: a live miniature of
// each scene (the real scene SVG, scaled down), its name, its par time
// and its difficulty. onPick(sceneIndex) starts that scene.
export function buildLevelSelect(onPick) {
  const host = $('level-cards');
  host.innerHTML = '';
  SCENES.forEach((scene, i) => {
    const card = document.createElement('button');
    card.type = 'button';
    card.className = 'level-card';
    card.innerHTML = `
      <span class="level-preview">${scene.render('A')}</span>
      <span class="level-name">${i + 1}. ${scene.name}</span>
      <span class="level-meta">${scene.diffs.length} differences · ${formatTime(scene.timeLimit)}</span>
      <span class="level-diff ${scene.difficulty.toLowerCase()}">${scene.difficulty}</span>`;
    card.addEventListener('click', () => onPick(i));
    host.appendChild(card);
  });
}

// Show one overlay screen and hide the others. Names: 'start',
// 'scene-complete', 'win', 'timeout', or '' for none (plain gameplay).
export function showScreen(name, stats) {
  const ids = {
    start: 'screen-start',
    'scene-complete': 'screen-scene',
    win: 'screen-win',
    timeout: 'screen-timeout',
  };
  for (const id of Object.values(ids)) {
    $(id).classList.toggle('hidden', id !== ids[name]);
  }
  if (name === 'scene-complete' && stats) {
    $('sc-name').textContent = stats.sceneName;
    $('sc-time').textContent = formatTime(stats.timeUsed);
    $('sc-score').textContent = String(stats.sceneScore);
    $('sc-acc').textContent = `${stats.accuracy}%`;
    $('sc-streak').textContent = `×${stats.bestStreak}`;
    $('sc-bonus').textContent = `+${stats.bonus} time bonus`;
    $('next-scene-btn').textContent = stats.nextLabel;
  }
  if (name === 'win' && stats) {
    $('win-sub').textContent = stats.totalDiffs === 24
      ? 'You found every difference in every scene.'
      : `You found all ${stats.totalDiffs} differences in ${stats.breakdown[0].name}.`;
    $('win-time').textContent = formatTime(stats.timeUsed);
    $('win-score').textContent = String(stats.score);
    $('win-acc').textContent = `${stats.accuracy}%`;
    $('win-streak').textContent = `×${stats.bestStreak}`;
    $('win-bonus').textContent = `+${stats.bonus} time bonus · ${stats.totalFound} / ${stats.totalDiffs} differences found`;
    const rows = $('win-breakdown');
    rows.innerHTML = '';
    for (const row of stats.breakdown) {
      const el = document.createElement('div');
      el.className = 'break-row';
      el.innerHTML = `<span>${row.name}</span><span>${row.found} / ${row.total} found</span><span>${row.score} pts</span>`;
      rows.appendChild(el);
    }
  }
  if (name === 'timeout' && stats) {
    $('timeout-found').textContent = `${stats.found} / ${stats.total}`;
    $('timeout-scene').textContent = stats.sceneName;
  }
}

export function setMuteButton(muted) {
  $('mute-btn').textContent = muted ? '🔇 Sound off' : '🔊 Sound on';
  $('mute-btn').setAttribute('aria-pressed', String(muted));
}

// A floating "+120" that rises and fades at a click point inside a panel.
export function floatScore(panelEl, sceneX, sceneY, text, good) {
  const el = document.createElement('div');
  el.className = `float-score ${good ? 'good' : 'bad'}`;
  el.style.left = `${(sceneX / 1000) * 100}%`;
  el.style.top = `${(sceneY / 600) * 100}%`;
  el.textContent = text;
  panelEl.appendChild(el);
  el.addEventListener('animationend', () => el.remove());
  setTimeout(() => el.remove(), 1400);
}
