<script>
  import SlideHead from '../SlideHead.svelte';
  import Term from '../explain/Term.svelte';
  import Tex from '../Tex.svelte';
</script>

<SlideHead section="p2" title="What the machine assumes, and what that buys" />
<div class="body cols wide-right">
  <div class="stack">
    <p>Minimizing the sum of squared errors has a closed-form answer. For one predictor it is just:</p>
    <div class="card"><Tex block tex={String.raw`\hat\beta_1 = \frac{\widehat{\operatorname{Cov}}(X,Y)}{\widehat{\operatorname{Var}}(X)},\qquad \hat\beta_0 = \bar y - \hat\beta_1\bar x`} /></div>
    <p>With many predictors, in matrix form:</p>
    <div class="card"><Tex block tex={String.raw`\hat{\boldsymbol\beta} = (\mathbf X^\top\mathbf X)^{-1}\mathbf X^\top\mathbf y`} /></div>
    <p class="small muted">The computer always produces numbers. Whether they <b>mean</b> anything depends on the assumptions →</p>
  </div>
  <div class="card">
    <table>
      <thead><tr><th>Assumption</th><th>Buys you</th><th>If it fails</th></tr></thead>
      <tbody>
        <tr><td><Term id="linear-in-params">Right functional form</Term></td><td>β describes the real pattern</td><td><span class="hz">Hazard 1</span></td></tr>
        <tr><td><Term id="exogeneity">E[ε | X] = 0</Term></td><td><b>Unbiased</b> β̂</td><td><span class="hz">Hazards 2 & 5</span></td></tr>
        <tr><td>No extreme single points</td><td>Stable estimates</td><td><span class="hz">Hazard 3</span></td></tr>
        <tr><td><Term id="homoskedasticity">Constant variance</Term></td><td>Correct SEs & p-values</td><td><span class="hz">Hazard 4</span></td></tr>
        <tr><td>Random, independent sample</td><td>Generalize to population</td><td>Biased / overconfident</td></tr>
      </tbody>
    </table>
    <p class="small muted" style="margin:14px 0 0">Formal list: the <Term id="gauss-markov">Gauss-Markov assumptions</Term>. Part 3 breaks each one on purpose.</p>
  </div>
</div>

<style>.hz { background: var(--yellow); border: 2px solid var(--ink); border-radius: 999px; padding: 2px 12px; font-weight: 700; font-size: 18px; white-space: nowrap; }</style>
