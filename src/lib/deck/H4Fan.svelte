<script>
  import SlideHead from '../SlideHead.svelte';
  import ToyChart from '../charts/ToyChart.svelte';
  import Plot from '../charts/Plot.svelte';
  import Term from '../explain/Term.svelte';
  import HazardBadge from './HazardBadge.svelte';
  import { callPy, py } from '../pyodide.svelte.js';
  import { fan } from '../toy.js';

  let m = $derived(py.status === 'ready' ? callPy('fit_design', { y: fan.map((p) => p.y), columns: { x: fan.map((p) => p.x) }, grid: { x: [0, 11] } }) : null);
  let lines = $derived(m ? [{ xs: [0, 11], ys: m.curve, color: 'var(--series-1)' }] : []);
</script>

<SlideHead section="p3" title="When the noise isn't even" />
<div class="body cols">
  <div class="stack">
    <div class="chart-card"><ToyChart points={fan} {lines} xDomain={[0, 11]} yDomain={[-5, 60]} xLabel="Experience" yLabel="Wage" height={250} /></div>
    {#if m}
      <div class="chart-card">
        <Plot xDomain={[0, 11]} yDomain={[-25, 25]} height={180} xLabel="Experience" yLabel="Residual" yFormat={(v) => v}>
          {#snippet children({ x, y })}
            <path d="M{x(0.5)},{y(2.5)} L{x(10.5)},{y(22)} L{x(10.5)},{y(-22)} L{x(0.5)},{y(-2.5)}Z" fill="var(--yellow)" opacity=".5" />
            <line x1={x(0)} x2={x(11)} y1={y(0)} y2={y(0)} stroke="var(--ink)" stroke-dasharray="5 4" />
            {#each fan as p, i}<circle cx={x(p.x)} cy={y(m.resid[i])} r="3.5" fill="var(--teal)" />{/each}
          {/snippet}
        </Plot>
      </div>
    {/if}
  </div>
  <div class="stack">
    <HazardBadge n={4} />
    <p class="small">The residuals <b>fan out</b>: small errors at low X, huge ones at high X. That's <Term id="heteroskedasticity">heteroskedasticity</Term>, and income data almost always has it.</p>
    {#if m}
      <div class="card">
        <table class="coef">
          <thead><tr><th>Slope</th><th>Estimate</th><th>SE</th></tr></thead>
          <tbody>
            <tr><td>Classical SE</td><td>{m.b[1].toFixed(2)}</td><td>{m.se[1].toFixed(3)}</td></tr>
            <tr class="sig"><td><Term id="robust-se">Robust SE</Term></td><td>{m.b[1].toFixed(2)}</td><td><b>{m.se_robust[1].toFixed(3)}</b></td></tr>
          </tbody>
        </table>
      </div>
      <p class="small">Same β̂, but the honest uncertainty is <b>{((m.se_robust[1] / m.se[1] - 1) * 100).toFixed(0)}% {m.se_robust[1] > m.se[1] ? 'larger' : 'smaller'}</b>. Classical p-values would be overconfident.</p>
    {/if}
    <div class="callout small"><b>Lesson:</b> the estimate is fine, the <b>error bars</b> lie. Use robust SEs or model log(Y).</div>
  </div>
</div>
