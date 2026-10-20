<script setup>
import iconInvert from './assets/icon-invert.svg'
import icon from './assets/icon.svg'
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
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
