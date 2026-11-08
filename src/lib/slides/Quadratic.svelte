<script>
  import RegressionChart from '../charts/RegressionChart.svelte';
  import CoefTable from '../CoefTable.svelte';
  import Tex from '../Tex.svelte';
  import Term from '../explain/Term.svelte';
  import { fitted, view } from '../model.svelte.js';
  let both = $state(false);
</script>

<header class="slide-head"><span class="kicker"><b>07</b> Model 2</span><h2>Let the slope bend: add age²</h2></header>
<div class="body cols wide-left">
  <div>
    <div class="topbar">
      <div class="seg">
        <button class="lin" class:on={view.degree === 1} onclick={() => (view.degree = 1)}>Linear</button>
        <button class="quad" class:on={view.degree === 2} onclick={() => (view.degree = 2)}>Quadratic</button>
      </div>
      <label class="check"><input type="checkbox" bind:checked={both} /> overlay both</label>
    </div>
    <div class="chart-card"><RegressionChart degree={both ? 'both' : view.degree} height={340} /></div>
    <div class="legend">
      <span><span class="key linear"></span> linear</span>
      <span><span class="key quadratic"></span> quadratic</span>
      <span><span class="key band"></span> <Term id="ci">95% confidence band</Term></span>
    </div>
  </div>
  <div class="stack">
    <div class="card"><CoefTable model={view.degree === 1 ? 'linear' : 'quadratic'} /></div>
    {#if view.degree === 2 && fitted.res}
      {@const b = fitted.res.quadratic.b}
      <div class="card pink">
        <h3><Term id="vertex">Peak earning age</Term></h3>
        <p class="small">Slope = β₁ + 2β₂·Age. Set it to zero:</p>
        {#if fitted.res.peak}
          <Tex block tex={String.raw`\text{Age}^* = -\frac{\hat\beta_1}{2\hat\beta_2} = -\frac{${b[1].toFixed(2)}}{2\cdot(${b[2].toFixed(4)})} = \mathbf{${fitted.res.peak.toFixed(1)}}`} />
        {:else}
          <p>β̂₂ ≥ 0: no peak in this subsample.</p>
        {/if}
      </div>
    {:else}
      <p>Switch to <b>Quadratic</b>. Same data, but β₁ and β₂ are suddenly both strongly significant.</p>
    {/if}
  </div>
</div>

<style>
  .topbar { display: flex; gap: 30px; align-items: center; margin-bottom: 20px; }
</style>
