<script>
  import Tex from '../Tex.svelte';
  import Term from '../explain/Term.svelte';
</script>

<header class="slide-head"><span class="kicker"><b>02</b> The question</span><h2>What does "the effect of age" even mean?</h2></header>
<div class="body cols">
  <div class="stack">
    <p>Pick any age, say 40. Germans aged 40 earn very different amounts. Their <strong>average</strong> is one number. Do this for every age and you trace a curve, the <Term id="cef">conditional expectation function</Term>:</p>
    <div class="card"><Tex block tex={String.raw`\mu(x) = \mathbb{E}[\,\text{Income} \mid \text{Age} = x\,]`} /></div>
    <p>Regression approximates this curve from a sample. Our question is about its <strong>shape</strong>:</p>
    <div class="callout">Does income keep climbing with seniority, or does it peak and fall, as <Term id="human-capital">human capital theory</Term> predicts?</div>
  </div>
  <div class="stack">
    <div class="card sky">
      <h3>Model 1 · Seniority</h3>
      <Tex block tex={String.raw`Y_i = \beta_0 + \beta_1\,\text{Age}_i + \varepsilon_i`} />
      <p class="small">Every year adds the same €β₁. A straight line, forever upward (if β₁ &gt; 0).</p>
    </div>
    <div class="card pink">
      <h3>Model 2 · Human capital</h3>
      <Tex block tex={String.raw`Y_i = \beta_0 + \beta_1\,\text{Age}_i + \beta_2\,\text{Age}_i^2 + \varepsilon_i`} />
      <p class="small">A <Term id="quadratic-term">squared term</Term> lets the slope change: rise, peak, decline.</p>
    </div>
    <p class="small muted">Both assume <Term id="exogeneity">E[ε | Age] = 0</Term> and <Term id="homoskedasticity">constant error variance</Term>. We will check the second one later.</p>
  </div>
</div>
