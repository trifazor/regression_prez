<script>
  import SlideHead from '../SlideHead.svelte';
  import ToyChart from '../charts/ToyChart.svelte';
  import Term from '../explain/Term.svelte';
  import HazardBadge from './HazardBadge.svelte';
  import { callPy, py } from '../pyodide.svelte.js';
  import { tutoring } from '../toy.js';

  let control = $state(false);
  const ys = tutoring.map((p) => p.y), xs = tutoring.map((p) => p.x), gs = tutoring.map((p) => p.g);
  let pooled = $derived(py.status === 'ready' ? callPy('fit_design', { y: ys, columns: { tutoring: xs } }) : null);
  let ctrl = $derived(py.status === 'ready' ? callPy('fit_design', { y: ys, columns: { tutoring: xs, weak: gs } }) : null);
  let lines = $derived(!pooled ? [] : control
    ? [{ xs: [0, 5], ys: [ctrl.b[0], ctrl.b[0] + ctrl.b[1] * 5], color: 'var(--series-1)' },
       { xs: [5, 10], ys: [ctrl.b[0] + ctrl.b[2] + ctrl.b[1] * 5, ctrl.b[0] + ctrl.b[2] + ctrl.b[1] * 10], color: 'var(--series-2)' }]
    : [{ xs: [0, 10], ys: [pooled.b[0], pooled.b[0] + pooled.b[1] * 10], color: 'var(--ink)' }]);
</script>

<SlideHead section="p3" title="The variable you left out" />
<div class="body cols wide-left">
  <div>
    <div class="chart-card"><ToyChart points={tutoring} {lines} colorGroups={control} xDomain={[0, 10]} yDomain={[35, 95]} xLabel="Tutoring hours" yLabel="Grade" height={330} /></div>
    <div class="legend">
      <label class="check"><input type="checkbox" bind:checked={control} /> control for prior performance</label>
      {#if control}<span><span class="key dot" style="background:var(--series-1);opacity:1"></span> strong students</span><span><span class="key dot" style="background:var(--series-2);opacity:1"></span> struggling students</span>{/if}
    </div>
  </div>
  <div class="stack">
    <HazardBadge n={2} />
    {#if pooled && ctrl}
      <div class="card">
        <table class="coef">
          <thead><tr><th>Model</th><th>β tutoring</th><th>p</th></tr></thead>
          <tbody>
            <tr class:sig={!control}><td>Grade ~ tutoring</td><td><b>{pooled.b[1].toFixed(2)}</b></td><td>{pooled.p[1] < 0.001 ? '<.001' : pooled.p[1].toFixed(3)}</td></tr>
            <tr class:sig={control}><td>… + struggling</td><td><b>+{ctrl.b[1].toFixed(2)}</b></td><td>{ctrl.p[1] < 0.001 ? '<.001' : ctrl.p[1].toFixed(3)}</td></tr>
          </tbody>
        </table>
      </div>
    {/if}
    {#if !control}
      <p class="small">Pooled, tutoring looks <b>harmful</b>: every hour costs about {pooled ? Math.abs(pooled.b[1]).toFixed(1) : '…'} points, and it's highly significant.</p>
    {:else}
      <p class="small">Within each group, tutoring <b>helps</b>. Struggling students simply get more of it. The <Term id="simpson">sign flipped</Term>.</p>
    {/if}
    <div class="callout small"><b>Lesson:</b> an <Term id="ovb">omitted variable</Term> correlated with X biases β̂, and more data does not fix it.</div>
  </div>
</div>
