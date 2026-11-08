<script>
  // FR-5: residuals vs fitted, points sized/highlighted by leverage h_ii.
  import Plot from './Plot.svelte';
  import { fmt, extent } from './scale.js';
  import { sample, fitted } from '../model.svelte.js';

  let { model = 'quadratic', mode = 'resid', height = 360 } = $props(); // mode: 'resid' | 'qq'

  let res = $derived(fitted.res);
  let m = $derived(res?.[model]);
  let cut = $derived(res ? (2 * (model === 'linear' ? 2 : 3)) / res.n : 1);
  let hover = $state(null);

  let pts = $derived.by(() => {
    if (!m) return [];
    if (mode === 'qq') {
      const order = m.std_resid.map((v, j) => j).sort((a, b) => m.std_resid[a] - m.std_resid[b]);
      return order.map((j, rank) => ({ j, x: res.qq[rank], y: m.std_resid[j] }));
    }
    return m.fitted.map((f, j) => ({ j, x: f, y: m.resid[j] }));
  });
  let xDomain = $derived(pts.length ? extent(pts.map((p) => p.x), 0.05) : [0, 1]);
  let yDomain = $derived(pts.length ? extent(pts.map((p) => p.y), 0.05) : [0, 1]);

  let tooltip = $derived(hover && (() => {
    const r = sample.rows[res.idx[hover.j]];
    return { x: hover.x, y: hover.y, lines: [
      `Age ${r.age} · €${fmt(r.income)}`,
      `Fitted €${fmt(m.fitted[hover.j])} · e = ${fmt(m.resid[hover.j])}`,
      `h_ii = ${m.hat[hover.j].toFixed(4)}${m.hat[hover.j] > cut ? ' (high leverage)' : ''}`,
    ] };
  })());
</script>

{#if m}
  <Plot {xDomain} {yDomain} {height} {tooltip}
        xLabel={mode === 'qq' ? 'Theoretical normal quantile' : 'Fitted value Ŷ (€/month)'}
        yLabel={mode === 'qq' ? 'Standardized residual' : 'Residual e (€/month)'}
        xFormat={(v) => (mode === 'qq' ? fmt(v, 1) : fmt(v))} yFormat={(v) => fmt(v, mode === 'qq' ? 1 : 0)}>
    {#snippet children({ x, y })}
      {#if mode === 'qq'}
        <line class="ref" x1={x(xDomain[0])} y1={y(xDomain[0])} x2={x(xDomain[1])} y2={y(xDomain[1])} />
      {:else}
        <line class="ref" x1={x(xDomain[0])} y1={y(0)} x2={x(xDomain[1])} y2={y(0)} />
      {/if}
      {#each pts as p (p.j)}
        {@const high = m.hat[p.j] > cut}
        <circle class="pt" class:high cx={x(p.x)} cy={y(p.y)} r={high ? 6 : 3.5}
                onpointerenter={() => (hover = p)} onpointerleave={() => (hover = null)} role="presentation" />
      {/each}
    {/snippet}
  </Plot>
{/if}

<style>
  .pt { fill: var(--ink); fill-opacity: .42; stroke: #fff; stroke-width: .8; }
  .pt.high { fill: var(--series-2); fill-opacity: 1; stroke: var(--ink); stroke-width: 1.5; }
  .ref { stroke: var(--ink); stroke-dasharray: 6 4; stroke-width: 1.5; }
</style>
