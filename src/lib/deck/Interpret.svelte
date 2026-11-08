<script>
  // Interpretation drill: the class answers, the presenter flips the card.
  import SlideHead from '../SlideHead.svelte';
  import Term from '../explain/Term.svelte';
  const cards = [
    { q: 'β₁ = 2.1 for study hours. What does it mean?', a: 'Students who study one hour more score 2.1 points higher <b>on average</b>. It is a comparison between students, not a promise for any one student.' },
    { q: 'R² = 0.04. Is the model useless?', a: '<b>Not necessarily.</b> X can matter a lot and still explain little of the total spread, because individuals vary for many other reasons. Look at the p-value and the size of β too.' },
    { q: 'p = 0.16 for a slope. So X has no effect?', a: '<b>No.</b> We just can’t rule out zero with this sample <i>and this model</i>. A wrong shape, like a line through a hump, can hide a real relationship. Keep this one in mind.' },
    { q: 'β₁ is significant. So X causes Y?', a: '<b>No.</b> Significance is about chance, not causation. That needs <i>exogeneity</i>: no confounders tangled up with X. See Part 3, Hazard 5.' },
  ];
  let open = $state(cards.map(() => false));
</script>

<SlideHead section="p2" title="Interpretation drill: what would you say?" />
<div class="body grid">
  {#each cards as c, i}
    <button class="flip card" class:open={open[i]} onclick={() => (open[i] = !open[i])}>
      <span class="n">{i + 1}</span>
      <p class="q">{c.q}</p>
      {#if open[i]}<p class="a">{@html c.a}</p>{:else}<span class="hint">Discuss with your neighbour, then click to reveal</span>{/if}
    </button>
  {/each}
</div>
<p class="small muted" style="margin-top:24px">More detail: <Term id="slope">slope</Term> · <Term id="r2">R²</Term> · <Term id="pvalue">p-value</Term> · <Term id="causation">causation</Term></p>

<style>
  .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 32px; }
  .flip { text-align: left; cursor: pointer; font: inherit; display: flex; flex-direction: column; gap: 14px; position: relative; padding-left: 96px; transition: background .15s; }
  .flip.open { background: var(--sky); }
  .n { position: absolute; left: 26px; top: 26px; width: 50px; height: 50px; border-radius: 50%; background: var(--ink); color: var(--paper); display: grid; place-items: center; font-family: var(--display); font-weight: 700; font-size: 26px; }
  .q { font-family: var(--display); font-weight: 700; font-size: 32px; margin: 0; line-height: 1.2; }
  .a { font-size: 25px; margin: 0; }
  .hint { font-size: 20px; color: var(--muted); }
</style>
