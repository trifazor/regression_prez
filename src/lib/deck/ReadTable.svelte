<script>
  import SlideHead from '../SlideHead.svelte';
  import Term from '../explain/Term.svelte';
  import { callPy, py } from '../pyodide.svelte.js';
  import { study } from '../toy.js';
  let m = $derived(py.status === 'ready' ? callPy('fit_design', { y: study.map((p) => p.y), columns: { hours: study.map((p) => p.x) } }) : null);
  const p = (v) => (v < 0.001 ? '<.001' : v.toFixed(3));
  let focus = $state(null);
  const guide = [
    ['est', 'Estimate', 'slope', 'The fitted β̂. Hours: points per extra hour.'],
    ['se', 'SE', 'se', 'How much β̂ would wobble across new samples of 24 students.'],
    ['t', 't', 'tstat', 'Estimate ÷ SE. |t| above ≈ 2 means "clearly not zero".'],
    ['p', 'p', 'pvalue', 'If the true β were 0, how often would chance give an estimate this big?'],
    ['r2', 'R²', 'r2', 'Share of the variation in scores the model accounts for.'],
  ];
</script>

<SlideHead section="p2" title="Reading the output, column by column" />
<div class="body cols">
  <div class="stack">
    <div class="card">
      {#if m}
        <table class="coef">
          <thead><tr><th></th><th class:f={focus === 'est'}>Estimate</th><th class:f={focus === 'se'}>SE</th><th class:f={focus === 't'}>t</th><th class:f={focus === 'p'}>p</th></tr></thead>
          <tbody>
            {#each ['(Intercept)', 'hours'] as name, i}
              <tr><td>{name}</td><td class:f={focus === 'est'}>{m.b[i].toFixed(2)}</td><td class:f={focus === 'se'}>{m.se[i].toFixed(2)}</td><td class:f={focus === 't'}>{m.t[i].toFixed(2)}</td><td class:f={focus === 'p'}>{p(m.p[i])}</td></tr>
            {/each}
          </tbody>
          <tfoot><tr><td colspan="5" class:f={focus === 'r2'}>R² = {m.r2.toFixed(3)} · σ̂ = {m.sigma.toFixed(2)} · n = {m.n}</td></tr></tfoot>
        </table>
      {:else}<p class="muted">Waiting for Python…</p>{/if}
    </div>
    <p class="small muted">Study-hours data, computed live. This is exactly what JASP, R or SPSS print. Hover a row on the right to highlight its column.</p>
  </div>
  <div class="stack guide">
    {#each guide as [key, label, term, text]}
      <div class="row" role="presentation" onpointerenter={() => (focus = key)} onpointerleave={() => (focus = null)}>
        <span class="pill"><Term id={term}>{label}</Term></span><p>{text}</p>
      </div>
    {/each}
  </div>
</div>

<style>
  .guide { gap: 16px; }
  .row { display: grid; grid-template-columns: 170px 1fr; gap: 20px; align-items: center; border-radius: 14px; padding: 6px; }
  .row:hover { background: #fff; }
  .row p { margin: 0; font-size: 25px; }
  .pill { justify-self: start; background: var(--yellow); border: 3px solid var(--ink); border-radius: 999px; padding: 6px 20px; font-weight: 700; font-size: 24px; box-shadow: 3px 3px 0 var(--ink); }
  .f { background: var(--yellow); }
</style>
