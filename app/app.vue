<script setup>
import iconInvert from './assets/icon-invert.svg'
import icon from './assets/icon.svg'
import AppFooter from './components/AppFooter.vue'
import AppHeader from './components/AppHeader.vue'
import { useHead, useSeoMeta } from '#imports'

useHead({
  titleTemplate: title => `${title ? `${title} - ` : ''}@CyanSalt`,
  htmlAttrs: {
    lang: 'en',
  },
  link: [
    { rel: 'icon', type: 'image/svg+xml', href: icon },
    { rel: 'icon', type: 'image/svg+xml', href: iconInvert, media: '(prefers-color-scheme: dark)' },
  ],
})

if (import.meta.server) {
  useSeoMeta({
    author: 'Sun Xiaoran',
    ogTitle: '%s',
    ogSiteName: '@CyanSalt',
    ogType: 'website',
  })
}
</script>

<template>
  <UApp>
    <AppHeader />
    <UMain>
      <NuxtPage />
    </UMain>
    <AppFooter />
  </UApp>
</template>
