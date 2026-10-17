// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/ui',
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
})
