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
      { text: 'Modules', link: '/gene-overview' },
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
          { text: 'Architecture', link: '/architecture' },
          { text: 'Markup Patterns', link: '/markup-patterns' },
          { text: 'Framework Integration', link: '/integration' },
          { text: 'Configuration', link: '/configuration' },
          { text: 'Styling & Theming', link: '/styling-theming' }
        ]
      },
      {
        text: 'Tooltip Modules',
        items: [
          {
            text: 'Gene Tooltips',
            items: [
              { text: 'Overview', link: '/gene-overview' },
              { text: 'Usage', link: '/gene-usage' },
              { text: 'Configuration', link: '/gene-configuration' },
              { text: 'Data Fields', link: '/gene-data-fields' },
              { text: 'API', link: '/gene-api' },
              { text: 'Examples', link: '/gene-examples' }
            ]
          },
          {
            text: 'Chemical Tooltips',
            items: [
              { text: 'Overview', link: '/chemical-overview' },
              { text: 'Usage', link: '/chemical-usage' },
              { text: 'Configuration', link: '/chemical-configuration' },
              { text: 'Data Fields', link: '/chemical-data-fields' },
              { text: 'Source Comparison', link: '/chemical-source-comparison' },
              { text: 'API', link: '/chemical-api' },
              { text: 'Examples', link: '/chemical-examples' }
            ]
          },
          {
            text: 'Variant Tooltips',
            items: [
              { text: 'Roadmap', link: '/variant-roadmap' }
            ]
          }
        ]
      },
      {
        text: 'Demos',
        items: [
          { text: 'Demo Overview', link: '/demo' },
          { text: 'Gene Demo', link: '/demos/gene' },
          { text: 'Chemical Demo', link: '/demos/chemical' },
          { text: 'Mixed Entity Demo', link: '/demos/mixed' }
        ]
      },
      {
        text: 'Reference',
        items: [
          { text: 'Installation', link: '/installation' },
          { text: 'Browser / Bundler Usage', link: '/browser-bundler-usage' },
          { text: 'CSS', link: '/css' },
          { text: 'Core API', link: '/reference/core' },
          { text: 'Adapter API', link: '/reference/adapters' },
          { text: 'Provider Reference', link: '/reference/providers' },
          { text: 'Generated API Reference', link: '/api/modules' },
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
        }
      ]
    }
  }
}
