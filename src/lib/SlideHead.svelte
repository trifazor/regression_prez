<script>
  import { sections } from './sections.js';
  let { section, title } = $props();
  let s = $derived(sections[section]);
</script>

<header class="slide-head">
  <span class="kicker" style="background:{s.color}; color:{s.ink}">{s.label}<b style="background:{s.ink}; color:{s.color}">{s.who}</b></span>
  <h2>{title}</h2>
</header>
