<script>
  import SlideHead from '../SlideHead.svelte';
  import RegressionChart from '../charts/RegressionChart.svelte';
  import Controls from '../Controls.svelte';
  import Term from '../explain/Term.svelte';
  import { fitted, view } from '../model.svelte.js';

  let r = $derived(fitted.res);
  let f = $derived(fitted.full);
  const d = (a, b, k = 1) => (b == null || a == null ? '' : `${a - b >= 0 ? '+' : ''}${(a - b).toFixed(k)}`);
</script>

<SlideHead section="open" title="Appendix: live lab for questions" />
<Controls />
<div class="body cols wide-left">
  <div class="chart-card"><RegressionChart degree={view.degree} height={310} /></div>
  <div class="stack">
    {#if r && f}
      <div class="card">
        <table class="coef">
          <thead><tr><th></th><th>Now</th><th>All 350</th><th>Δ</th></tr></thead>
          <tbody>
            <tr><td><Term id="vertex">Peak age</Term></td><td><b>{r.peak?.toFixed(1) ?? '–'}</b></td><td>{f.peak?.toFixed(1)}</td><td>{d(r.peak, f.peak)}</td></tr>
            <tr><td>β̂₂ age²</td><td>{r.quadratic.b[2].toFixed(3)}</td><td>{f.quadratic.b[2].toFixed(3)}</td><td>{d(r.quadratic.b[2], f.quadratic.b[2], 3)}</td></tr>
            <tr><td><Term id="ftest">F</Term> (age²)</td><td>{r.ftest.F.toFixed(1)}</td><td>{f.ftest.F.toFixed(1)}</td><td>{d(r.ftest.F, f.ftest.F)}</td></tr>
            <tr><td>p (age²)</td><td><b>{r.ftest.p < 0.001 ? '<.001' : r.ftest.p.toFixed(3)}</b></td><td>&lt;.001</td><td></td></tr>
          </tbody>
        </table>
      </div>
    {/if}
    <div class="card yellow small">
      <h3>Try</h3>
      <ul>
        <li>Men vs. women: where does each peak?</li>
        <li>Ages 18–60 only: does the curve survive without pensioners?</li>
        <li>Income ≤ €4,000: how much do top earners matter?</li>
        <li>Drop high <Term id="leverage">leverage</Term> points.</li>
      </ul>
    </div>
  </div>
</div>
