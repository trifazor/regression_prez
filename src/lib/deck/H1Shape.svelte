<script>
  import SlideHead from '../SlideHead.svelte';
  import ToyChart from '../charts/ToyChart.svelte';
  import Plot from '../charts/Plot.svelte';
  import Term from '../explain/Term.svelte';
  import HazardBadge from './HazardBadge.svelte';
  import { callPy, py } from '../pyodide.svelte.js';
  import { curved } from '../toy.js';
  import { linspace } from '../simple.js';

  let quad = $state(false);
  const gx = linspace(0, 10);
  let m = $derived(py.status !== 'ready' ? null : callPy('fit_design', {
    y: curved.map((p) => p.y),
    columns: quad ? { x: curved.map((p) => p.x), x2: curved.map((p) => p.x ** 2) } : { x: curved.map((p) => p.x) },
    grid: quad ? { x: gx, x2: gx.map((v) => v * v) } : { x: gx },
  }));
  let lines = $derived(m ? [{ xs: gx, ys: m.curve, lo: m.lo, hi: m.hi, color: quad ? 'var(--series-2)' : 'var(--series-1)' }] : []);
</script>

<SlideHead section="p3" title="Fitting a line to a curve" />
<div class="body cols wide-left">
  <div>
    <div class="chart-card"><ToyChart points={curved} {lines} xDomain={[0, 10]} yDomain={[-2, 16]} xLabel="Dose" yLabel="Response" height={330} /></div>
    <div class="seg" style="margin-top:20px">
      <button class="lin" class:on={!quad} onclick={() => (quad = false)}>Straight line</button>
      <button class="quad" class:on={quad} onclick={() => (quad = true)}>Add x²</button>
    </div>
  </div>
  <div class="stack">
    <HazardBadge n={1} />
    {#if m}
      <div class="card">
        <p class="small" style="margin:0 0 6px">{quad ? 'Quadratic' : 'Linear'} fit · <Term id="r2">R²</Term> = <b>{m.r2.toFixed(2)}</b> · slope p = <b>{m.p[1] < 0.001 ? '<.001' : m.p[1].toFixed(2)}</b></p>
        <Plot xDomain={[0, 10]} yDomain={[-6, 6]} height={170} width={520} xLabel="Dose" yLabel="Residual" yFormat={(v) => v}>
          {#snippet children({ x, y })}
            <line x1={x(0)} x2={x(10)} y1={y(0)} y2={y(0)} stroke="var(--ink)" stroke-dasharray="5 4" />
            {#each curved as p, i}<circle cx={x(p.x)} cy={y(m.resid[i])} r="4" fill="var(--teal)" />{/each}
          {/snippet}
        </Plot>
      </div>
      {#if !quad}
        <p class="small">The line says the dose barely matters (R² ≈ {m.r2.toFixed(2)}). But the <Term id="residual">residuals</Term> make a <b>∩ shape</b>: the model misses a pattern.</p>
      {:else}
        <p class="small">With x² the residuals are a <b>shapeless band</b> and R² jumps to {m.r2.toFixed(2)}. The relationship was there all along.</p>
      {/if}
    {/if}
    <div class="callout small"><b>Lesson:</b> "not significant" can mean "wrong shape". Always plot residuals.</div>
  </div>
</div>
