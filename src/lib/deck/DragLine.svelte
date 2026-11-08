<script>
  // Drag the two handles to fit a line by hand; the squared residuals are drawn as real squares.
  import ToyChart from '../charts/ToyChart.svelte';
  import SlideHead from '../SlideHead.svelte';
  import Term from '../explain/Term.svelte';
  import { study } from '../toy.js';
  import { simpleOLS, rssOf } from '../simple.js';

  const X0 = 1, X1 = 20;
  const best = simpleOLS(study);
  let h0 = $state(75), h1 = $state(55); // handle heights: deliberately bad start
  let showSquares = $state(true), showBest = $state(false);
  let dragging = $state(null);

  let b = $derived((h1 - h0) / (X1 - X0));
  let a = $derived(h0 - b * X0);
  let rss = $derived(rssOf(study, a, b));
  let score = $derived(Math.round((best.rss / rss) * 100));

  let lines = $derived([
    { xs: [0, 21], ys: [a, a + b * 21], color: 'var(--series-2)', width: 4 },
    ...(showBest ? [{ xs: [0, 21], ys: [best.a, best.a + best.b * 21], color: 'var(--ink)', width: 3, dash: '8 6' }] : []),
  ]);

  function move(e, toData) {
    if (dragging === null) return;
    const [, yv] = toData(e);
    const v = Math.max(20, Math.min(100, yv));
    if (dragging === 0) h0 = v; else h1 = v;
  }
</script>

<svelte:window onpointerup={() => (dragging = null)} />

<SlideHead section="p1" title="Your turn: fit the line by hand" />
<div class="body cols wide-left">
  <div>
    <div class="chart-card">
      <ToyChart points={study} {lines} xDomain={[0, 21]} yDomain={[20, 100]} xLabel="Study hours" yLabel="Exam score" height={350}>
        {#snippet extra({ x, y, toData })}
          {#if showSquares}
            {#each study as p}
              {@const fy = a + b * p.x}
              {@const side = Math.abs(y(p.y) - y(fy))}
              <rect x={p.y > fy ? x(p.x) : x(p.x) - side} y={Math.min(y(p.y), y(fy))} width={side} height={side} class="sq" />
            {/each}
          {/if}
          <rect x="0" y="0" width="640" height="360" fill="transparent" style="cursor:{dragging !== null ? 'grabbing' : 'default'}"
                onpointermove={(e) => move(e, toData)} role="presentation" />
          {#each [[X0, h0], [X1, h1]] as [hx, hy], i}
            <circle cx={x(hx)} cy={y(hy)} r="13" class="handle" role="slider" aria-label="Line handle {i + 1}" aria-valuenow={hy} tabindex="0"
                    onpointerdown={() => (dragging = i)}
                    onpointermove={(e) => move(e, toData)} />
          {/each}
        {/snippet}
      </ToyChart>
    </div>
    <div class="legend">
      <label class="check"><input type="checkbox" bind:checked={showSquares} /> show squared errors</label>
      <label class="check"><input type="checkbox" bind:checked={showBest} /> reveal the <Term id="ols">OLS</Term> line</label>
      <button class="btn" style="padding:6px 18px;font-size:20px" onclick={() => { h0 = 75; h1 = 55; showBest = false; }}>Reset</button>
    </div>
  </div>
  <div class="stack">
    <p>Drag the two <b class="pinkdot">pink handles</b>. Each green square is one <Term id="residual">residual</Term>, squared. Make the total area as small as you can.</p>
    <div class="meter card">
      <div class="row"><span>Your total squared error</span><b>{Math.round(rss).toLocaleString('en-US')}</b></div>
      <div class="bar"><div style="width:{Math.min(100, (best.rss / rss) * 100)}%"></div></div>
      <div class="row small"><span>Best possible</span><span>{Math.round(best.rss).toLocaleString('en-US')}</span></div>
      <p class="score">{score >= 99 ? '🎯 You found it: that IS the OLS line.' : `${score}% as good as the best line`}</p>
    </div>
    <p class="small"><b>Why squares?</b> Ups and downs can't cancel, and big misses cost much more than small ones. This "least squares" rule is <Term id="ols">OLS</Term>, and it has <b>exactly one</b> best answer.</p>
  </div>
</div>

<style>
  .sq { fill: var(--teal); fill-opacity: .18; stroke: var(--teal); stroke-width: 1; pointer-events: none; }
  .handle { fill: var(--pink); stroke: var(--ink); stroke-width: 3; cursor: grab; }
  .handle:hover { fill: var(--yellow); }
  .pinkdot { background: var(--pink); padding: 0 8px; border-radius: 6px; border: 2px solid var(--ink); }
  .meter .row { display: flex; justify-content: space-between; align-items: baseline; font-size: 24px; }
  .meter b { font-family: var(--display); font-size: 44px; }
  .bar { height: 22px; border: 3px solid var(--ink); border-radius: 999px; overflow: hidden; margin: 12px 0; background: #fff; }
  .bar div { height: 100%; background: var(--teal); transition: width .1s; }
  .score { font-family: var(--display); font-weight: 700; font-size: 28px; margin: 10px 0 0; }
</style>
