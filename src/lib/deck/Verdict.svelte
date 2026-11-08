<script>
  // Run every Part-3 hazard against the real result.
  import SlideHead from '../SlideHead.svelte';
  import Term from '../explain/Term.svelte';
  import HazardBadge from './HazardBadge.svelte';
  import { callPy, fit, py } from '../pyodide.svelte.js';
  import { sample, fitted } from '../model.svelte.js';

  let full = $derived(fitted.full);
  let noLev = $derived.by(() => {
    if (!full) return null;
    const cut = 6 / full.n;
    return fit(full.quadratic.hat.map((h) => h <= cut), { track: false });
  });
  let robust = $derived(py.status === 'ready' && sample.loaded ? callPy('fit_design', {
    y: sample.rows.map((r) => r.income), columns: { age: sample.rows.map((r) => r.age), age_sq: sample.rows.map((r) => r.age ** 2) },
  }) : null);
  let sex = $derived(py.status === 'ready' && sample.loaded ? callPy('fit_sex', sample.rows.map(() => true)) : null);
  let shift = $derived(full && noLev?.peak ? Math.abs(noLev.peak - full.peak) : Infinity);
  let at100 = $derived(full ? full.quadratic.b[0] + full.quadratic.b[1] * 100 + full.quadratic.b[2] * 1e4 : null);
  const p = (v) => (v < 0.001 ? '<.001' : v.toFixed(3));
</script>

<SlideHead section="p4" title="The verdict, hazard by hazard" />
<div class="body stack">
  {#if full && noLev && robust && sex}
    <div class="checks">
      <div class="row"><HazardBadge n={1} status="ok" /><p>Line: p = {full.linear.p[1].toFixed(2)}. Adding age² gives F = {full.ftest.F.toFixed(1)}, p {p(full.ftest.p)}. <b>Fixed.</b></p></div>
      <div class="row"><HazardBadge n={2} status="warn" /><p>Sex changes the shape (R² {full.quadratic.r2.toFixed(3)} → {sex.r2.toFixed(3)}). Education, hours and occupation are still missing.</p></div>
      <div class="row"><HazardBadge n={3} status={shift < 3 ? "ok" : "warn"} /><p>Dropping all high-<Term id="leverage">leverage</Term> cases (n = {noLev.n}): peak {full.peak.toFixed(1)} → {noLev.peak?.toFixed(1) ?? "none"}. {#if shift < 3}<b>Robust.</b>{:else}The hump survives, but its <b>location</b> depends on the extreme ages.{/if}</p></div>
      <div class="row"><HazardBadge n={4} status="ok" /><p>Age² p-value: classical {p(full.quadratic.p[2])}, <Term id="robust-se">robust</Term> {p(robust.p_robust[2])}. Still significant.</p></div>
      <div class="row"><HazardBadge n={5} status="bad" /><p>One survey year compares <Term id="cohort">different generations</Term>, not one person aging. And at age 100 the parabola predicts <b>€{Math.round(at100).toLocaleString('en-US')}</b>: <Term id="extrapolation">extrapolation</Term>.</p></div>
    </div>
    <div class="callout pink"><b>Answer:</b> in 2016 Germany, average income <b>rises, peaks in the early 50s, then falls</b>, mostly driven by men. That's a solid <b>description</b>. It is <b>not</b> proof that aging itself lowers pay.</div>
  {:else}
    <p class="muted">Waiting for Python…</p>
  {/if}
</div>

<style>
  .checks { display: flex; flex-direction: column; gap: 16px; }
  .row { display: grid; grid-template-columns: 380px 1fr; align-items: center; gap: 24px; background: #fff; border: 3px solid var(--ink); border-radius: 14px; padding: 10px 20px; box-shadow: 4px 4px 0 var(--ink); }
  .row p { margin: 0; font-size: 23px; }
</style>
