<script>
  import SlideHead from '../SlideHead.svelte';
  import ToyChart from '../charts/ToyChart.svelte';
  import Term from '../explain/Term.svelte';
  import HazardBadge from './HazardBadge.svelte';
  import { callPy, py } from '../pyodide.svelte.js';
  import { icecream } from '../toy.js';

  let control = $state(false);
  const heat = (t) => `color-mix(in oklab, var(--yellow), var(--orange) ${Math.round(((t - 8) / 24) * 100)}%)`;
  const pts = icecream.map((p) => ({ ...p, c: heat(p.t) }));
  const ys = icecream.map((p) => p.y), xs = icecream.map((p) => p.x);
  let simple = $derived(py.status === 'ready' ? callPy('fit_design', { y: ys, columns: { icecream: xs }, grid: { icecream: [50, 230] } }) : null);
  let ctrl = $derived(py.status === 'ready' ? callPy('fit_design', { y: ys, columns: { icecream: xs, temp: icecream.map((p) => p.t) } }) : null);
  let lines = $derived(simple && !control ? [{ xs: [50, 230], ys: simple.curve, color: 'var(--ink)' }] : []);
  const p = (v) => (v < 0.001 ? '<.001' : v.toFixed(2));
</script>

<SlideHead section="p3" title="Significant is not the same as causal" />
<div class="body cols wide-left">
  <div>
    <div class="chart-card"><ToyChart points={pts} {lines} xDomain={[50, 230]} yDomain={[0, 32]} xLabel="Ice creams sold" yLabel="Sunburn cases" height={330} /></div>
    <div class="legend">
      <span class="heat"></span><span>colour = temperature, 8°C → 32°C</span>
      <label class="check"><input type="checkbox" bind:checked={control} /> control for temperature</label>
    </div>
  </div>
  <div class="stack">
    <HazardBadge n={5} />
    {#if simple && ctrl}
      <div class="card">
        <table class="coef">
          <thead><tr><th>Model</th><th>β ice cream</th><th>p</th></tr></thead>
          <tbody>
            <tr class:sig={!control}><td>Sunburn ~ ice cream</td><td><b>{simple.b[1].toFixed(3)}</b></td><td>{p(simple.p[1])}</td></tr>
            <tr class:sig={control}><td>… + temperature</td><td><b>{ctrl.b[1].toFixed(3)}</b></td><td>{p(ctrl.p[1])}</td></tr>
          </tbody>
        </table>
      </div>
    {/if}
    {#if !control}
      <p class="small">Strong and highly significant. Should we ban ice cream to prevent sunburn?</p>
    {:else}
      <p class="small">Once temperature is in the model, the ice-cream effect <b>collapses</b>. Heat drives both: a <Term id="confounder">confounder</Term>.</p>
    {/if}
    <div class="callout small"><b>Lesson:</b> regression shows <b>association</b>. Causal claims need an argument that nothing else is tangled up with X. See <Term id="causation">correlation vs. causation</Term>.</div>
  </div>
</div>

<style>.heat { width: 120px; height: 18px; border: 2px solid var(--ink); border-radius: 999px; background: linear-gradient(90deg, var(--yellow), var(--orange)); }</style>
