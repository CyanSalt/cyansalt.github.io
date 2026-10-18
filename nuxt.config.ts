import { posix } from 'node:path'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/ui',
    '@nuxt/content',
  ],
  css: [
    '~/assets/main.css',
  ],
  routeRules: {
    '/': { prerender: true },
  },
  compatibilityDate: '2026-06-30',
  imports: {
    autoImport: false,
  },
  router: {
    options: {
      scrollBehaviorType: 'smooth',
    },
  },
  content: {
    build: {
      markdown: {
        remarkPlugins: {
          'remark-breaks': {},
          'remark-custom-header-id': {},
        },
      },
    },
  },
  hooks: {
    'content:file:afterParse'({ collection, content }) {
      if (collection.name === 'posts' && typeof content.path === 'string') {
        content.path = posix.join('/posts', posix.basename(content.path))
      }
    },
  },
})
