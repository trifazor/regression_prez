<script>
  // Regression as "averages that move": bin means → smooth line.
  import ToyChart from '../charts/ToyChart.svelte';
  import SlideHead from '../SlideHead.svelte';
  import Term from '../explain/Term.svelte';
  import Tex from '../Tex.svelte';
  import { study } from '../toy.js';
  import { simpleOLS } from '../simple.js';

  let step = $state(0); // 0 = points, 1 = bin averages, 2 = line
  const edges = [0, 5, 10, 15, 21];
  const bins = edges.slice(0, -1).map((lo, i) => {
    const hi = edges[i + 1];
    const ys = study.filter((p) => p.x >= lo && p.x < hi).map((p) => p.y);
    return { lo, hi, mean: ys.reduce((a, b) => a + b, 0) / ys.length, n: ys.length };
  });
  const fit = simpleOLS(study);
  let lines = $derived([
    ...(step >= 1 ? bins.map((b) => ({ xs: [b.lo, b.hi], ys: [b.mean, b.mean], color: 'var(--yellow)', width: 8 })) : []),
    ...(step >= 2 ? [{ xs: [0, 21], ys: [fit.a, fit.a + fit.b * 21], color: 'var(--series-1)' }] : []),
  ]);
</script>

<SlideHead section="p1" title="Regression = averages that move with X" />
<div class="body cols wide-left">
  <div>
    <div class="chart-card"><ToyChart points={study} {lines} xDomain={[0, 21]} yDomain={[20, 100]} xLabel="Study hours" yLabel="Exam score" height={340} /></div>
    <div class="seg" style="margin-top:20px">
      <button class:on={step === 0} onclick={() => (step = 0)}>1 · Data</button>
      <button class:on={step === 1} onclick={() => (step = 1)}>2 · Group averages</button>
      <button class:on={step === 2} onclick={() => (step = 2)}>3 · Smooth it</button>
    </div>
  </div>
  <div class="stack">
    {#if step === 0}
      <p>24 students: hours studied vs. exam score. Students with the same hours still get different scores. There is <b>noise</b>.</p>
      <p>So we can't predict one student exactly. What we <i>can</i> ask: what's the <b>typical</b> score for a given amount of study?</p>
    {:else if step === 1}
      <p>Average the scores within groups of similar study time. The yellow steps climb: <b>the average of Y depends on X</b>.</p>
      <p>That curve of averages has a name: the <Term id="cef">conditional expectation function</Term>.</p>
      <Tex block tex={String.raw`\mathbb E[\text{score}\mid\text{hours}=x]`} />
    {:else}
      <p>Regression replaces the jumpy steps with a <b>simple shape</b>, here a straight line, that summarizes how the average changes.</p>
      <div class="card sky"><p class="eq">score ≈ {fit.a.toFixed(1)} + {fit.b.toFixed(2)} × hours</p></div>
      <p class="small">But which line? Infinitely many pass through this cloud. Next: what makes one line "best".</p>
    {/if}
  </div>
</div>

<style>.eq { font-family: var(--display); font-size: 38px; margin: 0; }</style>
