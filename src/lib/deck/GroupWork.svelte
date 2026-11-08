<script>
  import SlideHead from '../SlideHead.svelte';
  import Plot from '../charts/Plot.svelte';
  import Term from '../explain/Term.svelte';
  import { fit } from '../pyodide.svelte.js';
  import { sample, fitted, csvString } from '../model.svelte.js';
  import { groups } from './groups.js';

  // Results typed in by each table, kept for the session.
  let entered = $state(Object.fromEntries(groups.map((g) => [g.id, { peak: '', p: '' }])));
  let reveal = $state(false);
  let app = $derived(fitted.full ? Object.fromEntries(groups.map((g) => {
    const r = fit(sample.rows.map(g.keep), { track: false });
    return [g.id, { peak: r?.peak, p: r?.ftest.p, n: r?.n }];
  })) : null);

  function download(g) {
    const blob = new Blob([csvString(sample.rows.filter(g.keep))], { type: 'text/csv;charset=utf-8' });
    const a = Object.assign(document.createElement('a'), { href: URL.createObjectURL(blob), download: `allbus2016_${g.id}.csv` });
    a.click();
    URL.revokeObjectURL(a.href);
  }
</script>

<SlideHead section="ex" title="Group exercise: is the hump the same for everyone?" />
<div class="body cols wide-left">
  <div class="stack">
    <div class="groups">
      {#each groups as g, i}
        <div class="g card">
          <span class="n">{String.fromCharCode(65 + i)}</span>
          <div class="info"><b>{g.name}</b><span class="small muted">{g.rule}{app ? ` · n = ${app[g.id].n}` : ''}</span></div>
          <button class="btn" onclick={() => download(g)} title="Download this group's CSV">↓ CSV</button>
          <input type="number" step="0.1" placeholder="peak" bind:value={entered[g.id].peak} aria-label="{g.name} peak age" />
          <input type="number" step="0.001" placeholder="p (age²)" bind:value={entered[g.id].p} aria-label="{g.name} p-value" />
          {#if reveal && app}<span class="app">{app[g.id].peak ? app[g.id].peak.toFixed(1) : '–'} · {app[g.id].p < 0.001 ? '<.001' : app[g.id].p.toFixed(3)}</span>{/if}
        </div>
      {/each}
    </div>
    <label class="check"><input type="checkbox" bind:checked={reveal} /> show the app's answers</label>
  </div>
  <div class="stack">
    <div class="card yellow small">
      <h3>Each table (12 min)</h3>
      <ol>
        <li>Download your group's CSV and open it in <Term id="jasp">JASP</Term>.</li>
        <li>Fit income ~ age + age_sq.</li>
        <li>Compute peak = −β(age) / (2·β(age_sq)).</li>
        <li>Type peak and p(age²) into your row.</li>
      </ol>
    </div>
    <div class="chart-card">
      <Plot xDomain={[30, 80]} yDomain={[0, groups.length + 1]} height={250} width={520} xLabel="Peak earning age" yLabel="" yFormat={() => ''}>
        {#snippet children({ x, y })}
          {#each groups as g, i}
            {@const yy = y(groups.length - i)}
            <text x={x(30) + 6} y={yy + 5} class="annot">{String.fromCharCode(65 + i)}</text>
            {#if reveal && app?.[g.id].peak}<circle cx={x(Math.min(80, app[g.id].peak))} cy={yy} r="9" fill="none" stroke="var(--ink)" stroke-width="3" />{/if}
            {#if +entered[g.id].peak}<circle cx={x(Math.min(80, +entered[g.id].peak))} cy={yy} r="7" fill="var(--pink)" stroke="var(--ink)" stroke-width="2" />{/if}
          {/each}
        {/snippet}
      </Plot>
    </div>
    <p class="small muted">Pink = your answer · ring = app. Which groups disagree, and why? Think about the <b>hazards</b>.</p>
  </div>
</div>

<style>
  .groups { display: flex; flex-direction: column; gap: 14px; }
  .g { display: grid; grid-template-columns: 52px 1fr auto 130px 150px 170px; align-items: center; gap: 14px; padding: 12px 18px; box-shadow: 4px 4px 0 var(--ink); }
  .n { width: 46px; height: 46px; border-radius: 50%; background: var(--orange); border: 2.5px solid var(--ink); display: grid; place-items: center; font-family: var(--display); font-weight: 700; font-size: 24px; }
  .info { display: flex; flex-direction: column; font-size: 24px; }
  .g .btn { padding: 6px 14px; font-size: 18px; box-shadow: 3px 3px 0 var(--ink); }
  input[type='number'] { font: inherit; font-size: 22px; width: 100%; padding: 6px 10px; border: 2.5px solid var(--ink); border-radius: 10px; background: var(--paper); }
  .app { font-family: var(--display); font-weight: 700; font-size: 22px; background: var(--teal); color: #fff; border-radius: 999px; padding: 4px 12px; text-align: center; }
  ol { margin: 0; }
</style>
