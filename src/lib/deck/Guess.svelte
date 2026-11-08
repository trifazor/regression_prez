<script>
  // Opening: the real data with axes hidden. The class commits to a prediction before any theory.
  import Plot from '../charts/Plot.svelte';
  import SlideHead from '../SlideHead.svelte';
  import Term from '../explain/Term.svelte';
  import { sample } from '../model.svelte.js';
  import { votes, options } from '../votes.svelte.js';
  let reveal = $state(false);
  let total = $derived(Object.values(votes).reduce((a, b) => a + b, 0));
</script>

<SlideHead section="open" title="Before any theory: what's the pattern?" />
<div class="body cols wide-left">
  <div class="chart-card mystery" class:reveal>
    <Plot xDomain={[16, 88]} yDomain={[0, 6500]} height={380} xLabel={reveal ? 'Age (years)' : '???'} yLabel={reveal ? 'Net income (€/month)' : '???'}
          xFormat={(v) => (reveal ? v : '')} yFormat={(v) => (reveal ? '€' + v.toLocaleString('en-US') : '')}>
      {#snippet children({ x, y })}
        {#each sample.rows as r}<circle cx={x(r.age)} cy={y(Math.min(r.income, 6500))} r="4" class="pt" />{/each}
      {/snippet}
    </Plot>
  </div>
  <div class="stack">
    <p>350 real people. Each dot is one person. Before we tell you what the axes are, <b>what would you predict</b>?</p>
    {#if !reveal}
      <button class="btn yellow" onclick={() => (reveal = true)}>Reveal the axes</button>
    {:else}
      <div class="callout"><b>X = age, Y = monthly net income.</b> How does income change as people get older? <Term id="vote">Vote first</Term>.</div>
      <div class="votes">
        {#each options as o}
          <div class="vote">
            <span class="icon">{o.icon}</span><span class="label">{o.label}</span>
            <button onclick={() => (votes[o.id] = Math.max(0, votes[o.id] - 1))} aria-label="minus">−</button>
            <b>{votes[o.id]}</b>
            <button onclick={() => votes[o.id]++} aria-label="plus">+</button>
          </div>
        {/each}
      </div>
      <p class="small muted">{total} votes recorded. We'll check them in Part 4.</p>
    {/if}
  </div>
</div>

<style>
  .pt { fill: var(--ink); fill-opacity: .45; stroke: #fff; stroke-width: .8; }
  .votes { display: flex; flex-direction: column; gap: 12px; }
  .vote { display: grid; grid-template-columns: 50px 1fr 46px 50px 46px; align-items: center; gap: 10px; background: #fff; border: 3px solid var(--ink); border-radius: 14px; padding: 8px 14px; box-shadow: 4px 4px 0 var(--ink); font-size: 24px; }
  .icon { font-size: 34px; font-weight: 700; text-align: center; }
  .vote button { width: 44px; height: 44px; border: 2.5px solid var(--ink); border-radius: 50%; background: var(--pink); font-size: 24px; font-weight: 700; cursor: pointer; }
  .vote b { text-align: center; font-family: var(--display); font-size: 30px; }
</style>
