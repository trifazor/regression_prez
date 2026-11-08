<script>
  import SlideHead from '../SlideHead.svelte';
  import { csvString, fitted, sample } from '../model.svelte.js';
  import Term from '../explain/Term.svelte';

  function download() {
    const blob = new Blob([csvString(sample.rows)], { type: 'text/csv;charset=utf-8' });
    const a = Object.assign(document.createElement('a'), { href: URL.createObjectURL(blob), download: 'allbus2016_subsample.csv' });
    a.click();
    URL.revokeObjectURL(a.href);
  }
  let f = $derived(fitted.full);
  const p = (v) => (v < 0.001 ? '<.001' : v.toFixed(3));
</script>

<SlideHead section="ex" title="JASP walkthrough and reference values" />
<div class="body cols">
  <div class="stack">
    <div><button class="btn pink" onclick={download}>↓ Download allbus2016_subsample.csv</button>
      <span class="small muted" style="margin-left:14px">{sample.rows.length} rows · income, age, age_sq, sex</span></div>
    <details open>
      <summary>Module 1 · Seniority model</summary>
      <ol>
        <li>Open the CSV. <em>Regression → Linear Regression</em>.</li>
        <li>Dependent: <code>income</code>. Covariates: <code>age</code>.</li>
        <li>Record β̂₀, β̂₁ and p. Compare with the table on the right.</li>
      </ol>
    </details>
    <details>
      <summary>Module 2 · Add age² & F change</summary>
      <ol>
        <li>Add <code>age_sq</code>. In <em>Model</em>, put <code>age</code> in Model 0 and <code>age_sq</code> in Model 1.</li>
        <li><em>Statistics → R squared change</em>. Read ΔR² and F change.</li>
        <li>Compute Age* = −β̂(age) / (2·β̂(age_sq)) by hand.</li>
      </ol>
    </details>
    <details>
      <summary>Module 3 · Residual diagnostics</summary>
      <ol>
        <li><em>Plots → Residuals vs. predicted</em> and <em>Q-Q plot standardized residuals</em>.</li>
        <li>Describe the fan and the upper tail. Match them to Hazard 4.</li>
      </ol>
    </details>
  </div>
  <div class="card">
    <h3>Your JASP output should show</h3>
    {#if f}
      <table class="coef">
        <thead><tr><th></th><th>Estimate</th><th>SE</th><th>p</th></tr></thead>
        <tbody>
          <tr class="group"><td colspan="4">Model 0 · linear</td></tr>
          <tr><td>(Intercept)</td><td>{f.linear.b[0].toFixed(3)}</td><td>{f.linear.se[0].toFixed(3)}</td><td>{p(f.linear.p[0])}</td></tr>
          <tr><td>age</td><td>{f.linear.b[1].toFixed(3)}</td><td>{f.linear.se[1].toFixed(3)}</td><td>{p(f.linear.p[1])}</td></tr>
          <tr class="group"><td colspan="4">Model 1 · quadratic</td></tr>
          <tr><td>(Intercept)</td><td>{f.quadratic.b[0].toFixed(3)}</td><td>{f.quadratic.se[0].toFixed(3)}</td><td>{p(f.quadratic.p[0])}</td></tr>
          <tr><td>age</td><td>{f.quadratic.b[1].toFixed(3)}</td><td>{f.quadratic.se[1].toFixed(3)}</td><td>{p(f.quadratic.p[1])}</td></tr>
          <tr><td>age_sq</td><td>{f.quadratic.b[2].toFixed(4)}</td><td>{f.quadratic.se[2].toFixed(4)}</td><td>{p(f.quadratic.p[2])}</td></tr>
        </tbody>
      </table>
      <p class="small" style="margin-top:18px">R² {f.linear.r2.toFixed(3)} → {f.quadratic.r2.toFixed(3)} · F change(1, {f.ftest.df2}) = <b>{f.ftest.F.toFixed(3)}</b> · Age* = <b>{f.peak.toFixed(2)}</b></p>
      <p class="small muted">β̂₁, β̂₂ and F should match to within 0.001.</p>
    {:else}
      <p class="muted">Waiting for the Python kernel…</p>
    {/if}
  </div>
</div>
