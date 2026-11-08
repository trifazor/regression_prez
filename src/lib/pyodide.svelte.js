// FR-1: one shared Pyodide runtime, booted once at app start and reused by every slide.
import olsSource from './ols.py?raw';

export const PYODIDE_VERSION = '0.27.7';
const INDEX_URL = `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/`;

export const py = $state({ status: 'idle', message: '', bootMs: 0, lastFitMs: 0 });

let fitFn = null;

function loadScript(src) {
  return new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = src;
    s.onload = resolve;
    s.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.head.appendChild(s);
  });
}

let booting = null;
export function bootPyodide(data) {
  booting ??= (async () => {
    const t0 = performance.now();
    try {
      py.status = 'loading';
      py.message = 'Loading WebAssembly CPython…';
      await loadScript(`${INDEX_URL}pyodide.js`);
      const pyodide = await globalThis.loadPyodide({ indexURL: INDEX_URL });
      py.message = 'Loading numpy & scipy…';
      await pyodide.loadPackage(['numpy', 'scipy']);
      py.message = 'Compiling OLS engine…';
      pyodide.runPython(olsSource);
      pyodide.globals.get('load')(JSON.stringify(data));
      fitFn = pyodide.globals.get('fit');
      py.bootMs = performance.now() - t0;
      py.status = 'ready';
      py.message = `Python ready in ${(py.bootMs / 1000).toFixed(1)} s`;
    } catch (err) {
      py.status = 'error';
      py.message = String(err?.message ?? err);
    }
  })();
  return booting;
}

/** Fit both models on the rows where mask[i] is true. Synchronous; returns parsed results. */
export function fit(mask) {
  if (!fitFn) return null;
  const t0 = performance.now();
  const res = JSON.parse(fitFn(JSON.stringify(mask)));
  py.lastFitMs = performance.now() - t0;
  return res;
}
