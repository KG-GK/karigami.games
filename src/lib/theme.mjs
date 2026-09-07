export const themes = ["paper", "ink", "red"];
export const themeBackgrounds = { paper: "#f7f5ef", ink: "#20211d", red: "#d6402a" };
export const themeStorageKey = "karigami-theme";
export const waveDuration = 1150;
export const glyphDuration = 180;

export function nextTheme(current) {
  const index = themes.indexOf(current);
  return themes[(Math.max(0, index) + 1) % themes.length];
}

export function waveGeometry(origin, width, height) {
  const x = Math.max(0, Math.min(origin.x, width));
  const y = Math.max(0, Math.min(origin.y, height));
  return { x, y, radius: Math.hypot(Math.max(x, width - x), Math.max(y, height - y)) + 4 };
}

export function glyphDelay(point, wave) {
  return Math.min(waveDuration, Math.hypot(point.x - wave.x, point.y - wave.y) / wave.radius * waveDuration);
}

// Executed before paint, so a saved preference also survives locale navigation.
export const themeBootScript = `(function(){try{var t=localStorage.getItem(${JSON.stringify(themeStorageKey)});if(${JSON.stringify(themes)}.includes(t)){document.documentElement.dataset.theme=t;}}catch{}})();`;
