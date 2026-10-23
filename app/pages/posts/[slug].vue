<script lang="ts" setup>
import Giscus from '@giscus/vue'
import { computed, createError, fromSQLDatetime, queryCollection, queryCollectionItemSurroundings, useAsyncData, useColorMode, useHead, useRoute } from '#imports'
import darkThemeCSS from '~/assets/giscus-dark.css?raw'
import lightThemeCSS from '~/assets/giscus-light.css?raw'

const lightTheme = `data:text/css;charset=utf-8,${encodeURIComponent(lightThemeCSS)}`
const darkTheme = `data:text/css;charset=utf-8,${encodeURIComponent(darkThemeCSS)}`

const colorMode = useColorMode()

const theme = computed(() => {
  return colorMode.value === 'dark' ? darkTheme : lightTheme
})

const route = useRoute()

const { data: raw } = await useAsyncData(() => route.path, () => {
  return queryCollection('posts').path(route.path).first()
})

if (!raw.value) {
  throw createError({
    status: 404,
    statusText: `Page not found: ${route.path}`,
  })
}

const post = computed(() => {
  if (!raw.value) return null
  return {
    ...raw.value,
    createdAt: fromSQLDatetime(raw.value.createdAt),
  }
})

const { data: surround } = await useAsyncData(() => `surround:${route.path}`, () => {
  return queryCollectionItemSurroundings('posts', route.path).order('createdAt', 'ASC')
})

useHead(() => ({
  title: post.value?.title,
  description: post.value?.description,
}))
</script>

<template>
  <UContainer v-if="post">
    <UPage :ui="{ center: 'lg:col-span-8 lg:only:col-start-2' }">
      <UPageBody>
        <ContentRenderer :value="post" />
        <p class="text-dimmed text-sm">
          创作于
          <NuxtTime
            :datetime="post.createdAt"
            date-style="long"
            time-style="short"
          />
        </p>
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
