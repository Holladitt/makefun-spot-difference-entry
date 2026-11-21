// audio.js — tiny synthesized sound effects with WebAudio. No audio files:
// every sound is an oscillator envelope, so the game ships zero media and
// makes no network request. All sounds are muted until the player
// interacts (browser autoplay policy) and while `muted` is on.
let ctx = null;
let muted = false;

function ensureCtx() {
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

export function setMuted(m) {
  muted = !!m;
}

export function isMuted() {
  return muted;
}

// One short tone: frequency sweep from f0 to f1 over `dur` seconds.
function tone(f0, f1, dur, type, vol, delay = 0) {
  if (muted) return;
  const ac = ensureCtx();
  if (!ac) return;
  const t0 = ac.currentTime + delay;
  const osc = ac.createOscillator();
  const gain = ac.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(f0, t0);
  osc.frequency.exponentialRampToValueAtTime(Math.max(1, f1), t0 + dur);
  gain.gain.setValueAtTime(0.0001, t0);
  gain.gain.exponentialRampToValueAtTime(vol, t0 + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  osc.connect(gain);
  gain.connect(ac.destination);
  osc.start(t0);
  osc.stop(t0 + dur + 0.05);
}

// A satisfying two-note chime when a difference is found.
export function playFound() {
  tone(660, 660, 0.12, 'sine', 0.22);
  tone(990, 990, 0.2, 'sine', 0.2, 0.09);
  tone(1320, 1320, 0.24, 'triangle', 0.1, 0.16);
}

// A soft low thud for a miss.
export function playMiss() {
  tone(180, 110, 0.16, 'triangle', 0.14);
}

// A bright sparkle arpeggio for the win.
export function playWin() {
  [523, 659, 784, 1047, 1319].forEach((f, i) => tone(f, f, 0.28, 'sine', 0.18, i * 0.11));
}

// A short blip for a hint.
export function playHint() {
  tone(880, 1174, 0.18, 'sine', 0.14);
}

// A quiet tick when the timer drops under 30 seconds.
export function playTick() {
  tone(1200, 1200, 0.05, 'square', 0.05);
}
