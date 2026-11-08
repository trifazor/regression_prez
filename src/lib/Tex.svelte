<script>
  import katex from 'katex';
  let { tex, block = false } = $props();
  let html = $derived(katex.renderToString(tex, { displayMode: block, throwOnError: false }));
</script>

{#if block}<div class="tex-block">{@html html}</div>{:else}<span>{@html html}</span>{/if}

<style>
  .tex-block { margin: .6rem 0; overflow-x: auto; }
</style>
