<script>
  import ResidualChart from '../charts/ResidualChart.svelte';
  import Tex from '../Tex.svelte';
  import Term from '../explain/Term.svelte';
  import { fitted, view } from '../model.svelte.js';
  let mode = $state('resid');
  let model = $derived(view.degree === 1 ? 'linear' : 'quadratic');
  let nHigh = $derived(fitted.res ? fitted.res[model].hat.filter((h) => h > (2 * (view.degree + 1)) / fitted.res.n).length : 0);
</script>

<header class="slide-head"><span class="kicker"><b>09</b> <Term id="diagnostics">Diagnostics</Term></span><h2>Can we trust the standard errors?</h2></header>
<div class="body cols wide-left">
  <div>
    <div class="topbar">
      <div class="seg">
        <button class:on={mode === 'resid'} onclick={() => (mode = 'resid')}>Residuals vs. fitted</button>
        <button class:on={mode === 'qq'} onclick={() => (mode = 'qq')}>Normal Q-Q</button>
      </div>
      <div class="seg">
        <button class="lin" class:on={view.degree === 1} onclick={() => (view.degree = 1)}>Linear</button>
        <button class="quad" class:on={view.degree === 2} onclick={() => (view.degree = 2)}>Quadratic</button>
      </div>
    </div>
    <div class="chart-card"><ResidualChart {model} {mode} height={330} /></div>
    <div class="legend">
      <span><span class="key dot"></span> respondent</span>
      <span><span class="key dot high"></span> high <Term id="leverage">leverage</Term>, <Tex tex={'h_{ii} > 2k/n'} /> ({nHigh})</span>
      <span class="muted">hover a point for details</span>
    </div>
  </div>
  <div class="stack">
    {#if mode === 'resid'}
      <div class="card">
        <h3>1 · Look for a fan</h3>
        <p class="small">If the spread were constant (<Term id="homoskedasticity">homoskedastic</Term>) we would see an even horizontal band. Instead it <b>widens</b> as predicted income rises: <Term id="heteroskedasticity">heteroskedasticity</Term>.</p>
      </div>
      <div class="callout"><p class="small"><b>So what?</b> β̂ stays unbiased, but the classical SEs and p-values are off. Use <Term id="robust-se">robust SEs</Term> or model log income.</p></div>
      <div class="card">
        <h3>2 · Who pulls the curve?</h3>
        <p class="small">Pink points have high <Term id="leverage">leverage</Term>: unusually young or old. They pin down the ends of the parabola.</p>
      </div>
    {:else}
      <div class="card">
        <h3>Are the errors normal?</h3>
        <p class="small">A <Term id="qq">Q-Q plot</Term> compares sorted residuals to a perfect normal sample. Normal points would sit on the dashed line.</p>
      </div>
      <div class="callout"><p class="small">The upper tail <b>shoots up</b>: a few people earn far more than a normal distribution allows. Income is <Term id="skew">right-skewed</Term>.</p></div>
      <p class="small muted">With n = 350 the central limit theorem still rescues inference on β. Individual predictions would be poor.</p>
    {/if}
  </div>
</div>

<style>
  .topbar { display: flex; gap: 24px; align-items: center; margin-bottom: 20px; }
  .card h3 { font-size: 28px; }
</style>
