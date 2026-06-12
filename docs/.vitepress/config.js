export default {
  title: 'Gene Tooltips JS',
  description: 'A lightweight library for creating gene information tooltips.',
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
      { text: 'Demo', link: '/demo' },
      { text: 'GitHub', link: 'https://github.com/mattjmeier/gene-tooltips' }
    ],
    sidebar: [
      {
        text: 'Documentation',
        items: [
          { text: 'Getting started', link: '/guide' },
          { text: 'Architecture', link: '/architecture.md'},
          { text: 'Advanced configuration', link: '/configuration.md'},
          { text: 'Integration with various frameworks', link: '/integration.md'},
          { text: 'Adding new sections to tooltips', link: '/add-modules.md'} 
        ]
      },
      {
        text: 'Live Example',
        items: [
            { text: 'Demo Page', link: '/demo' },
        ]
      },
      {
        text: "API Reference",
        items: [
          { text: "Description of props", link: '/api.md'},
          { text: "Full API", link: '/api/modules'}
        ]
      }
    ]
  },
  // build: {
  //   rollupOptions: {
  //     external: ['d3', 'ideogram'],
  //     output: {
  //       globals: {
  //         d3: 'd3',
  //         Ideogram: 'Ideogram'
  //       }
  //     }
  //   }
  // }
}
