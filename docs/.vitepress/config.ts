import {defineConfig} from 'vitepress';

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: '/react-router/',
  description:
    'GAIA is a comprehensive template for building React Router 7 applications',
  head: [
    [
      'link',
      {
        href: '/react-router/assets/favicons/apple-touch-icon.png',
        rel: 'apple-touch-icon',
        sizes: '180x180',
      },
    ],
    [
      'link',
      {
        href: '/react-router/assets/favicons/android-chrome-192x192.png',
        rel: 'icon',
        sizes: '192x192',
      },
    ],
    [
      'link',
      {
        href: '/react-router/assets/favicons/android-chrome-512x512.png',
        rel: 'icon',
        sizes: '512x512',
      },
    ],
    [
      'link',
      {
        href: '/react-router/assets/favicons/favicon-16x16.png',
        rel: 'icon',
        sizes: '16x16',
        type: 'image/png',
      },
    ],
    [
      'link',
      {
        href: '/react-router/assets/favicons/favicon-32x32.png',
        rel: 'icon',
        sizes: '32x32',
        type: 'image/png',
      },
    ],
    ['link', {href: '/react-router/assets/favicon/favicon.ico', rel: 'icon'}],
    [
      'link',
      {href: '/react-router/assets/favicon/site.webmanifest', rel: 'manifest'},
    ],
  ],
  lang: 'en-US',
  lastUpdated: true,
  themeConfig: {
    footer: {
      copyright:
        'Copyright ©2026, <a href="https://github.com/stevensacks" target="_blank" rel="noreferrer">Steven Sacks</a>',
      message: 'Released under the MIT License',
    },

    // https://vitepress.dev/reference/default-theme-config
    logo: '/assets/images/gaia-logo.svg',

    nav: [
      {link: '/', text: 'Home'},
      {link: 'https://github.com/sponsors/gaia-react', text: 'Support'},
    ],

    search: {
      provider: 'local',
    },

    sidebar: [
      {
        collapsed: true,
        items: [
          {link: '/general/quick-start', text: 'Quick Start'},
          {link: '/general/about', text: 'About'},
          {link: '/general/features', text: 'Features'},
        ],
        text: 'General',
      },
      {
        collapsed: true,
        items: [
          {link: '/tech-stack/foundation/', text: 'Foundation'},
          {link: '/tech-stack/code-quality/', text: 'Code Quality'},
          {
            items: [
              {link: '/tech-stack/testing/visual', text: 'Visual'},
              {
                link: '/tech-stack/testing/unit-and-integration',
                text: 'Unit and Integration',
              },
              {link: '/tech-stack/testing/e2e', text: 'End to End'},
            ],
            link: '/tech-stack/testing/',
            text: 'Testing',
          },
        ],
        text: 'Tech Stack',
      },
      {
        collapsed: true,
        items: [
          {link: '/architecture/folder-structure', text: 'Folder Structure'},
          {link: '/architecture/assets', text: 'Assets'},
          {link: '/architecture/components', text: 'Components'},
          {link: '/architecture/hooks', text: 'Hooks'},
          {link: '/architecture/languages', text: 'Languages'},
          {link: '/architecture/middleware', text: 'Middleware'},
          {link: '/architecture/pages', text: 'Pages'},
          {link: '/architecture/routes', text: 'Routes'},
          {link: '/architecture/services', text: 'Services'},
          {link: '/architecture/sessions', text: 'Sessions'},
          {link: '/architecture/state', text: 'State'},
          {link: '/architecture/styles', text: 'Styles'},
          {link: '/architecture/utils', text: 'Utils'},
        ],
        text: 'Architecture',
      },
    ],

    socialLinks: [
      {icon: 'github', link: 'https://github.com/gaia-react/react-router'},
    ],
  },
  title: 'Docs',
});
