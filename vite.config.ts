import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'dataAnim',
      formats: ['es', 'umd', 'iife'],
      fileName: (format) => {
        if (format === 'es') return 'data-anim.esm.js';
        if (format === 'umd') return 'data-anim.js';
        if (format === 'iife') return 'data-anim.min.js';
        return `data-anim.${format}.js`;
      },
    },
    outDir: 'dist',
    emptyOutDir: true,
    minify: 'esbuild',
    sourcemap: true,
  },
  plugins: [
    dts({
      rollupTypes: false,
      entryRoot: 'src',
    }),
  ],
});
