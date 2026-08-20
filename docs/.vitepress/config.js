import { fileURLToPath, URL } from 'node:url';
import { readFileSync } from 'node:fs';

const { version } = JSON.parse(
  readFileSync(fileURLToPath(new URL('../../package.json', import.meta.url)), 'utf8')
);

export default {
  title: 'Bio Tooltips',
  description: 'Framework-agnostic biological & biochemical tooltips.',
  base: '/bio-tooltips/',
  head: [
    [
      'link',
      { rel: 'icon', type: 'image/png', href: '/bio-tooltips/favicon.png' }
    ],
    [
      'script',
      { src: 'https://cdn.jsdelivr.net/npm/d3@7.9.0/dist/d3.min.js' }
    ],
    [
      'script',
      { src: 'https://cdn.jsdelivr.net/npm/ideogram@1.53.0/dist/js/ideogram.min.js' }
    ],
    [
      'link',
      { rel: 'stylesheet', href: 'https://cdn.jsdelivr.net/npm/ideogram@1.53/dist/css/ideogram.min.css' }
    ]
  ],
  themeConfig: {
    nav: [
      { text: 'Start Here', link: '/guide' },
      { text: 'Modules', link: '/gene-usage' },
      { text: 'Demos', link: '/demo' },
      { text: 'API', link: '/api' },
      // TODO(next breaking major): replace this release link with a versioned-docs
      // selector and preserve supported docs under /versions/<major>.<minor>/.
      {
        text: `v${version}`,
        link: `https://www.npmjs.com/package/bio-tooltips/v/${version}`
      },
      { text: 'GitHub', link: 'https://github.com/mattjmeier/bio-tooltips' }
    ],
    sidebar: [
      {
        text: 'Introduction',
        items: [
          { text: 'Quick Start', link: '/guide' },
          { text: 'Core Concepts', link: '/core-concepts' },
          { text: 'Framework Integration', link: '/integration' },
          { text: 'Styling & Theming', link: '/styling-theming' }
        ]
      },
      {
        text: 'Tooltip Modules',
        items: [
          {
            text: 'Gene Tooltips',
            link: '/gene-usage',
            items: [
              { text: 'Usage', link: '/gene-usage' },
              { text: 'Configuration & Examples', link: '/gene-configuration' },
              { text: 'Data Fields', link: '/gene-data-fields' },
              { text: 'API', link: '/gene-api' }
            ]
          },
          {
            text: 'Chemical Tooltips',
            link: '/chemical-usage',
            items: [
              { text: 'Usage', link: '/chemical-usage' },
              { text: 'Configuration & Examples', link: '/chemical-configuration' },
              { text: 'Data & Sources', link: '/chemical-data-fields' },
              { text: 'API', link: '/chemical-api' }
            ]
          }
        ]
      },
      {
        text: 'Demos',
        items: [
          { text: 'Overview', link: '/demo' },
          { text: 'Gene', link: '/demos/gene' },
          { text: 'Chemical', link: '/demos/chemical' },
          { text: 'Mixed Entities', link: '/demos/mixed' }
        ]
      },
      {
        text: 'Reference',
        items: [
          { text: 'Installation & Imports', link: '/installation' },
          { text: 'Core API', link: '/reference/core' },
          { text: 'Module & Adapter Reference', link: '/reference/adapters' },
          { text: 'Generated API Reference', link: '/api/modules' },
          { text: 'Migrating to v2', link: '/migrating-to-v2' }
        ]
      },
      {
        text: 'Internals',
        items: [
          { text: 'Architecture', link: '/architecture' },
          { text: 'Performance Benchmarking', link: '/performance' },
          { text: 'Adding a New Tooltip Module', link: '/add-modules' }
        ]
      }
    ]
  },
  vite: {
    optimizeDeps: {
      esbuildOptions: {
        target: 'esnext'
      }
    },
    build: {
      target: 'esnext'
    },
    resolve: {
      alias: [
        {
          find: /^bio-tooltips$/,
          replacement: fileURLToPath(new URL('../../src/index.ts', import.meta.url))
        },
        {
          find: /^bio-tooltips\/mygene$/,
          replacement: fileURLToPath(new URL('../../src/mygene.ts', import.meta.url))
        },
        {
          find: /^bio-tooltips\/mychem$/,
          replacement: fileURLToPath(new URL('../../src/mychem.ts', import.meta.url))
        },
        {
          find: /^bio-tooltips\/mychem\/rdkit$/,
          replacement: fileURLToPath(new URL('../../src/mychem-rdkit.ts', import.meta.url))
        },
        {
          find: /^bio-tooltips\/style\.css$/,
          replacement: fileURLToPath(new URL('../../src/css/main.css', import.meta.url))
        },
        {
          find: /^ideogram$/,
          replacement: fileURLToPath(new URL('./ideogram-shim.js', import.meta.url))
        },
        // TypeDoc (typedoc-plugin-markdown) rewrites the README preview images to
        // `_media/<file>` without a leading `./`. Vite then treats that as a bare
        // module import and fails to resolve it. Map it back to the real directory
        // that TypeDoc copies the images into so the docs build can emit them.
        {
          find: /^_media\/(.+)$/,
          replacement: fileURLToPath(new URL('../api/_media', import.meta.url)) + '/$1'
        }
      ]
    }
  }
}
