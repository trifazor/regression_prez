<script>
  import SlideHead from '../SlideHead.svelte';
  import ToyChart from '../charts/ToyChart.svelte';
  import Term from '../explain/Term.svelte';
  import HazardBadge from './HazardBadge.svelte';
  import { lever } from '../toy.js';
  import { simpleOLS } from '../simple.js';

  const base = lever.filter((p) => !p.drag);
  const start = lever.find((p) => p.drag);
  let pt = $state({ x: start.x, y: start.y });
  let dragging = $state(false);
  let all = $derived([...base, { x: +pt.x.toFixed(1), y: +pt.y.toFixed(1) }]);
  let fAll = $derived(simpleOLS(all));
  const fBase = simpleOLS(base);
  let h = $derived(fAll.hat[fAll.hat.length - 1]);
  let lines = $derived([
    { xs: [0, 20], ys: [fBase.a, fBase.a + fBase.b * 20], color: 'var(--ink)', width: 2.5, dash: '8 6' },
    { xs: [0, 20], ys: [fAll.a, fAll.a + fAll.b * 20], color: 'var(--series-2)' },
  ]);
  const presets = [['Inline, far right', 19, 10 + 1.5 * 19], ['Outlier, middle', 5, 30], ['Outlier, far right', 19, 4]];
</script>

<svelte:window onpointerup={() => (dragging = false)} />

<SlideHead section="p3" title="When one point rules the line" />
<div class="body cols wide-left">
  <div>
    <div class="chart-card">
      <ToyChart points={base} {lines} xDomain={[0, 20]} yDomain={[0, 42]} xLabel="X" yLabel="Y" height={340}>
        {#snippet extra({ x, y, toData })}
          <rect width="640" height="360" fill="transparent" role="presentation"
                onpointermove={(e) => { if (dragging) { const [a, b] = toData(e); pt = { x: Math.max(0, Math.min(20, a)), y: Math.max(0, Math.min(42, b)) }; } }} />
          <circle cx={x(pt.x)} cy={y(pt.y)} r="14" class="drag" role="slider" aria-label="Draggable point" aria-valuenow={pt.y} tabindex="0"
                  onpointerdown={() => (dragging = true)} />
        {/snippet}
      </ToyChart>
    </div>
    <div class="legend">
      <span><span class="key" style="background:var(--ink)"></span> fit without the pink point</span>
      <span><span class="key quadratic"></span> fit with it</span>
      {#each presets as [label, px, py]}<button class="btn" style="padding:4px 14px;font-size:18px" onclick={() => (pt = { x: px, y: py })}>{label}</button>{/each}
    </div>
  </div>
  <div class="stack">
    <HazardBadge n={3} />
    <p class="small"><b>Drag the pink point.</b> Watch how far the line follows it, depending on <i>where</i> it is.</p>
    <div class="card">
      <table class="coef"><tbody>
        <tr><td>Slope without it</td><td>{fBase.b.toFixed(2)}</td></tr>
        <tr><td>Slope with it</td><td><b>{fAll.b.toFixed(2)}</b></td></tr>
        <tr><td><Term id="leverage">Leverage</Term> hᵢᵢ</td><td><b>{h.toFixed(2)}</b> {h > 4 / all.length ? '(high)' : ''}</td></tr>
      </tbody></table>
    </div>
    <p class="small">An odd Y in the <b>middle</b> barely moves the slope. An odd Y at the <b>edge</b>, with high leverage, drags it around: an <Term id="influence">influential point</Term>.</p>
    <div class="callout small"><b>Lesson:</b> check which points carry your result. Refit without them.</div>
  </div>
</div>

<style>.drag { fill: var(--pink); stroke: var(--ink); stroke-width: 3; cursor: grab; } .drag:hover { fill: var(--yellow); }</style>
