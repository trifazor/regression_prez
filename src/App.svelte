<script>
  import { onMount } from 'svelte';
  import { bootPyodide, py } from './lib/pyodide.svelte.js';
  import { loadSample, refit, filters, sample } from './lib/model.svelte.js';
  import { thread, closeThread } from './lib/explain/thread.svelte.js';
  import ThreadPanel from './lib/explain/ThreadPanel.svelte';
  import { sections } from './lib/sections.js';
  import * as D from './lib/deck/index.js';

  // [component, footer title, section]: sections set the presenter colour and name.
  const slides = [
    [D.Title, 'Welcome', 'open'], [D.Guess, 'Guess the pattern', 'open'],
    [D.Purpose, 'Purpose', 'p1'], [D.Averages, 'Averages that move', 'p1'], [D.DragLine, 'Fit by hand', 'p1'], [D.Anatomy, 'Anatomy', 'p1'],
    [D.Machine, 'Assumptions', 'p2'], [D.Projection, 'Geometry', 'p2'], [D.ReadTable, 'Reading output', 'p2'], [D.Interpret, 'Drill', 'p2'], [D.Flexible, 'Flexible shapes', 'p2'],
    [D.Hazards, 'Five hazards', 'p3'], [D.H1Shape, 'Wrong shape', 'p3'], [D.H2Omitted, 'Missing variable', 'p3'], [D.H3Leverage, 'One point rules', 'p3'], [D.H4Fan, 'Uneven noise', 'p3'], [D.H5Causal, 'Not causal', 'p3'],
    [D.CaseIntro, 'The case', 'p4'], [D.CaseLinear, 'Straight line', 'p4'], [D.CaseQuad, 'Add age²', 'p4'], [D.CaseF, 'F-test', 'p4'], [D.BySex, 'Men vs women', 'p4'], [D.CaseDiag, 'Diagnostics', 'p4'], [D.Verdict, 'Verdict', 'p4'],
    [D.GroupWork, 'Group exercise', 'ex'], [D.JaspSteps, 'JASP', 'ex'], [D.Takeaways, 'Takeaways', 'open'], [D.Lab, 'Appendix: lab', 'open'],
  ].map(([c, t, s]) => ({ c, t, s }));
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
      <span class="who" style="background:{sections[slides[index].s].color}; color:{sections[slides[index].s].ink}">{sections[slides[index].s].who}</span>
      <span class="title">{String(index + 1).padStart(2, '0')} · {slides[index].t}</span>
      <div class="progress">
        {#each slides as s, i}
          <button class:done={i < index} class:now={i === index} style="--sec:{sections[s.s].color}" onclick={() => go(i)} title={s.t} aria-label="Go to slide {i + 1}: {s.t}"></button>
        {/each}
      </div>
      <span class="kernel {py.status}" title={py.message}>{py.status === 'ready' ? 'Python ready' : py.status === 'error' ? 'Python error' : 'Loading Python…'}</span>
      <button class="nav" onclick={() => go(index + 1)} disabled={index === slides.length - 1} aria-label="Next slide">→</button>
    </footer>
    <ThreadPanel />
  </div>
</div>
