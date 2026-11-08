<script>
  // Inline clickable concept: <Term id="cef">CEF</Term>
  import { openTerm } from './thread.svelte.js';
  let { id, children } = $props();
</script>

<button type="button" class="term" onclick={(e) => { e.stopPropagation(); openTerm(id); }}>{@render children()}</button>
