<script>
  import Tex from '../Tex.svelte';
  import Plot from '../charts/Plot.svelte';
  import Term from '../explain/Term.svelte';
  import { fitted } from '../model.svelte.js';
  import { fmt } from '../charts/scale.js';

  let r = $derived(fitted.res);
  function lgamma(z) {
    const c = [76.18009172947146, -86.50532032941677, 24.01409824083091, -1.231739572450155, 0.1208650973866179e-2, -0.5395239384953e-5];
    let x = z, y = z, t = x + 5.5; t -= (x + 0.5) * Math.log(t);
    let s = 1.000000000190015; for (const ci of c) s += ci / ++y;
    return -t + Math.log((2.5066282746310005 * s) / x);
  }
  const fpdf = (x, d1, d2) => Math.exp(0.5 * d1 * Math.log(d1 * x) + 0.5 * d2 * Math.log(d2) - 0.5 * (d1 + d2) * Math.log(d1 * x + d2) - Math.log(x) - (lgamma(d1 / 2) + lgamma(d2 / 2) - lgamma((d1 + d2) / 2)));
  let xmax = $derived(r ? Math.max(8, r.ftest.F * 1.15) : 8);
  let curve = $derived(r ? Array.from({ length: 200 }, (_, i) => { const x = 0.05 + (i * (xmax - 0.05)) / 199; return [x, fpdf(x, 1, r.ftest.df2)]; }) : []);
</script>

<header class="slide-head"><span class="kicker"><b>08</b> Testing</span><h2>Is the curve real, or just noise?</h2></header>
<div class="body cols">
  <div class="stack">
    <p>Adding a variable <b>always</b> lowers the <Term id="rss">RSS</Term>. The <Term id="ftest">partial F-test</Term> asks whether it drops by <b>more than chance would</b>. The models are <Term id="nested">nested</Term>: linear = quadratic with β₂ = 0.</p>
    <div class="card"><Tex block tex={String.raw`F = \frac{(\mathrm{RSS}_{\text{lin}} - \mathrm{RSS}_{\text{quad}})\,/\,1}{\mathrm{RSS}_{\text{quad}}\,/\,(n-3)}`} /></div>
    {#if r}
      <div class="card">
        <table class="coef">
          <tbody>
            <tr><td>RSS linear → quadratic</td><td>{fmt(r.linear.rss / 1e6, 1)}M → {fmt(r.quadratic.rss / 1e6, 1)}M</td></tr>
            <tr><td>ΔR²</td><td>+{r.ftest.dR2.toFixed(3)}</td></tr>
            <tr><td><b>F</b>(1, {r.ftest.df2})</td><td><b>{r.ftest.F.toFixed(2)}</b> <span class="muted">(crit. {r.ftest.fcrit.toFixed(2)})</span></td></tr>
            <tr><td>p-value</td><td><b>{r.ftest.p < 0.0001 ? r.ftest.p.toExponential(1) : r.ftest.p.toFixed(4)}</b></td></tr>
          </tbody>
        </table>
      </div>
    {/if}
  </div>
  <div class="stack">
    {#if r}
      <div class="chart-card">
        <Plot xDomain={[0, xmax]} yDomain={[0, 1]} height={300} xLabel="F value" yLabel="Density" xFormat={(v) => fmt(v, 0)} yFormat={(v) => fmt(v, 1)}>
          {#snippet children({ x, y })}
            <path d={'M' + x(r.ftest.fcrit) + ',' + y(0) + curve.filter(([a]) => a >= r.ftest.fcrit).map(([a, b]) => `L${x(a)},${y(b)}`).join('') + `L${x(xmax)},${y(0)}Z`} fill="var(--pink)" stroke="var(--ink)" stroke-width="1.5" />
            <path d={'M' + curve.map(([a, b]) => `${x(a)},${y(Math.min(b, 1))}`).join('L')} fill="none" stroke="var(--ink)" stroke-width="2.5" />
            <line x1={x(r.ftest.F)} x2={x(r.ftest.F)} y1={y(0)} y2={y(0.85)} stroke="var(--series-2)" stroke-width="4" />
            <circle cx={x(r.ftest.F)} cy={y(0.85)} r="6" fill="var(--yellow)" stroke="var(--ink)" stroke-width="2" />
            <text x={x(r.ftest.F) - 10} y={y(0.85) + 5} text-anchor="end" class="annot">our F = {r.ftest.F.toFixed(1)}</text>
            <text x={x(r.ftest.fcrit) + 8} y={y(0.12)} class="annot">5% rejection region →</text>
          {/snippet}
        </Plot>
      </div>
      <p class="small muted">The <Term id="fdist">F(1, {r.ftest.df2}) distribution</Term>: what F looks like if β₂ really were 0.</p>
      <div class="callout pink"><b>{r.ftest.p < 0.05 ? 'Reject H₀.' : 'Cannot reject H₀.'}</b> {r.ftest.p < 0.05 ? 'The curvature is real: income follows an inverted U over the life course.' : 'In this subsample the curvature could be chance.'} <span class="small">(Check: F = t²(β̂₂) = {(r.quadratic.t[2] ** 2).toFixed(2)})</span></div>
    {/if}
  </div>
</div>
