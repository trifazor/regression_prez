<script>
  // Scatter + fitted lines for the toy datasets.
  // lines: [{ xs, ys, color, width?, dash?, lo?, hi? }]  points: [{ x, y, g? }]
  import Plot from './Plot.svelte';
  import { fmt } from './scale.js';

  let {
    points, lines = [], xDomain, yDomain, xLabel, yLabel, height = 360,
    groupColors = ['var(--series-1)', 'var(--series-2)'], colorGroups = false, residualsFor = null,
    xFormat = (v) => fmt(v), yFormat = (v) => fmt(v), extra = null,
  } = $props();
  let hover = $state(null);
  const path = (xs, ys, x, y) => xs.map((v, i) => `${i ? 'L' : 'M'}${x(v).toFixed(1)},${y(ys[i]).toFixed(1)}`).join('');
  const band = (xs, lo, hi, x, y) => path(xs, hi, x, y) + xs.map((_, i) => xs.length - 1 - i).map((i) => `L${x(xs[i]).toFixed(1)},${y(lo[i]).toFixed(1)}`).join('') + 'Z';
  let tooltip = $derived(hover && { x: hover.x, y: hover.y, lines: [`${xLabel}: ${hover.x}`, `${yLabel}: ${hover.y}`] });
</script>

<Plot {xDomain} {yDomain} {height} {xLabel} {yLabel} {xFormat} {yFormat} {tooltip}>
  {#snippet children({ x, y, toData })}
    {#if residualsFor}
      {#each points as p}
        <line class="resid" x1={x(p.x)} x2={x(p.x)} y1={y(p.y)} y2={y(residualsFor(p.x))} />
      {/each}
    {/if}
    {#each lines as l}
      {#if l.lo}<path d={band(l.xs, l.lo, l.hi, x, y)} fill={l.color} opacity=".18" />{/if}
    {/each}
    {#each points as p, i}
      <circle class="pt" cx={x(p.x)} cy={y(p.y)} r={hover === p ? 7 : 5}
              style={p.c ? `fill:${p.c};fill-opacity:.95` : colorGroups ? `fill:${groupColors[p.g]};fill-opacity:.85` : ''}
              onpointerenter={() => (hover = p)} onpointerleave={() => (hover = null)} role="presentation" />
    {/each}
    {#each lines as l}
      <path d={path(l.xs, l.ys, x, y)} fill="none" stroke={l.color} stroke-width={l.width ?? 3.5} stroke-dasharray={l.dash ?? ''} stroke-linecap="round" />
    {/each}
    {#if extra}{@render extra({ x, y, toData })}{/if}
  {/snippet}
</Plot>

<style>
  .pt { fill: var(--ink); fill-opacity: .5; stroke: #fff; stroke-width: 1.2; }
  .resid { stroke: var(--series-3); stroke-width: 1.5; opacity: .8; }
</style>
