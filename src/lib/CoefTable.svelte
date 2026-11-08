<script>
  import { fitted } from './model.svelte.js';
  import Term from './explain/Term.svelte';
  let { model = 'quadratic' } = $props();
  const names = ['β̂₀ const', 'β̂₁ age', 'β̂₂ age²'];
  let m = $derived(fitted.res?.[model]);
  const p = (v) => (v < 0.001 ? '<.001' : v.toFixed(3));
</script>

{#if m}
  <table class="coef">
    <thead><tr><th></th><th>Estimate</th><th><Term id="se">SE</Term></th><th><Term id="tstat">t</Term></th><th><Term id="pvalue">p</Term></th></tr></thead>
    <tbody>
      {#each m.b as b, i}
        <tr class:sig={m.p[i] < 0.05}>
          <td>{names[i]}</td><td>{b.toFixed(i === 2 ? 4 : 2)}</td><td>{m.se[i].toFixed(i === 2 ? 4 : 2)}</td><td>{m.t[i].toFixed(2)}</td>
          <td>{p(m.p[i])}{#if i > 0}<span class="badge" class:no={m.p[i] >= 0.05}>{m.p[i] < 0.05 ? 'sig.' : 'n.s.'}</span>{/if}</td>
        </tr>
      {/each}
    </tbody>
    <tfoot><tr><td colspan="5"><Term id="r2">R²</Term> = {m.r2.toFixed(4)} · <Term id="adjr2">adj. R²</Term> = {m.adj_r2.toFixed(4)} · <Term id="sigma">σ̂</Term> = {m.sigma.toFixed(0)} · <Term id="dof">df</Term> = {m.df}</td></tr></tfoot>
  </table>
{:else}
  <p class="muted">Waiting for the Python kernel…</p>
{/if}
