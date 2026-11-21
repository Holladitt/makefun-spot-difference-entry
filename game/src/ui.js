// ui.js — the HUD, the screens and the little floating score popups.
// All text the player sees lives here (or in index.html); the game logic
// in main.js only hands ui.js numbers.
import { DIFFS } from './differences.js';

const $ = (id) => document.getElementById(id);

// Update every HUD field from the current game state.
export function updateHud(state) {
  const remaining = state.total - state.found.size;
  $('counter').textContent = `Tersisa ${remaining} / ${state.total}`;
  $('score').textContent = String(state.score);
  $('hints-left').textContent = String(state.hintsLeft);
  $('timer').textContent = formatTime(state.timeLeft);
  $('timer').classList.toggle('urgent', state.timeLeft <= 30 && state.phase === 'playing');
  $('hint-btn').disabled = state.hintsLeft <= 0 || state.phase !== 'playing';

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

  // Found-differences strip: one chip per difference; unfound chips show
  // a "?" and found ones reveal their name.
  const list = $('found-list');
  if (list.childElementCount !== state.total) {
    list.innerHTML = '';
    for (const d of DIFFS) {
      const c = document.createElement('span');
      c.className = 'chip';
      c.dataset.diff = d.id;
      list.appendChild(c);
    }
  }
  [...list.children].forEach((c) => {
    const d = DIFFS.find((x) => x.id === c.dataset.diff);
    const isFound = state.found.has(d.id);
    c.classList.toggle('found', isFound);
    c.textContent = isFound ? `✓ ${d.short}` : '?';
  });
}

export function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

// Show one overlay screen and hide the others. Names: 'start', 'win',
// 'timeout', or '' for none (plain gameplay).
export function showScreen(name, stats) {
  for (const id of ['screen-start', 'screen-win', 'screen-timeout']) {
    $(id).classList.toggle('hidden', id !== `screen-${name}`);
  }
  if (name === 'win' && stats) {
    $('win-time').textContent = formatTime(stats.timeUsed);
    $('win-score').textContent = String(stats.score);
    $('win-acc').textContent = `${stats.accuracy}%`;
    $('win-bonus').textContent = `+${stats.bonus} bonus waktu`;
  }
  if (name === 'timeout' && stats) {
    $('timeout-found').textContent = `${stats.found} / ${stats.total}`;
  }
}

export function setMuteButton(muted) {
  $('mute-btn').textContent = muted ? '🔇 Suara mati' : '🔊 Suara hidup';
  $('mute-btn').setAttribute('aria-pressed', String(muted));
}

// A floating "+100" that rises and fades at a click point inside a panel.
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
