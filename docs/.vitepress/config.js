import { fileURLToPath, URL } from 'node:url';

export default {
  title: 'Gene Tooltips JS',
  description: 'A lightweight library for creating gene and chemical information tooltips.',
  base: '/gene-tooltips/',
  head: [
    [
      'link',
      { rel: 'icon', type: 'image/png', href: '/gene-tooltips/favicon.png' }
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
      { text: 'Guide', link: '/guide' },
      { text: 'Demos', link: '/demo' },
      { text: 'API', link: '/api' },
      { text: 'GitHub', link: 'https://github.com/mattjmeier/gene-tooltips' }
    ],
    sidebar: [
      {
        text: 'Start Here',
        items: [
          { text: 'Getting Started', link: '/guide' },
          { text: 'Core Concepts', link: '/core-concepts' },
          { text: 'Framework Integration', link: '/integration' }
        ]
      },
      {
        text: 'Live Demos',
        items: [
          { text: 'Demo Overview', link: '/demo' },
          { text: 'Gene Demo', link: '/demos/gene' },
          { text: 'Chemical Demo', link: '/demos/chemical' }
        ]
      },
      {
        text: 'Gene Tooltips',
        items: [
          { text: 'Gene Usage', link: '/gene-usage' },
          { text: 'Gene Configuration', link: '/gene-configuration' },
          { text: 'Gene API', link: '/gene-api' }
        ]
      },
      {
        text: 'Chemical Tooltips',
        items: [
          { text: 'Chemical Usage', link: '/chemical-usage' },
          { text: 'Chemical Configuration', link: '/chemical-configuration' },
          { text: 'Chemical API', link: '/chemical-api' }
        ]
      },
      {
        text: 'Reference',
        items: [
          { text: 'Curated API Overview', link: '/api' },
          { text: 'Core Reference', link: '/reference/core' },
          { text: 'Provider Reference', link: '/reference/providers' },
          { text: 'Full Generated Reference', link: '/api/modules' },
          { text: 'Adding New Sections', link: '/add-modules' }
        ]
      }
    ]
  },
  vite: {
    resolve: {
      alias: [
        {
          find: /^gene-tooltips$/,
          replacement: fileURLToPath(new URL('../../src/index.ts', import.meta.url))
        },
        {
          find: /^gene-tooltips\/mygene$/,
          replacement: fileURLToPath(new URL('../../src/mygene.ts', import.meta.url))
        },
        {
          find: /^gene-tooltips\/mychem$/,
          replacement: fileURLToPath(new URL('../../src/mychem.ts', import.meta.url))
        },
        {
          find: /^gene-tooltips\/mychem\/rdkit$/,
          replacement: fileURLToPath(new URL('../../src/mychem-rdkit.ts', import.meta.url))
        },
        {
          find: /^gene-tooltips\/style\.css$/,
          replacement: fileURLToPath(new URL('../../src/css/main.css', import.meta.url))
        }
      ]
    }
  }
}
