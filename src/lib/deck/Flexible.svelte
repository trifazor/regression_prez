<script>
  // "Linear" means linear in β: four shapes OLS can fit without any new machinery.
  import SlideHead from '../SlideHead.svelte';
  import Term from '../explain/Term.svelte';
  import Tex from '../Tex.svelte';
  import { linspace } from '../simple.js';

  const W = 300, H = 170, P = 14;
  const sx = (v) => P + (v / 10) * (W - 2 * P);
  const sy = (v) => H - P - (v / 10) * (H - 2 * P);
  const line = (f) => linspace(0.05, 10, 50).map((v, i) => `${i ? 'L' : 'M'}${sx(v).toFixed(1)},${sy(f(v)).toFixed(1)}`).join('');
  const panels = [
    { term: 'quadratic-term', title: 'Polynomial', tex: String.raw`\beta_1 x + \beta_2 x^2`, note: 'Curves with a peak or a trough.', paths: [[line((x) => 1 + 3.2 * x - 0.3 * x * x), 'var(--series-2)']] },
    { term: 'log-model', title: 'Logarithm', tex: String.raw`\beta_1 \log x`, note: 'Fast rise that levels off. Percent effects.', paths: [[line((x) => 1 + 3.4 * Math.log(1 + x)), 'var(--series-1)']] },
    { term: 'dummy', title: 'Dummy', tex: String.raw`\beta_2\,\text{female}`, note: 'Same slope, shifted level for a group.', paths: [[line((x) => 2 + 0.5 * x), 'var(--series-1)'], [line((x) => 4.5 + 0.5 * x), 'var(--series-2)']] },
    { term: 'interaction', title: 'Interaction', tex: String.raw`\beta_3\,(\text{female}\times x)`, note: 'The slope itself differs by group.', paths: [[line((x) => 1 + 0.8 * x), 'var(--series-1)'], [line((x) => 3.5 + 0.2 * x), 'var(--series-2)']] },
  ];
</script>

<SlideHead section="p2" title={'"Linear" regression doesn’t mean straight lines'} />
<div class="body stack">
  <p>OLS only needs the model to be <Term id="linear-in-params">linear in the β's</Term>. Transform or combine the X's however you like; each new column is just one more coefficient.</p>
  <div class="grid">
    {#each panels as p}
      <div class="card panel">
        <svg viewBox="0 0 {W} {H}"><rect x="1" y="1" width={W - 2} height={H - 2} rx="10" fill="var(--paper)" />
          {#each p.paths as [d, c]}<path {d} fill="none" stroke={c} stroke-width="5" stroke-linecap="round" />{/each}</svg>
        <h3><Term id={p.term}>{p.title}</Term></h3>
        <div class="tex"><Tex tex={p.tex} /></div>
        <p class="small">{p.note}</p>
      </div>
    {/each}
  </div>
  <div class="callout">In Part 4 we'll use the first one for the age profile, and the last two to compare <b>men and women</b>.</div>
</div>

<style>
  .grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 28px; }
  .panel svg { width: 100%; height: auto; display: block; margin-bottom: 14px; }
  .panel h3 { font-size: 30px; }
  .tex { font-size: 26px; margin-bottom: 8px; }
</style>
