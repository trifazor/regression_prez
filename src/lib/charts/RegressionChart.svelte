<script>
  import Plot from './Plot.svelte';
  import { fmt } from './scale.js';
  import { sample, fitted } from '../model.svelte.js';

  // degree: 1 | 2 | 'both'. showResiduals draws e_i as vertical segments (projection view).
  let { degree = 2, showBand = true, showVertex = true, showResiduals = false, height = 360 } = $props();

  let res = $derived(fitted.res);
  let included = $derived(new Set(res?.idx ?? []));
  let hover = $state(null);

  const yDomain = [0, 8000];
  const xDomain = [16, 88];
  let models = $derived(degree === 'both' ? ['linear', 'quadratic'] : [degree === 1 ? 'linear' : 'quadratic']);

  const path = (xs, ys, x, y) => xs.map((v, i) => `${i ? 'L' : 'M'}${x(v).toFixed(1)},${y(ys[i]).toFixed(1)}`).join('');
  const band = (xs, lo, hi, x, y) => path(xs, hi, x, y) + xs.slice().reverse().map((v, i) => `L${x(v).toFixed(1)},${y(lo[lo.length - 1 - i]).toFixed(1)}`).join('') + 'Z';

  let tooltip = $derived(hover && {
    x: hover.age, y: Math.min(hover.income, yDomain[1]),
    lines: [`Age ${hover.age} · ${hover.sex === 1 ? 'male' : 'female'}`, `Income €${fmt(hover.income)}`,
            ...(included.has(hover.id) ? [] : ['(excluded by filter)'])],
  });
</script>

<Plot {xDomain} {yDomain} {height} xLabel="Age (years)" yLabel="Net income (€/month)" yFormat={(v) => '€' + fmt(v)} {tooltip}>
  {#snippet children({ x, y })}
    {#if res && showResiduals}
      {@const m = res[models[models.length - 1]]}
      {#each res.idx as id, j}
        <line class="resid" x1={x(sample.rows[id].age)} x2={x(sample.rows[id].age)}
              y1={y(sample.rows[id].income)} y2={y(m.fitted[j])} />
      {/each}
    {/if}
    {#if res && showBand}
      {#each models as name}
        <path class="band {name}" d={band(res.grid, res[name].lo, res[name].hi, x, y)} />
      {/each}
    {/if}
    {#each sample.rows as r (r.id)}
      <circle class="pt" class:out={res && !included.has(r.id)} cx={x(r.age)} cy={y(Math.min(r.income, yDomain[1]))}
              r={hover?.id === r.id ? 6 : 3.5} />
    {/each}
    {#if res}
      {#each models as name}
        <path class="fit {name}" d={path(res.grid, res[name].curve, x, y)} />
      {/each}
      {#if showVertex && models.includes('quadratic') && res.peak && res.peak > 18 && res.peak < 85}
        {@const q = res.quadratic.b}
        {@const peakY = q[0] + q[1] * res.peak + q[2] * res.peak ** 2}
        <line class="vertex" x1={x(res.peak)} x2={x(res.peak)} y1={y(0)} y2={y(peakY)} />
        <circle class="vertex-dot" cx={x(res.peak)} cy={y(peakY)} r="6" />
        <text class="vertex-label" x={x(res.peak) + 8} y={y(peakY) - 12}>Age* = {res.peak.toFixed(1)} · €{fmt(peakY)}</text>
      {/if}
    {/if}
    <!-- invisible, larger hit targets -->
    {#each sample.rows as r (r.id)}
      <circle class="hit" cx={x(r.age)} cy={y(Math.min(r.income, yDomain[1]))} r="8"
              role="presentation" onpointerenter={() => (hover = r)} onpointerleave={() => (hover = null)} />
    {/each}
  {/snippet}
</Plot>

<style>
  .pt { fill: var(--ink); fill-opacity: .42; stroke: #fff; stroke-width: .8; transition: r .1s; }
  .pt.out { fill: var(--point-out); fill-opacity: .6; }
  .hit { fill: transparent; }
  .fit { fill: none; stroke-width: 3.5; stroke-linecap: round; }
  .fit.linear { stroke: var(--series-1); }
  .fit.quadratic { stroke: var(--series-2); }
  .band { opacity: .2; }
  .band.linear { fill: var(--series-1); }
  .band.quadratic { fill: var(--series-2); }
  .resid { stroke: var(--series-3); stroke-width: 1.2; opacity: .7; }
  .vertex { stroke: var(--ink); stroke-dasharray: 5 4; stroke-width: 2; }
  .vertex-dot { fill: var(--yellow); stroke: var(--ink); stroke-width: 2.5; }
  .vertex-label { font-size: 14px; font-weight: 700; fill: var(--ink); paint-order: stroke; stroke: #fff; stroke-width: 5px; }
</style>
