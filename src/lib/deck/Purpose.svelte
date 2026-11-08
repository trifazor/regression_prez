<script>
  import SlideHead from '../SlideHead.svelte';
  import Term from '../explain/Term.svelte';
</script>

<SlideHead section="p1" title="What is regression for?" />
<div class="body stack">
  <p>Regression answers one question: <span class="hl">how does the average of Y change when X changes?</span> That single answer gets used for three very different jobs.</p>
  <div class="cols three">
    <div class="card pink"><span class="big">01</span><h3>Describe</h3><p class="small">"People with a degree earn €900 more per month <b>on average</b>."</p><p class="small muted">Needs: a good sample.</p></div>
    <div class="card yellow"><span class="big">02</span><h3>Predict</h3><p class="small">"An 80 m² flat in Leipzig will rent for about €720."</p><p class="small muted">Needs: small prediction errors.</p></div>
    <div class="card sky"><span class="big">03</span><h3>Explain</h3><p class="small">"An extra year of school <b>raises</b> earnings by 8%."</p><p class="small muted">Needs: a <Term id="causation">causal</Term> argument. Hardest!</p></div>
  </div>
  <div class="callout pink">Same formula, same output table, but the <Term id="three-jobs">standard of evidence</Term> rises from left to right. Most mistakes come from reading a job-1 result as a job-3 claim.</div>
</div>

<style>
  .big { font-family: var(--display); font-size: 56px; font-weight: 700; line-height: 1; }
  .card h3 { font-size: 40px; margin-top: 8px; }
</style>
