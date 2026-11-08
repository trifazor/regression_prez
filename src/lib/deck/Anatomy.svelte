<script>
  import SlideHead from '../SlideHead.svelte';
  import Term from '../explain/Term.svelte';
  import { study } from '../toy.js';
  import { simpleOLS } from '../simple.js';
  const f = simpleOLS(study);
</script>

<SlideHead section="p1" title="A model in one line" />
<div class="body stack">
  <div class="formula">
    <span class="part y">Y<small>outcome</small></span><span class="op">=</span>
    <span class="part b0">β₀<small><Term id="intercept">intercept</Term></small></span><span class="op">+</span>
    <span class="part b1">β₁ · X<small><Term id="slope">slope</Term> × predictor</small></span><span class="op">+</span>
    <span class="part e">ε<small>everything else</small></span>
  </div>
  <div class="cols three">
    <div class="card"><h3>β₀ = {f.a.toFixed(1)}</h3><p class="small">Predicted score with <b>0 hours</b> of study. Meaningful here; often it is not (income at age 0?).</p></div>
    <div class="card"><h3>β₁ = {f.b.toFixed(2)}</h3><p class="small">Each extra hour goes with <b>{f.b.toFixed(1)} more points</b> on average. Units: points per hour.</p></div>
    <div class="card"><h3>ε: the rest</h3><p class="small">Talent, sleep, luck. Regression assumes it averages to <b>zero</b> at every X: <Term id="exogeneity">exogeneity</Term>.</p></div>
  </div>
  <div class="callout pink">Part 1 recap: regression describes how the <b>average</b> of Y moves with X, chosen by <b>least squares</b>. Part 2: how the machine finds β, and how sure it is.</div>
</div>

<style>
  .formula { display: flex; align-items: flex-start; justify-content: center; gap: 22px; font-family: var(--display); font-size: 88px; font-weight: 700; margin: 10px 0 20px; }
  .part { display: flex; flex-direction: column; align-items: center; border: 4px solid var(--ink); border-radius: 20px; padding: 6px 30px 12px; box-shadow: 8px 8px 0 var(--ink); }
  .part small { font-family: var(--body); font-size: 22px; font-weight: 700; text-transform: uppercase; letter-spacing: .05em; }
  .op { padding-top: 10px; }
  .y { background: #fff; } .b0 { background: var(--yellow); } .b1 { background: var(--pink); } .e { background: var(--sky); }
  .card h3 { font-size: 40px; }
</style>
