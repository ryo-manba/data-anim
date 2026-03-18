import { defineConfig } from 'vite';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/extension-content.ts'),
      name: 'dataAnimExtension',
      formats: ['iife'],
      fileName: () => 'content.js',
    },
    outDir: 'extension',
    emptyOutDir: false,
    minify: 'esbuild',
    sourcemap: false,
  },
});
