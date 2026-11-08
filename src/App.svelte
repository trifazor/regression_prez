<script>
  import { onMount } from 'svelte';
  import { bootPyodide, py } from './lib/pyodide.svelte.js';
  import { loadSample, refit, filters, sample } from './lib/model.svelte.js';
  import { thread, closeThread } from './lib/explain/thread.svelte.js';
  import ThreadPanel from './lib/explain/ThreadPanel.svelte';
  import Title from './lib/slides/Title.svelte';
  import Question from './lib/slides/Question.svelte';
  import Data from './lib/slides/Data.svelte';
  import Linear from './lib/slides/Linear.svelte';
  import ReadTable from './lib/slides/ReadTable.svelte';
  import Projection from './lib/slides/Projection.svelte';
  import Quadratic from './lib/slides/Quadratic.svelte';
  import FTest from './lib/slides/FTest.svelte';
  import Diagnostics from './lib/slides/Diagnostics.svelte';
  import Lab from './lib/slides/Lab.svelte';
  import Jasp from './lib/slides/Jasp.svelte';
  import Summary from './lib/slides/Summary.svelte';

  const slides = [
    { c: Title, t: 'Title' }, { c: Question, t: 'The question' }, { c: Data, t: 'Data' },
    { c: Linear, t: 'Model 1' }, { c: ReadTable, t: 'Reading the table' }, { c: Projection, t: 'Geometry' },
    { c: Quadratic, t: 'Model 2' }, { c: FTest, t: 'F-test' }, { c: Diagnostics, t: 'Diagnostics' },
    { c: Lab, t: 'Lab' }, { c: Jasp, t: 'JASP' }, { c: Summary, t: 'Takeaways' },
  ];
  const fromHash = () => Math.min(slides.length - 1, Math.max(0, (parseInt(location.hash.slice(1)) || 1) - 1));
  let index = $state(fromHash());

  function go(i) {
    index = Math.min(slides.length - 1, Math.max(0, i));
    history.replaceState(null, '', `#${index + 1}`);
    closeThread();
  }

  function onkeydown(e) {
    if (e.key === 'Escape' && thread.stack.length) { closeThread(); return; }
    if (e.target.closest?.('input, select, textarea')) return;
    if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') { e.preventDefault(); go(index + 1); }
    else if (e.key === 'ArrowLeft' || e.key === 'PageUp') { e.preventDefault(); go(index - 1); }
    else if (e.key === 'Home') go(0);
    else if (e.key === 'End') go(slides.length - 1);
    else if (e.key === 'f') document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen();
  }

  // Fit the 1920×1080 stage into whatever screen/projector we are on (letterboxed).
  let vw = $state(1920), vh = $state(1080);
  let scale = $derived(Math.min(vw / 1920, vh / 1080));

  onMount(async () => {
    const data = await loadSample();
    bootPyodide(data);
  });

  // Refit whenever the kernel becomes ready or any filter changes.
  $effect(() => {
    py.status; sample.loaded;
    filters.sex; filters.ageMin; filters.ageMax; filters.incomeCap; filters.dropHighLeverage;
    refit();
  });

  const Current = $derived(slides[index].c);
</script>

<svelte:window {onkeydown} bind:innerWidth={vw} bind:innerHeight={vh} onhashchange={() => (index = fromHash())} />

<div class="viewport">
  <div class="stage" style="transform: translate(-50%, -50%) scale({scale})">
    <section class="slide"><Current /></section>
    <footer class="deck-footer">
      <button class="nav" onclick={() => go(index - 1)} disabled={index === 0} aria-label="Previous slide">←</button>
      <span class="title">{String(index + 1).padStart(2, '0')} · {slides[index].t}</span>
      <div class="progress">
        {#each slides as s, i}
          <button class:done={i < index} class:now={i === index} onclick={() => go(i)} title={s.t} aria-label="Go to slide {i + 1}: {s.t}"></button>
        {/each}
      </div>
      <span class="kernel {py.status}" title={py.message}>{py.status === 'ready' ? 'Python ready' : py.status === 'error' ? 'Python error' : 'Loading Python…'}</span>
      <button class="nav" onclick={() => go(index + 1)} disabled={index === slides.length - 1} aria-label="Next slide">→</button>
    </footer>
    <ThreadPanel />
  </div>
</div>
