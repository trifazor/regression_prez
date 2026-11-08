// Small synthetic datasets, each built to show ONE idea or ONE failure in isolation.
// Seeded so every run (and every student) sees the same points.

function rng(seed) {
  let a = seed >>> 0;
  const u = () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const n = () => Math.sqrt(-2 * Math.log(u() + 1e-12)) * Math.cos(2 * Math.PI * u());
  return { u, n };
}

const r1 = (v) => Math.round(v * 10) / 10;

/** Study hours vs exam score: a clean linear relationship. */
export const study = (() => {
  const { u, n } = rng(7);
  return Array.from({ length: 24 }, () => {
    const x = r1(1 + u() * 19);
    return { x, y: r1(38 + 2.1 * x + n() * 7) };
  });
})();

/** Hazard 1: true relationship is curved. */
export const curved = (() => {
  const { u, n } = rng(11);
  return Array.from({ length: 70 }, () => {
    const x = r1(u() * 10);
    return { x, y: r1(2 + 4.2 * x - 0.42 * x * x + n() * 1.3) };
  });
})();

/** Hazard 2: omitted variable. Weaker students get more tutoring, so pooled slope flips sign. */
export const tutoring = (() => {
  const { u, n } = rng(23);
  const pts = [];
  for (let i = 0; i < 40; i++) { const x = r1(u() * 5); pts.push({ x, y: r1(72 + 2.4 * x + n() * 4), g: 0 }); }
  for (let i = 0; i < 40; i++) { const x = r1(5 + u() * 5); pts.push({ x, y: r1(40 + 2.4 * x + n() * 4), g: 1 }); }
  return pts;
})();

/** Hazard 3: a small sample where one point can be dragged around. */
export const lever = (() => {
  const { u, n } = rng(5);
  const pts = Array.from({ length: 18 }, () => { const x = r1(2 + u() * 6); return { x, y: r1(10 + 1.5 * x + n() * 1.6) }; });
  pts.push({ x: 9, y: r1(10 + 1.5 * 9), drag: true });
  return pts;
})();

/** Hazard 4: spread grows with x (heteroskedasticity). */
export const fan = (() => {
  const { u, n } = rng(31);
  return Array.from({ length: 150 }, () => { const x = r1(1 + u() * 9); return { x, y: r1(5 + 3 * x + n() * 0.9 * x) }; });
})();

/** Hazard 5: ice cream and sunburns, both driven by temperature. */
export const icecream = (() => {
  const { u, n } = rng(41);
  return Array.from({ length: 60 }, () => {
    const t = r1(8 + u() * 24); // temperature °C
    return { x: Math.round(20 + 6 * t + n() * 18), y: Math.max(0, Math.round(-8 + 1.1 * t + n() * 3)), t };
  });
})();
