<script>
  import SlideHead from '../SlideHead.svelte';
  import HazardBadge from './HazardBadge.svelte';
  import RegressionChart from '../charts/RegressionChart.svelte';
  import Term from '../explain/Term.svelte';
  import { fitted } from '../model.svelte.js';
  import { fmt } from '../charts/scale.js';
  let showResiduals = $state(false);
  let m = $derived(fitted.res?.linear);
</script>

<SlideHead section="p4" title="Model 1 on real data: a straight line" />
<div class="body cols wide-left">
  <div>
    <div class="chart-card"><RegressionChart degree={1} {showResiduals} /></div>
    <div class="legend">
      <span><span class="key dot"></span> one respondent</span>
      <span><span class="key linear"></span> OLS line</span>
      <label class="check"><input type="checkbox" bind:checked={showResiduals} /> show <Term id="residual">residuals</Term></label>
    </div>
  </div>
  <div class="stack">
    <p><Term id="ols">OLS</Term> chooses the line that makes the squared vertical distances (the <Term id="residual">residuals</Term>) as small as possible in total.</p>
    {#if m}
      <div class="card sky">
        <p class="eq">income ≈ <b>{fmt(m.b[0])}</b> + <b>{m.b[1].toFixed(2)}</b> × age</p>
        <p class="small">Each extra year of age: <b>+€{m.b[1].toFixed(2)}</b> per month.</p>
      </div>
      <div class="callout pink">
        <p><b>But:</b> <Term id="pvalue">p</Term> = {m.p[1].toFixed(2)}, so the slope is <b>not significant</b>. And <Term id="r2">R²</Term> = {(m.r2 * 100).toFixed(1)}%: the line explains almost nothing.</p>
      </div>
      <div class="stack" style="gap:10px"><HazardBadge n={1} /><p class="small" style="margin:0">Interpretation card #3: "not significant" can mean <strong>wrong shape</strong>. Was the class right about a hump?</p></div>
    {/if}
  </div>
</div>

<style>
  .eq { font-family: var(--display); font-size: 36px; margin-bottom: 10px; }
</style>
