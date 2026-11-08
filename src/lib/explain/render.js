import katex from 'katex';
import { glossary } from './glossary.js';

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const tex = (s, displayMode) => katex.renderToString(s, { displayMode, throwOnError: false });

function inline(text) {
  // Swap TeX out for placeholders so ** and [[ ]] can span formulas without touching their contents.
  const formulas = [];
  const masked = text.replace(/\$([^$]+)\$/g, (_, t) => `\u0000${formulas.push(tex(t, false)) - 1}\u0000`);
  return esc(masked)
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\[\[([\w-]+)(?:\|([^\]]+))?\]\]/g, (_, id, label) =>
      `<button type="button" class="term" data-term="${id}">${label ?? glossary[id]?.title ?? id}</button>`)
    .replace(/\u0000(\d+)\u0000/g, (_, i) => formulas[i]);
}

/** Glossary body → HTML. Terms become <button data-term> handled by event delegation. */
export function renderBody(body) {
  return body.split(/\$\$([\s\S]+?)\$\$/g).map((chunk, i) => {
    if (i % 2) return `<div class="tex-display">${tex(chunk.trim(), true)}</div>`;
    return chunk.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean)
      .map((p) => `<p>${p.split('\n').map(inline).join('<br>')}</p>`).join('');
  }).join('');
}
