<script>
  import { fitted } from '../model.svelte.js';
  import Term from '../explain/Term.svelte';
  let f = $derived(fitted.full);
</script>

<header class="slide-head"><span class="kicker"><b>12</b> Takeaways</span><h2>Five things to remember</h2></header>
<div class="body grid">
  <div class="card pink"><span class="n">1</span><h3>No slope ≠ no relationship</h3><p class="small">The line found nothing{f ? ` (p = ${f.linear.p[1].toFixed(2)})` : ''} because the rise and the decline cancel out.</p></div>
  <div class="card"><span class="n">2</span><h3>"Linear" means linear in β</h3><p class="small">Age² is just another column in X. Same <Term id="ols">OLS</Term>, same <Term id="projection">geometry</Term>.</p></div>
  <div class="card yellow"><span class="n">3</span><h3>Nested → F-test</h3><p class="small">{f ? `F = ${f.ftest.F.toFixed(1)}` : ''}: the inverted U is strongly supported, peaking near age {f?.peak.toFixed(0) ?? '…'}.</p></div>
  <div class="card sky"><span class="n">4</span><h3>Always plot residuals</h3><p class="small"><Term id="heteroskedasticity">Fan-out</Term> and <Term id="skew">skew</Term> call for robust SEs or log income.</p></div>
  <div class="card"><span class="n">5</span><h3>A cross-section is not a life</h3><p class="small">The hump mixes aging, <Term id="cohort">cohort differences</Term> and retirement.</p></div>
  <div class="card teal"><span class="n">?</span><h3>Questions</h3><p class="small">Open the Lab (slide 9) and test your own hypothesis live.</p></div>
</div>

<style>
  .grid { display: grid; grid-template-columns: repeat(3, 1fr); grid-template-rows: 1fr 1fr; gap: 36px; }
  .card { position: relative; padding-top: 70px; }
  .n { position: absolute; top: -4px; left: 28px; transform: translateY(-40%); width: 72px; height: 72px; border-radius: 50%; background: var(--ink); color: var(--paper); display: grid; place-items: center; font-family: var(--display); font-size: 40px; font-weight: 700; border: 3px solid var(--ink); }
  .teal { color: #fff; }
</style>
