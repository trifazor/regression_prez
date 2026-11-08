<script>
  // Dummy + interaction model: separate age profiles for men and women.
  import SlideHead from '../SlideHead.svelte';
  import Plot from '../charts/Plot.svelte';
  import Term from '../explain/Term.svelte';
  import HazardBadge from './HazardBadge.svelte';
  import { callPy, py } from '../pyodide.svelte.js';
  import { sample } from '../model.svelte.js';
  import { fmt } from '../charts/scale.js';

  let m = $derived(py.status === 'ready' && sample.loaded ? callPy('fit_sex', sample.rows.map(() => true)) : null);
  const col = { 1: 'var(--series-1)', 2: 'var(--series-2)' };
  const path = (xs, ys, x, y) => xs.map((v, i) => `${i ? 'L' : 'M'}${x(v).toFixed(1)},${y(ys[i]).toFixed(1)}`).join('');
  const p = (v) => (v < 0.001 ? '<.001' : v.toFixed(3));
  // Only call it a peak if the parabola is clearly curved (women's profile is nearly flat).
  const curv = (b, f) => b[2] + f * b[5];
  const realPeak = (m, k, f) => m.peaks[k] && m.peaks[k] < 85 && curv(m.b, f) < -0.25;
  const peakY = (b, f, a) => b[0] + b[1] * a + b[2] * a * a + f * (b[3] + b[4] * a + b[5] * a * a);
</script>

<SlideHead section="p4" title="Same curve for men and women?" />
<div class="body cols wide-left">
  <div>
    <div class="chart-card">
      <Plot xDomain={[16, 88]} yDomain={[0, 6500]} height={330} xLabel="Age (years)" yLabel="Net income (€/month)" yFormat={(v) => '€' + fmt(v)}>
        {#snippet children({ x, y })}
          {#each sample.rows as r}<circle cx={x(r.age)} cy={y(Math.min(r.income, 6500))} r="3.5" fill={col[r.sex]} fill-opacity=".45" />{/each}
          {#if m}
            <path d={path(m.grid, m.curves.men, x, y)} fill="none" stroke="var(--series-1)" stroke-width="4" />
            <path d={path(m.grid, m.curves.women, x, y)} fill="none" stroke="var(--series-2)" stroke-width="4" />
            {#each [['men', 0], ['women', 1]] as [k, f]}
              {#if realPeak(m, k, f)}
                {@const py0 = peakY(m.b, f, m.peaks[k])}
                <circle cx={x(m.peaks[k])} cy={y(py0)} r="7" fill="var(--yellow)" stroke="var(--ink)" stroke-width="2.5" />
                <text x={x(m.peaks[k])} y={y(py0) - 14} text-anchor="middle" class="annot">{k}: peak {m.peaks[k].toFixed(0)}</text>
              {/if}
            {/each}
          {/if}
        {/snippet}
      </Plot>
    </div>
    <div class="legend"><span><span class="key linear"></span> men</span><span><span class="key quadratic"></span> women</span></div>
  </div>
  <div class="stack">
    <p class="small">Add a <Term id="dummy">female dummy</Term> and its <Term id="interaction">interactions</Term> with age and age², so each sex gets its <b>own</b> parabola.</p>
    {#if m}
      <div class="card">
        <table class="coef">
          <tbody>
            <tr><td>Men's peak age</td><td><b>{m.peaks.men?.toFixed(1) ?? '–'}</b></td></tr>
            <tr><td>Women's peak age</td><td><b>{realPeak(m, 'women', 1) ? m.peaks.women.toFixed(1) : '≈ flat'}</b> <span class="muted">(curvature {curv(m.b, 1).toFixed(2)} vs {curv(m.b, 0).toFixed(2)})</span></td></tr>
            <tr><td>Same shape? <Term id="ftest">F</Term>({m.test_interaction.df1}, {m.test_interaction.df2})</td><td>{m.test_interaction.F.toFixed(2)}, p = <b>{p(m.test_interaction.p)}</b></td></tr>
            <tr><td><Term id="r2">R²</Term> (vs 0.055 without sex)</td><td><b>{m.r2.toFixed(3)}</b></td></tr>
          </tbody>
        </table>
      </div>
      <p class="small">Men: a clear hump. Women: a <b>much flatter</b> profile. Part-time work and career breaks look very different in the data. The pooled curve was <b>averaging two different stories</b>.</p>
    {/if}
    <HazardBadge n={2} />
  </div>
</div>
