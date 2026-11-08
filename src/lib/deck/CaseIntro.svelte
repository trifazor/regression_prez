<script>
  import SlideHead from '../SlideHead.svelte';
  import Term from '../explain/Term.svelte';
  import { sample } from '../model.svelte.js';
  import { votes, options } from '../votes.svelte.js';
  import { fmt } from '../charts/scale.js';
  let total = $derived(Object.values(votes).reduce((a, b) => a + b, 0));
  let max = $derived(Math.max(1, ...Object.values(votes)));
  let s = $derived.by(() => {
    const r = sample.rows; if (!r.length) return null;
    const inc = r.map((d) => d.income).sort((a, b) => a - b);
    return { n: r.length, med: inc[Math.floor(inc.length / 2)], mean: inc.reduce((a, b) => a + b, 0) / inc.length };
  });
</script>

<SlideHead section="p4" title="The case: does income rise with age forever?" />
<div class="body cols">
  <div class="stack">
    <p>Back to the mystery plot. <Term id="human-capital">Human capital theory</Term> predicts a <b>hump</b>: skills build up, then fade, then people retire. A simple seniority story predicts <b>steady growth</b>.</p>
    {#if s}
      <div class="stats">
        <div class="stat"><span>{s.n}</span>Germans, 18–85</div>
        <div class="stat"><span>€{fmt(s.med)}</span>median net income</div>
        <div class="stat"><span>€{fmt(s.mean)}</span>mean (<Term id="skew">skewed</Term>)</div>
      </div>
    {/if}
    <p class="small muted">Source: <Term id="allbus">ALLBUS 2016</Term> / <Term id="issp">ISSP 2015</Term> (GESIS ZA6770), German respondents, 350 drawn at random.</p>
  </div>
  <div class="card">
    <h3>What you predicted at the start</h3>
    {#each options as o}
      <div class="bar-row">
        <span class="lab">{o.icon} {o.label}</span>
        <div class="bar"><div style="width:{(votes[o.id] / max) * 100}%"></div></div>
        <b>{votes[o.id]}</b>
      </div>
    {/each}
    <p class="small muted" style="margin:14px 0 0">{total ? `${total} votes.` : 'No votes recorded. Ask for a show of hands now!'} Let's test them with everything from Parts 1–3.</p>
  </div>
</div>

<style>
  .stats { grid-template-columns: repeat(3, 1fr); }
  .bar-row { display: grid; grid-template-columns: 330px 1fr 50px; align-items: center; gap: 14px; margin: 14px 0; font-size: 24px; }
  .bar { height: 30px; border: 3px solid var(--ink); border-radius: 999px; background: var(--paper); overflow: hidden; }
  .bar div { height: 100%; background: var(--teal); }
  .bar-row b { font-family: var(--display); font-size: 30px; }
</style>
