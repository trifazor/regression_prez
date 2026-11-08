import { mount } from 'svelte';
import 'katex/dist/katex.min.css';
import '@fontsource-variable/dm-sans';
import '@fontsource-variable/space-grotesk';
import './app.css';
import App from './App.svelte';

mount(App, { target: document.getElementById('app') });

// NFR-4: cache app shell + Pyodide/WASM assets for offline use after the first visit.
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  navigator.serviceWorker.register('./sw.js');
}
