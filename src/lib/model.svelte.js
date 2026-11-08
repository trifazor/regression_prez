// Shared sample, filters and fitted results. Every slide reads from here.
import { fit, py } from './pyodide.svelte.js';

export const sample = $state({ rows: [], loaded: false });

export const filters = $state({
  sex: 'all',        // 'all' | 1 | 2
  ageMin: 18,
  ageMax: 85,
  incomeCap: 12000,  // drop respondents above this income
  dropHighLeverage: false,
});

export const view = $state({ degree: 2 }); // FR-2 toggle: 1 = linear, 2 = quadratic

export const fitted = $state({ res: null, full: null });

export const MIN_N = 15;

export async function loadSample() {
  const base = import.meta.env.BASE_URL;
  const d = await (await fetch(`${base}data/allbus2016_subsample.json`)).json();
  sample.rows = d.income.map((_, i) => ({ id: i, income: d.income[i], age: d.age[i], age_sq: d.age_sq[i], sex: d.sex[i] }));
  sample.loaded = true;
  return d;
}

export function activeMask() {
  const f = filters;
  return sample.rows.map((r) =>
    (f.sex === 'all' || r.sex === f.sex) && r.age >= f.ageMin && r.age <= f.ageMax && r.income <= f.incomeCap);
}

/** Recompute fits; called from an $effect in App so it reacts to every filter change. */
export function refit() {
  if (py.status !== 'ready' || !sample.loaded) return;
  const all = sample.rows.map(() => true);
  fitted.full ??= fit(all);
  let mask = activeMask();
  if (mask.filter(Boolean).length < MIN_N) { fitted.res = null; return; }
  let res = fit(mask);
  if (filters.dropHighLeverage) {
    // Rule of thumb: h_ii > 2k/n flags high leverage (k = 3 for the quadratic model).
    const cut = (2 * 3) / res.n;
    res.idx.forEach((id, j) => { if (res.quadratic.hat[j] > cut) mask[id] = false; });
    res = fit(mask);
  }
  fitted.res = res;
}

export function csvString(rows = sample.rows) {
  const lines = ['income,age,age_sq,sex', ...rows.map((r) => `${r.income},${r.age},${r.age_sq},${r.sex}`)];
  return lines.join('\n') + '\n';
}
