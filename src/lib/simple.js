// Closed-form simple regression in JS. Used only where Python round-trips would be overkill:
// dragging lines/points at 60 fps. Everything else goes through the Pyodide engine.
export function simpleOLS(pts) {
  const n = pts.length;
  const mx = pts.reduce((s, p) => s + p.x, 0) / n;
  const my = pts.reduce((s, p) => s + p.y, 0) / n;
  let sxx = 0, sxy = 0;
  for (const p of pts) { sxx += (p.x - mx) ** 2; sxy += (p.x - mx) * (p.y - my); }
  const b = sxy / sxx, a = my - b * mx;
  const rss = pts.reduce((s, p) => s + (p.y - a - b * p.x) ** 2, 0);
  const tss = pts.reduce((s, p) => s + (p.y - my) ** 2, 0);
  const hat = pts.map((p) => 1 / n + (p.x - mx) ** 2 / sxx);
  return { a, b, rss, r2: 1 - rss / tss, hat, mx };
}

export const rssOf = (pts, a, b) => pts.reduce((s, p) => s + (p.y - a - b * p.x) ** 2, 0);

export const linspace = (lo, hi, n = 60) => Array.from({ length: n }, (_, i) => lo + ((hi - lo) * i) / (n - 1));
