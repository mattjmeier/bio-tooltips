import esbuild from 'esbuild';
import path from 'node:path';

// Determine if we're in "watch" mode
const isWatching = process.argv.includes('--watch');

// Shared configuration for all builds
const sharedConfig = {
  bundle: true,
  minify: !isWatching,
  sourcemap: isWatching,
  external: ['d3', 'ideogram', '@rdkit/rdkit'],
  loader: {
    '.svg': 'text',
    '.png': 'dataurl',
  },
  logLevel: 'info',
};

const normalizeEntryPoint = (entryPoint) => path.resolve(entryPoint);

const createConfig = (entryPoint, outfile, format, platform) => ({
  ...sharedConfig,
  entryPoints: [normalizeEntryPoint(entryPoint)],
  platform,
  format,
  outfile,
});

// --- Build Tasks ---
const buildJS = () => Promise.all([
  esbuild.build(createConfig('src/index.ts', 'dist/bio-tooltips.cjs', 'cjs', 'node')),
  esbuild.build(createConfig('src/index.ts', 'dist/bio-tooltips.esm.js', 'esm', 'browser')),
  esbuild.build(createConfig('src/mygene.ts', 'dist/bio-tooltips.mygene.cjs', 'cjs', 'node')),
  esbuild.build(createConfig('src/mygene.ts', 'dist/bio-tooltips.mygene.esm.js', 'esm', 'browser')),
  esbuild.build(createConfig('src/mychem.ts', 'dist/bio-tooltips.mychem.cjs', 'cjs', 'node')),
  esbuild.build(createConfig('src/mychem.ts', 'dist/bio-tooltips.mychem.esm.js', 'esm', 'browser')),
  esbuild.build(createConfig('src/mychem-rdkit.ts', 'dist/bio-tooltips.mychem-rdkit.cjs', 'cjs', 'node')),
  esbuild.build(createConfig('src/mychem-rdkit.ts', 'dist/bio-tooltips.mychem-rdkit.esm.js', 'esm', 'browser')),
  // UMD/IIFE
  esbuild.build({
    ...sharedConfig,
    entryPoints: [path.resolve('src/index.ts')],
    platform: 'browser',
    format: 'iife',
    globalName: 'BioTooltips',
    outfile: 'dist/bio-tooltips.global.js',
  }),
]);

const buildCSS = () => esbuild.build({
    entryPoints: [path.resolve('src/css/main.css')],
    bundle: true,
    minify: !isWatching,
    outfile: 'dist/bio-tooltips.css',
});

// --- Main Execution ---
if (isWatching) {
    // This part is more complex without a plugin, so for now let's focus on build.
    // We can add watch back later if needed.
    console.log('Watch mode needs to be reconfigured. Running a single build instead.');
    Promise.all([buildJS(), buildCSS()]).catch(() => process.exit(1));

} else {
  // Run all production builds
  Promise.all([buildJS(), buildCSS()])
    .then(() => console.log('JS and CSS builds successful!'))
    .catch(() => process.exit(1));
}
