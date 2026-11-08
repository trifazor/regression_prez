<script>
  import CoefTable from '../CoefTable.svelte';
  import Term from '../explain/Term.svelte';
  import { fitted } from '../model.svelte.js';
  let m = $derived(fitted.res?.linear);
</script>

<header class="slide-head"><span class="kicker"><b>05</b> Reading the output</span><h2>What every column in the table means</h2></header>
<div class="body cols">
  <div class="stack">
    <div class="card"><CoefTable model="linear" /></div>
    <p class="small muted">Linear model, all 350 respondents. Click any column header for the details.</p>
  </div>
  <div class="stack guide">
    <div class="row"><span class="pill">Estimate</span><p>The fitted <b>β̂</b>. For age: euros per extra year.</p></div>
    <div class="row"><span class="pill"><Term id="se">SE</Term></span><p>How much β̂ would <b>wobble</b> across new samples of 350 people.</p></div>
    <div class="row"><span class="pill"><Term id="tstat">t</Term></span><p>Estimate ÷ SE. How many SEs from zero? Around |t| &gt; 2 is significant.</p></div>
    <div class="row"><span class="pill"><Term id="pvalue">p</Term></span><p>If the true β were 0, how often would chance produce an estimate this big?{#if m} Here: <b>{(m.p[1] * 100).toFixed(0)}%</b> of the time.{/if}</p></div>
    <div class="row"><span class="pill"><Term id="r2">R²</Term></span><p>Share of income variation the model explains.</p></div>
  </div>
</div>

<style>
  .guide { gap: 18px; }
  .row { display: grid; grid-template-columns: 170px 1fr; gap: 20px; align-items: center; }
  .row p { margin: 0; font-size: 26px; }
  .pill { justify-self: start; background: var(--yellow); border: 3px solid var(--ink); border-radius: 999px; padding: 6px 20px; font-weight: 700; font-size: 24px; box-shadow: 3px 3px 0 var(--ink); }
</style>
