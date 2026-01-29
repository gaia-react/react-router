import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: '/docs/',
  srcDir: './src',
  lang: 'en-US',
  title: 'Docs',
  description: 'GAIA is a comprehensive template for building React Router 7 applications',
  lastUpdated: true,
  head: [
    ['link', { rel: "apple-touch-icon", sizes: "180x180", href: "/docs/assets/favicons/apple-touch-icon.png" }],
    ['link', { rel: "icon", sizes: "192x192", href: "/docs/assets/favicons/android-chrome-192x192.png" }],
    ['link', { rel: "icon", sizes: "512x512", href: "/docs/assets/favicons/android-chrome-512x512.png" }],
    ['link', { rel: "icon", type: "image/png", sizes: "16x16", href: "/docs/assets/favicons/favicon-16x16.png" }],
    ['link', { rel: "icon", type: "image/png", sizes: "32x32", href: "/docs/assets/favicons/favicon-32x32.png" }],
    ['link', { rel: "icon", href: "/docs/assets/favicon/favicon.ico" }],
    ['link', { rel: "manifest", href: "/docs/assets/favicon/site.webmanifest" }],
  ],
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: '/assets/images/gaia-logo.svg',

    nav: [
      { text: 'Home', link: '/' },
      { text: 'Support', link: 'https://github.com/sponsors/gaia-react' }
    ],

    search: {
      provider: 'local'
    },

    sidebar: [
      {
        text: 'General',
        collapsed: true,
        items: [
          { text: 'Quick Start', link: '/general/quick-start' },
          { text: 'About', link: '/general/about' },
          { text: 'Features', link: '/general/features' },
        ]
      },
      {
        text: 'Tech Stack',
        collapsed: true,
        items: [
          { text: 'Foundation', link: '/tech-stack/foundation/' },
          { text: 'Code Quality', link: '/tech-stack/code-quality/' },
          { text: 'Testing', link: '/tech-stack/testing/', items: [
              { text: 'Visual', link: '/tech-stack/testing/visual' },
              { text: 'Unit and Integration', link: '/tech-stack/testing/unit-and-integration' },
              { text: 'End to End', link: '/tech-stack/testing/e2e' },
            ]
          }
        ]
      },
      {
        text: 'Architecture',
        collapsed: true,
        items: [
          {text: 'Folder Structure', link: '/architecture/folder-structure'},
          {text: 'Assets', link: '/architecture/assets'},
          {text: 'Components', link: '/architecture/components'},
          {text: 'Hooks', link: '/architecture/hooks'},
          {text: 'Languages', link: '/architecture/languages'},
          {text: 'Middleware', link: '/architecture/middleware'},
          {text: 'Pages', link: '/architecture/pages'},
          {text: 'Routes', link: '/architecture/routes'},
          {text: 'Services', link: '/architecture/services'},
          {text: 'Sessions', link: '/architecture/sessions'},
          {text: 'State', link: '/architecture/state'},
          {text: 'Styles', link: '/architecture/styles'},
          {text: 'Utils', link: '/architecture/utils'},
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/gaia-react/react-router' }
    ],

    footer: {
      message: 'Released under the MIT License',
      copyright: 'Copyright © 2024-present, <a href="https://github.com/stevensacks" target="_blank" rel="noreferrer">Steven Sacks</a>'
    }
  }
})

