import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

// Relative base so the build works on GitHub/GitLab Pages sub-paths.
export default defineConfig({ base: './', plugins: [svelte()] });
