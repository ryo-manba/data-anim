import { defineConfig } from 'vite';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/plugin/inspector.ts'),
      name: 'dataAnimInspector',
      formats: ['iife'],
      fileName: () => 'data-anim-inspector.min.js',
    },
    outDir: 'dist',
    emptyOutDir: false,
    minify: 'esbuild',
    sourcemap: true,
  },
});
