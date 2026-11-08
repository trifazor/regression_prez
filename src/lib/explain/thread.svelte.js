// The explanation thread: a stack of glossary ids. Clicking a term inside entry k
// drops everything after k and appends the new entry, so the thread reads top-to-bottom.
import { glossary } from './glossary.js';

export const thread = $state({ stack: [] });

export function openTerm(id, fromIndex = null) {
  if (!glossary[id]) return console.warn(`Unknown glossary term: ${id}`);
  const base = fromIndex == null ? [] : thread.stack.slice(0, fromIndex + 1);
  const existing = base.indexOf(id);
  thread.stack = existing >= 0 ? base.slice(0, existing + 1) : [...base, id];
}

export function closeThread() {
  thread.stack = [];
}

export function popThread() {
  thread.stack = thread.stack.slice(0, -1);
}
