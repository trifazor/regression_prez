<script>
  import { filters, view, fitted, MIN_N } from './model.svelte.js';
  import { py } from './pyodide.svelte.js';
  import Term from './explain/Term.svelte';
  let { showDegree = true, showFilters = true } = $props();

  function reset() {
    Object.assign(filters, { sex: 'all', ageMin: 18, ageMax: 85, incomeCap: 12000, dropHighLeverage: false });
  }
</script>

<div class="controls">
  {#if showDegree}
    <div class="seg" role="radiogroup" aria-label="Model">
      <button class="lin" class:on={view.degree === 1} onclick={() => (view.degree = 1)}>Linear</button>
      <button class="quad" class:on={view.degree === 2} onclick={() => (view.degree = 2)}>Quadratic</button>
    </div>
  {/if}
  {#if showFilters}
    <label class="field">Sex
      <select bind:value={filters.sex}>
        <option value="all">All</option><option value={1}>Men</option><option value={2}>Women</option>
      </select>
    </label>
    <div class="field">Age {filters.ageMin}–{filters.ageMax}
      <span class="pair">
        <input type="range" min="18" max="85" bind:value={filters.ageMin} aria-label="Minimum age" oninput={() => (filters.ageMax = Math.max(filters.ageMax, filters.ageMin + 5))} />
        <input type="range" min="18" max="85" bind:value={filters.ageMax} aria-label="Maximum age" oninput={() => (filters.ageMin = Math.min(filters.ageMin, filters.ageMax - 5))} />
      </span>
    </div>
    <label class="field">Income ≤ €{filters.incomeCap.toLocaleString('en-US')}
      <input type="range" min="2000" max="12000" step="250" bind:value={filters.incomeCap} />
    </label>
    <span class="check-wrap">
      <label class="check"><input type="checkbox" bind:checked={filters.dropHighLeverage} /> Drop high</label>
      <Term id="leverage">leverage</Term>
    </span>
    <button class="btn small-btn" onclick={reset}>Reset</button>
  {/if}
  <span class="meta">
    {#if fitted.res}<b>n = {fitted.res.n}</b> · refit {py.lastFitMs.toFixed(1)} ms{:else if py.status === 'ready'}Fewer than {MIN_N} people. Widen the filters.{:else}Waiting for Python…{/if}
  </span>
</div>

<style>
  .controls { display: flex; flex-wrap: wrap; gap: 14px 30px; align-items: center; margin-bottom: 22px; font-size: 20px; font-weight: 700; }
  .field { display: flex; flex-direction: column; gap: 4px; }
  .pair { display: flex; gap: 8px; }
  .pair input { width: 130px; }
  .field > input[type='range'] { width: 200px; }
  .check-wrap { display: inline-flex; gap: 6px; align-items: center; font-size: 22px; }
  .small-btn { padding: 8px 20px; font-size: 20px; }
  .meta { margin-left: auto; font-weight: 500; font-variant-numeric: tabular-nums; background: #fff; border: 2.5px solid var(--ink); border-radius: 999px; padding: 6px 16px; }
</style>
