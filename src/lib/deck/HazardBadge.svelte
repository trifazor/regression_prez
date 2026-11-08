<script>
  import { hazards } from './hazards.js';
  let { n, status = null } = $props(); // status: 'ok' | 'warn' | 'bad' | null
  let h = $derived(hazards[n - 1]);
  const marks = { ok: '✓', warn: '!', bad: '✕' };
</script>

<span class="hb {status ?? ''}"><span class="i">{h.icon}</span> Hazard {n} · {h.name}{#if status}<b>{marks[status]}</b>{/if}</span>

<style>
  .hb { display: inline-flex; align-items: center; gap: 8px; background: var(--yellow); border: 2.5px solid var(--ink); border-radius: 999px; padding: 4px 16px; font-size: 20px; font-weight: 700; box-shadow: 3px 3px 0 var(--ink); white-space: nowrap; }
  .i { font-size: 24px; }
  b { display: grid; place-items: center; width: 28px; height: 28px; border-radius: 50%; border: 2px solid var(--ink); background: #fff; font-size: 16px; }
  .ok b { background: var(--teal); color: #fff; }
  .warn b { background: var(--orange); }
  .bad b { background: var(--ink); color: var(--paper); }
</style>
