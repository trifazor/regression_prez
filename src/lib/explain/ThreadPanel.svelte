<script>
  import { tick } from 'svelte';
  import { glossary } from './glossary.js';
  import { renderBody } from './render.js';
  import { thread, openTerm, closeThread, popThread } from './thread.svelte.js';

  let scroller = $state();
  let open = $derived(thread.stack.length > 0);

  $effect(() => {
    thread.stack.length;
    tick().then(() => {
      const entries = scroller?.querySelectorAll('article.entry');
      const last = entries?.[entries.length - 1];
      if (last) scroller.scrollTo({ top: last.offsetTop - 24, behavior: 'smooth' });
    });
  });

  function onclick(e, index) {
    const btn = e.target.closest('[data-term]');
    if (btn) openTerm(btn.dataset.term, index);
  }
</script>

{#if open}
  <button class="scrim" aria-label="Close explanation" onclick={closeThread}></button>
  <aside class="thread" aria-label="Explanation thread">
    <header>
      <span class="label">Explanation thread</span>
      <nav class="crumbs">
        {#each thread.stack as id, i}
          {#if i}<span class="sep">→</span>{/if}
          <button class:current={i === thread.stack.length - 1} onclick={() => (thread.stack = thread.stack.slice(0, i + 1))}>{glossary[id].title.split(' (')[0]}</button>
        {/each}
      </nav>
      {#if thread.stack.length > 1}<button class="icon" onclick={popThread} aria-label="Back">←</button>{/if}
      <button class="icon" onclick={closeThread} aria-label="Close">✕</button>
    </header>
    <div class="entries" bind:this={scroller}>
      {#each thread.stack as id, i (id)}
        {@const g = glossary[id]}
        <!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_noninteractive_element_interactions -->
        <article class="entry" class:faded={i < thread.stack.length - 1} onclick={(e) => onclick(e, i)}>
          <span class="tag">{g.tag}</span>
          <h3>{g.title}</h3>
          <div class="body">{@html renderBody(g.body)}</div>
        </article>
      {/each}
      <p class="hint" data-hint>Click any <span class="term demo">highlighted term</span> to continue the thread · Esc to close</p>
    </div>
  </aside>
{/if}

<style>
  .scrim { position: absolute; inset: 0; background: rgb(0 0 0 / .18); border: 0; z-index: 20; cursor: default; }
  .thread {
    position: absolute; top: 40px; right: 40px; bottom: 40px; width: 760px; z-index: 21;
    background: var(--paper); border: 3px solid var(--ink); border-radius: 18px;
    box-shadow: 10px 10px 0 var(--ink); display: flex; flex-direction: column; overflow: hidden;
    animation: slide-in .22s cubic-bezier(.2, .9, .3, 1.2);
  }
  @keyframes slide-in { from { transform: translateX(60px); opacity: 0; } }
  header { display: flex; align-items: center; gap: 12px; padding: 18px 22px; background: var(--pink); border-bottom: 3px solid var(--ink); }
  .label { font-family: var(--display); font-weight: 700; font-size: 18px; text-transform: uppercase; letter-spacing: .06em; white-space: nowrap; }
  .crumbs { flex: 1; display: flex; flex-wrap: wrap; gap: 4px 6px; align-items: center; font-size: 17px; min-width: 0; }
  .crumbs button { border: 0; background: none; padding: 2px 4px; font: inherit; cursor: pointer; color: var(--ink); text-decoration: underline; text-underline-offset: 3px; }
  .crumbs button.current { text-decoration: none; font-weight: 700; }
  .sep { opacity: .5; }
  .icon { width: 44px; height: 44px; border: 2px solid var(--ink); border-radius: 50%; background: var(--paper); font-size: 20px; cursor: pointer; flex: none; }
  .icon:hover { background: var(--yellow); }
  .entries { flex: 1; overflow-y: auto; padding: 26px 30px 40px; display: flex; flex-direction: column; gap: 26px; position: relative; }
  .entry { position: relative; background: #fff; border: 2px solid var(--ink); border-radius: 14px; padding: 22px 26px; box-shadow: 5px 5px 0 var(--ink); transition: opacity .2s; }
  .entry + .entry::before { content: ''; position: absolute; left: 40px; top: -28px; height: 26px; border-left: 3px dashed var(--ink); }
  .entry.faded { opacity: .62; }
  .entry.faded:hover { opacity: 1; }
  .tag { display: inline-block; background: var(--yellow); border: 2px solid var(--ink); border-radius: 999px; padding: 2px 12px; font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: .05em; }
  h3 { font-family: var(--display); font-size: 32px; margin: 10px 0 8px; line-height: 1.1; }
  .body { font-size: 22px; line-height: 1.5; }
  .body :global(p) { margin: .55em 0; }
  .body :global(.tex-display) { margin: .5em 0; overflow-x: auto; font-size: 1.05em; }
  .hint { font-size: 16px; color: var(--muted); text-align: center; margin: 0; }
  .demo { pointer-events: none; }
</style>
