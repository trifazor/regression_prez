<script>
  import SlideHead from '../SlideHead.svelte';
  import Tex from '../Tex.svelte';
  import Term from '../explain/Term.svelte';
  import { callPy, py } from '../pyodide.svelte.js';
  import { study } from '../toy.js';
  let m = $derived(py.status === 'ready' ? callPy('fit_design', { y: study.map((p) => p.y), columns: { hours: study.map((p) => p.x) } }) : null);
  let orth = $derived(m ? [m.resid.reduce((s, e) => s + e, 0), m.resid.reduce((s, e, i) => s + e * study[i].x, 0)] : null);
</script>

<SlideHead section="p2" title="The geometry: OLS is a perpendicular drop" />
<div class="body cols wide-left">
  <div class="stack">
    <div class="card diagram">
      <svg viewBox="0 0 520 290" aria-label="Projection of y onto the column space of X">
        <polygon points="40,225 330,275 490,185 200,145" fill="var(--sky)" stroke="var(--ink)" stroke-width="3" />
        <text x="400" y="258" class="lab">Col(X)</text>
        <line x1="120" y1="210" x2="300" y2="35" stroke="var(--ink)" stroke-width="4" marker-end="url(#ar)" />
        <line x1="120" y1="210" x2="300" y2="200" stroke="var(--series-2)" stroke-width="4" marker-end="url(#ar2)" />
        <line x1="300" y1="35" x2="300" y2="195" stroke="var(--series-3)" stroke-width="4" stroke-dasharray="8 6" />
        <polyline points="300,181 286,182 286,196" fill="none" stroke="var(--ink)" stroke-width="2.5" />
        <text x="312" y="40" class="lab">y</text>
        <text x="312" y="222" class="lab" fill="var(--series-2)">ŷ = Xβ̂</text>
        <text x="312" y="125" class="lab" fill="var(--series-3)">e = y − ŷ</text>
        <defs>
          <marker id="ar" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0,0L10,5L0,10Z" fill="var(--ink)" /></marker>
          <marker id="ar2" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0,0L10,5L0,10Z" fill="var(--series-2)" /></marker>
        </defs>
      </svg>
    </div>
    <p class="small">All 24 scores form <b>one vector</b> <Tex tex={String.raw`\mathbf y\in\mathbb R^{24}`} />. Every possible prediction lies on the plane <Term id="colspace">Col(X)</Term>. OLS picks the closest point: the <Term id="projection">orthogonal projection</Term>.</p>
  </div>
  <div class="stack">
    <p>"Closest" means the residual meets the plane at a <b>right angle</b>. These are the <Term id="normal-eq">normal equations</Term>:</p>
    <Tex block tex={String.raw`\mathbf X^\top \mathbf e = \mathbf 0`} />
    <div class="card yellow">
      <h3>Live check on the study data</h3>
      {#if orth}
        <table class="coef"><tbody>
          <tr><td>Σ eᵢ (residuals sum to 0)</td><td><code>{orth[0].toExponential(1)}</code></td></tr>
          <tr><td>Σ hoursᵢ · eᵢ (uncorrelated with X)</td><td><code>{orth[1].toExponential(1)}</code></td></tr>
        </tbody></table>
      {:else}<p class="muted">Waiting for Python…</p>{/if}
    </div>
    <p class="small muted">Zero up to round-off. A consequence: total variation splits cleanly into explained + unexplained, which is what <Term id="r2">R²</Term> measures.</p>
  </div>
</div>

<style>
  .diagram svg { width: 100%; height: auto; display: block; }
  .lab { font-family: var(--display); font-size: 22px; font-weight: 700; }
</style>
