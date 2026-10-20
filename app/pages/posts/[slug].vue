<script lang="ts" setup>
import Giscus from '@giscus/vue'
import { computed, createError, queryCollection, queryCollectionItemSurroundings, useAsyncData, useColorMode, useHead, useRoute } from '#imports'
import darkThemeCSS from '~/assets/giscus-dark.css?raw'
import lightThemeCSS from '~/assets/giscus-light.css?raw'

const lightTheme = `data:text/css;charset=utf-8,${encodeURIComponent(lightThemeCSS)}`
const darkTheme = `data:text/css;charset=utf-8,${encodeURIComponent(darkThemeCSS)}`

const colorMode = useColorMode()

const theme = computed(() => {
  return colorMode.value === 'dark' ? darkTheme : lightTheme
})

const route = useRoute()

const { data: post } = await useAsyncData(() => route.path, () => {
  return queryCollection('posts').path(route.path).first()
})

const { data: surround } = await useAsyncData(() => `surround:${route.path}`, () => {
  return queryCollectionItemSurroundings('posts', route.path).order('createdAt', 'ASC')
})

if (!post.value) {
  throw createError({
    status: 404,
    statusText: `Page not found: ${route.path}`,
  })
}

useHead(() => ({
  title: post.value?.title,
  description: post.value?.description,
}))
</script>

<template>
  <UContainer v-if="post">
    <UPage>
      <UPageBody>
        <ContentRenderer :value="post" />
        <UContentSurround :surround="surround" />
        <Giscus
          repo="CyanSalt/cyansalt.github.io"
          repo-id="MDEwOlJlcG9zaXRvcnk3MDU0ODA1NA=="
          category="Comments"
          category-id="DIC_kwDOBDR6Vs4DJJRP"
          mapping="og:title"
          reactions-enabled="1"
          input-position="top"
          loading="lazy"
          :theme="theme"
          lang="zh-Hans"
        />
      </UPageBody>
      <template v-if="post.body.toc?.links.length" #right>
        <UContentToc :links="post.body.toc.links" />
      </template>
    </UPage>
  </UContainer>
</template>
