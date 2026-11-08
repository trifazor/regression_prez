<script>
  import SlideHead from '../SlideHead.svelte';
  import Term from '../explain/Term.svelte';
  import { fitted } from '../model.svelte.js';
  let f = $derived(fitted.full);
</script>

<SlideHead section="open" title="What to take home" />
<div class="body grid">
  <div class="card pink"><span class="n">1</span><h3>Averages that move</h3><p class="small">Regression estimates how the <b>average</b> of Y changes with X, chosen by least squares.</p></div>
  <div class="card sky"><span class="n">2</span><h3>Read every column</h3><p class="small">Estimate, SE, t, p and R² answer different questions. Interpret in units, not stars.</p></div>
  <div class="card yellow"><span class="n">3</span><h3>Run the 5 hazard checks</h3><p class="small">Shape, missing variables, influential points, uneven noise, causality. The software won't.</p></div>
  <div class="card teal"><span class="n">4</span><h3>Our answer</h3><p class="small">Income peaks around {f?.peak.toFixed(0) ?? '…'}, mostly for men. A good <Term id="three-jobs">description</Term>, not a causal law.</p></div>
  <div class="card"><span class="n">5</span><h3>"Linear" is flexible</h3><p class="small">Polynomials, logs, dummies and interactions are all the same OLS machine.</p></div>
  <div class="card orange"><span class="n">?</span><h3>Questions</h3><p class="small">Every slide is live. Ask "what if…?" and we'll change the model on the spot.</p></div>
</div>

<style>
  .grid { display: grid; grid-template-columns: repeat(3, 1fr); grid-template-rows: 1fr 1fr; gap: 36px; padding-top: 20px; }
  .card { position: relative; padding-top: 64px; }
  .card h3 { font-size: 34px; }
  .orange { background: var(--orange); }
  .teal { color: #fff; }
  .n { position: absolute; top: -4px; left: 28px; transform: translateY(-40%); width: 70px; height: 70px; border-radius: 50%; background: var(--ink); color: var(--paper); display: grid; place-items: center; font-family: var(--display); font-size: 38px; font-weight: 700; }
</style>
