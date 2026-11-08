<script>
  // Generic SVG frame: axes, grid, and a hover tooltip. Content goes in the `children` snippet,
  // which receives the x/y scale functions.
  import { linear, niceTicks, fmt } from './scale.js';

  let {
    xDomain, yDomain, xLabel = '', yLabel = '', width = 640, height = 380,
    xFormat = (v) => fmt(v), yFormat = (v) => fmt(v), tooltip = null, children,
  } = $props();

  const m = { top: 14, right: 18, bottom: 44, left: 66 };
  let x = $derived(linear(xDomain, [m.left, width - m.right]));
  let y = $derived(linear(yDomain, [height - m.bottom, m.top]));
  let xt = $derived(niceTicks(...xDomain, 8));
  let yt = $derived(niceTicks(...yDomain, 6));
  let svg = $state();

  // Pointer event → data coordinates (works through the stage's CSS scale).
  function toData(e) {
    const p = new DOMPoint(e.clientX, e.clientY).matrixTransform(svg.getScreenCTM().inverse());
    const xi = (p.x - m.left) / (width - m.left - m.right);
    const yi = (height - m.bottom - p.y) / (height - m.top - m.bottom);
    return [xDomain[0] + xi * (xDomain[1] - xDomain[0]), yDomain[0] + yi * (yDomain[1] - yDomain[0])];
  }
</script>

<div class="plot">
  <svg bind:this={svg} viewBox="0 0 {width} {height}" role="img" aria-label="{yLabel} versus {xLabel}">
    <g class="grid">
      {#each yt as t}<line x1={m.left} x2={width - m.right} y1={y(t)} y2={y(t)} />{/each}
    </g>
    <g class="axis">
      <line x1={m.left} x2={width - m.right} y1={height - m.bottom} y2={height - m.bottom} />
      {#each xt as t}
        <text x={x(t)} y={height - m.bottom + 18} text-anchor="middle">{xFormat(t)}</text>
      {/each}
      {#each yt as t}
        <text x={m.left - 8} y={y(t) + 4} text-anchor="end">{yFormat(t)}</text>
      {/each}
      <text class="label" x={(m.left + width - m.right) / 2} y={height - 6} text-anchor="middle">{xLabel}</text>
      <text class="label" transform="translate(14 {(m.top + height - m.bottom) / 2}) rotate(-90)" text-anchor="middle">{yLabel}</text>
    </g>
    <defs><clipPath id="clip-{width}-{height}"><rect x={m.left} y={m.top} width={width - m.left - m.right} height={height - m.top - m.bottom} /></clipPath></defs>
    <g clip-path="url(#clip-{width}-{height})">
      {@render children({ x, y, toData })}
    </g>
  </svg>
  {#if tooltip}
    <div class="tip" style="left:{(x(tooltip.x) / width) * 100}%; top:{(y(tooltip.y) / height) * 100}%">
      {#each tooltip.lines as l}<div>{l}</div>{/each}
    </div>
  {/if}
</div>

<style>
  .plot { position: relative; width: 100%; }
  svg { width: 100%; height: auto; display: block; overflow: visible; font-family: var(--body); }
  .grid line { stroke: var(--grid); stroke-width: 1; }
  .axis line { stroke: var(--ink); stroke-width: 2; }
  .axis text { fill: var(--ink); font-size: 12px; font-weight: 500; font-variant-numeric: tabular-nums; }
  .axis .label { font-size: 13px; font-weight: 700; }
  .tip {
    position: absolute; transform: translate(14px, -110%); pointer-events: none; z-index: 5;
    background: var(--yellow); border: 2.5px solid var(--ink); border-radius: 10px; box-shadow: 4px 4px 0 var(--ink);
    padding: 8px 14px; font-size: 20px; font-weight: 500; white-space: nowrap; font-variant-numeric: tabular-nums;
  }
  .tip div:first-child { font-weight: 700; }
</style>
