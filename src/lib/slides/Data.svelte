<script>
  import { sample } from '../model.svelte.js';
  import { fmt } from '../charts/scale.js';
  import Term from '../explain/Term.svelte';
  let s = $derived.by(() => {
    const r = sample.rows;
    if (!r.length) return null;
    const inc = r.map((d) => d.income).sort((a, b) => a - b);
    const mean = (a) => a.reduce((x, y) => x + y, 0) / a.length;
    return { n: r.length, male: r.filter((d) => d.sex === 1).length, ageMean: mean(r.map((d) => d.age)),
             incMean: mean(inc), incMed: inc[Math.floor(inc.length / 2)], incMax: inc[inc.length - 1] };
  });
</script>

<header class="slide-head"><span class="kicker"><b>03</b> Data</span><h2>350 Germans, four variables</h2></header>
<div class="body cols wide-right">
  <div class="stack">
    {#if s}
      <div class="stats">
        <div class="stat"><span>{s.n}</span>respondents</div>
        <div class="stat"><span>{s.ageMean.toFixed(1)}</span>mean age</div>
        <div class="stat"><span>{s.male}/{s.n - s.male}</span>men / women</div>
        <div class="stat"><span>€{fmt(s.incMed)}</span>median income</div>
        <div class="stat"><span>€{fmt(s.incMean)}</span>mean income</div>
        <div class="stat"><span>€{fmt(s.incMax)}</span>maximum</div>
      </div>
    {/if}
    <div class="callout">Mean &gt; median: income is <Term id="skew">right-skewed</Term>. A few high earners pull the average up. Keep this in mind for the diagnostics.</div>
  </div>
  <div class="stack">
    <div class="card">
      <table>
        <thead><tr><th>Variable</th><th>Meaning</th><th>Cleaning</th><th>Role</th></tr></thead>
        <tbody>
          <tr><td><code>income</code></td><td>Net income, €/month</td><td>drop missing; clamp 100–12,000</td><td><b>Y</b></td></tr>
          <tr><td><code>age</code></td><td>Age in years</td><td>keep 18–85</td><td><b>X</b></td></tr>
          <tr><td><code>age_sq</code></td><td>Age squared</td><td>age × age</td><td><b>X²</b></td></tr>
          <tr><td><code>sex</code></td><td>1 = man, 2 = woman</td><td>binary</td><td>filter</td></tr>
        </tbody>
      </table>
    </div>
    <p class="small muted">Source: GESIS ZA6770 (<Term id="issp">ISSP 2015</Term>, German sample fielded with <Term id="allbus">ALLBUS 2016</Term>). 350 cases drawn at random (seed 2016) from 1,602 complete German respondents.</p>
  </div>
</div>
