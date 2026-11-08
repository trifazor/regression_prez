<script>
  import { py } from '../pyodide.svelte.js';
  import { sections } from '../sections.js';
  import Term from '../explain/Term.svelte';
  const parts = ['p1', 'p2', 'p3', 'p4'];
  const blurbs = { p1: 'What regression is for, and what a "best line" means', p2: 'How OLS works and how to read its output', p3: 'Five ways regression lies to you', p4: 'Does income rise with age forever?' };
</script>

<div class="title">
  <div class="top">
    <span class="kicker">Advanced Statistics · <b>60 min workshop</b></span>
    <h1>Regression,<br /><span class="mark">explained.</span></h1>
    <p class="lead">What it is, how it works, where it breaks, and a live case on 350 Germans from <Term id="allbus">ALLBUS 2016</Term>.</p>
  </div>
  <div class="parts">
    {#each parts as id, i}
      <div class="part" style="background:{sections[id].color}; color:{sections[id].ink}">
        <span class="num">{i + 1}</span>
        <h3>{sections[id].label.split(' · ')[1]}</h3>
        <p>{blurbs[id]}</p>
        <span class="who">{sections[id].who}</span>
      </div>
    {/each}
  </div>
  <p class="status {py.status}">{py.status === 'ready' ? '✓' : '◌'} {py.message || 'Starting Python…'} · <span class="hl">Click pink-underlined terms</span> for explanations</p>
</div>

<style>
  .title { display: flex; flex-direction: column; height: 100%; gap: 40px; }
  .top { display: flex; flex-direction: column; gap: 22px; align-items: flex-start; }
  h1 { font-size: 120px; }
  .mark { background: var(--pink); padding: 0 18px; border: 4px solid var(--ink); border-radius: 22px; box-shadow: 10px 10px 0 var(--ink); display: inline-block; margin-top: 14px; }
  .lead { font-size: 34px; margin: 10px 0 0; max-width: 1400px; }
  .parts { display: grid; grid-template-columns: repeat(4, 1fr); gap: 28px; }
  .part { position: relative; border: 3px solid var(--ink); border-radius: 18px; padding: 24px 24px 56px; box-shadow: 8px 8px 0 var(--ink); }
  .part h3 { font-size: 34px; margin-top: 8px; }
  .part p { font-size: 22px; margin: 0; }
  .num { font-family: var(--display); font-weight: 700; font-size: 22px; border: 2.5px solid currentColor; border-radius: 50%; width: 42px; height: 42px; display: grid; place-items: center; }
  .who { position: absolute; bottom: 16px; left: 24px; font-size: 18px; font-weight: 700; text-transform: uppercase; letter-spacing: .06em; }
  .status { font-size: 22px; color: var(--muted); margin: 0; }
  .status.ready { color: var(--ink); }
</style>
