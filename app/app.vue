<script setup>
import avatar from './assets/avatar.png'
import iconInvert from './assets/icon-invert.svg'
import icon from './assets/icon.svg'
import AppFooter from './components/AppFooter.vue'
import AppHeader from './components/AppHeader.vue'
import { useHead, useSeoMeta } from '#app'

useHead({
  htmlAttrs: {
    lang: 'en',
  },
  link: [
    { rel: 'icon', type: 'image/svg+xml', href: icon },
    { rel: 'icon', type: 'image/svg+xml', href: iconInvert, media: '(prefers-color-scheme: dark)' },
  ],
})

const title = '@CyanSalt'
const description = 'A non-independent developer who is passionate about open-source projects'

if (import.meta.server) {
  useSeoMeta({
    title,
    description,
    author: 'Sun Xiaoran',
    ogTitle: title,
    ogType: 'website',
    ogDescription: description,
    ogImage: avatar,
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
