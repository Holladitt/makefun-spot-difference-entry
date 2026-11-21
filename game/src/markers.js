// markers.js — rings, sparkles and hint highlights drawn over a panel.
// Markers live in an overlay SVG that shares the scene's 0 0 1000 600
// viewBox, so scene coordinates map one to one.

// A found-difference marker: a warm glowing ring with a check and a burst
// of sparkles. Returns the SVG group element.
export function makeMarker(diff, index) {
  const ns = 'http://www.w3.org/2000/svg';
  const g = document.createElementNS(ns, 'g');
  g.setAttribute('class', 'marker');
  g.setAttribute('data-diff', diff.id);
  g.innerHTML = `
    <circle class="marker-ring" cx="${diff.x}" cy="${diff.y}" r="${diff.r + 6}" />
    <circle class="marker-ring2" cx="${diff.x}" cy="${diff.y}" r="${diff.r + 14}" />
    <circle cx="${diff.x}" cy="${diff.y}" r="${diff.r}" fill="none" stroke="#ffe9a8" stroke-width="2" stroke-dasharray="4 6" opacity="0.85" class="marker-dash"/>
    <g class="marker-check" transform="translate(${diff.x} ${diff.y})">
      <circle r="13" fill="#ffb347" stroke="#fff3d6" stroke-width="2"/>
      <text y="5" text-anchor="middle" font-size="15" font-weight="bold" fill="#5a2a00">${index + 1}</text>
    </g>
    <g class="marker-sparkles">
      ${[0, 45, 90, 135, 180, 225, 270, 315].map((a) => {
        const rad = (a * Math.PI) / 180;
        const x = Math.cos(rad) * (diff.r + 18);
        const y = Math.sin(rad) * (diff.r + 18);
        return `<circle cx="${diff.x + x}" cy="${diff.y + y}" r="3" fill="#ffe9a8" class="sparkle" style="--dx:${Math.cos(rad) * 14}px; --dy:${Math.sin(rad) * 14}px"/>`;
      }).join('')}
    </g>`;
  return g;
}

// A hint highlight: a cool dashed ring that pulses around an unfound
// difference for a short time, then fades. Returns the element; the caller
// removes it after the animation.
export function makeHint(diff) {
  const ns = 'http://www.w3.org/2000/svg';
  const g = document.createElementNS(ns, 'g');
  g.setAttribute('class', 'hint-ring');
  g.innerHTML = `
    <circle cx="${diff.x}" cy="${diff.y}" r="${diff.r + 10}" fill="none" stroke="#7ad0ff" stroke-width="3" stroke-dasharray="8 8" class="hint-pulse"/>
    <circle cx="${diff.x}" cy="${diff.y}" r="${diff.r + 22}" fill="none" stroke="#7ad0ff" stroke-width="1.5" opacity="0.5" class="hint-pulse2"/>`;
  return g;
}

// A miss ripple: a small red ring where the player clicked nothing.
export function makeMiss(x, y) {
  const ns = 'http://www.w3.org/2000/svg';
  const g = document.createElementNS(ns, 'g');
  g.setAttribute('class', 'miss-ring');
  g.innerHTML = `<circle cx="${x}" cy="${y}" r="10" fill="none" stroke="#ff6a5c" stroke-width="2.5" class="miss-pulse"/>
    <text x="${x}" y="${y + 4}" text-anchor="middle" font-size="13" font-weight="bold" fill="#ff8a7a">✕</text>`;
  return g;
}
