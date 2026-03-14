const esbuild = require('esbuild');

const shared = {
  entryPoints: ['src/index.ts'],
  bundle: true,
  target: 'es2020',
};

async function build() {
  // Development build with source maps
  await esbuild.build({
    ...shared,
    outfile: 'dist/data-anim.js',
    format: 'iife',
    globalName: 'DataAnim',
    sourcemap: true,
    minify: false,
  });

  // Production minified build
  await esbuild.build({
    ...shared,
    outfile: 'dist/data-anim.min.js',
    format: 'iife',
    globalName: 'DataAnim',
    sourcemap: false,
    minify: true,
  });

  // ES module build
  await esbuild.build({
    ...shared,
    outfile: 'dist/data-anim.esm.js',
    format: 'esm',
    sourcemap: false,
    minify: true,
  });

  const fs = require('fs');
  const path = require('path');
  const minified = fs.statSync(path.join(__dirname, 'dist/data-anim.min.js'));
  console.log(`Build complete!`);
  console.log(`  data-anim.js     (dev)`);
  console.log(`  data-anim.min.js (${(minified.size / 1024).toFixed(1)}KB minified)`);
  console.log(`  data-anim.esm.js (esm)`);
}

build().catch((e) => {
  console.error(e);
  process.exit(1);
});
