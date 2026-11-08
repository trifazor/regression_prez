<script>
  import Tex from '../Tex.svelte';
  import Term from '../explain/Term.svelte';
  import { fitted, view } from '../model.svelte.js';
  let m = $derived(fitted.res?.[view.degree === 1 ? 'linear' : 'quadratic']);
  const names = ['1 (constant)', 'age', 'age²'];
</script>

<header class="slide-head"><span class="kicker"><b>06</b> Geometry</span><h2>OLS is a perpendicular drop</h2></header>
<div class="body cols wide-left">
  <div class="stack">
    <div class="diagram card">
      <svg viewBox="0 0 520 300" aria-label="Projection of y onto the column space of X">
        <polygon points="40,230 330,280 490,190 200,150" fill="var(--sky)" stroke="var(--ink)" stroke-width="3" />
        <text x="400" y="262" class="lab">Col(X)</text>
        <line x1="120" y1="215" x2="300" y2="40" stroke="var(--ink)" stroke-width="4" marker-end="url(#ar)" />
        <line x1="120" y1="215" x2="300" y2="205" stroke="var(--series-2)" stroke-width="4" marker-end="url(#ar2)" />
        <line x1="300" y1="40" x2="300" y2="200" stroke="var(--series-3)" stroke-width="4" stroke-dasharray="8 6" />
        <polyline points="300,186 286,187 286,201" fill="none" stroke="var(--ink)" stroke-width="2.5" />
        <text x="312" y="44" class="lab">y</text>
        <text x="312" y="226" class="lab" fill="var(--series-2)">ŷ = Xβ̂</text>
        <text x="312" y="130" class="lab" fill="var(--series-3)">e = y − ŷ</text>
        <defs>
          <marker id="ar" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0,0L10,5L0,10Z" fill="var(--ink)" /></marker>
          <marker id="ar2" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0,0L10,5L0,10Z" fill="var(--series-2)" /></marker>
        </defs>
      </svg>
    </div>
    <p class="small">The 350 incomes form <b>one vector</b> <Tex tex={String.raw`\mathbf y\in\mathbb R^{350}`} />. All possible predictions live in the plane <Term id="colspace">Col(X)</Term>. OLS takes the <Term id="projection">orthogonal projection</Term>: the closest point, reached at a right angle.</p>
  </div>
  <div class="stack">
    <p>Right angle means the residual is perpendicular to every column of X: the <Term id="normal-eq">normal equations</Term>. Solving them gives the OLS formula.</p>
    <Tex block tex={String.raw`\mathbf X^\top \mathbf e = \mathbf 0 \quad\Rightarrow\quad \hat{\boldsymbol\beta} = (\mathbf X^\top\mathbf X)^{-1}\mathbf X^\top\mathbf y`} />
    <div class="card yellow">
      <h3>Live check: Xᵀe ({view.degree === 1 ? "linear" : "quadratic"})</h3>
      {#if m}
        <table class="coef">
          <tbody>{#each m.orth as v, i}<tr><td>Σ {names[i]} · e</td><td><code>{v.toExponential(1)}</code></td></tr>{/each}</tbody>
        </table>
        <div class="seg" style="margin-top:14px">
          <button class="lin" class:on={view.degree === 1} onclick={() => (view.degree = 1)}>Linear</button>
          <button class="quad" class:on={view.degree === 2} onclick={() => (view.degree = 2)}>Quadratic</button>
        </div>
      {/if}
    </div>
    <p class="small muted">Zero up to floating-point round-off. The diagonal of the <Term id="hatmatrix">hat matrix</Term> gives each point's <Term id="leverage">leverage</Term>.</p>
  </div>
</div>

<style>
  .diagram svg { width: 100%; height: auto; display: block; }
  .lab { font-family: var(--display); font-size: 22px; font-weight: 700; }
</style>
