<script>
  import SlideHead from '../SlideHead.svelte';
  import Term from '../explain/Term.svelte';
  import { hazards } from './hazards.js';
</script>

<SlideHead section="p3" title="Five ways regression lies to you" />
<div class="body stack">
  <p>The software <b>never</b> warns you. Each hazard below gets a toy dataset where we <b>know the truth</b>, so you can watch OLS get it wrong.</p>
  <div class="grid">
    {#each hazards as h}
      <div class="hz card">
        <span class="icon">{h.icon}</span>
        <span class="tag">Hazard {h.n}</span>
        <h3><Term id={h.term}>{h.name}</Term></h3>
        <p class="small">{h.line}</p>
      </div>
    {/each}
  </div>
  <div class="callout">Keep these five cards in mind. In Part 4 we check every one against the real income data.</div>
</div>

<style>
  .grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 24px; }
  .hz { display: flex; flex-direction: column; gap: 10px; padding: 24px; }
  .hz:nth-child(odd) { background: var(--yellow); }
  .icon { font-size: 64px; line-height: 1; font-weight: 700; }
  .tag { font-size: 16px; font-weight: 700; text-transform: uppercase; letter-spacing: .08em; }
  .hz h3 { font-size: 30px; margin: 0; }
</style>
