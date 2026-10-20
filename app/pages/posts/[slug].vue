<script lang="ts" setup>
import { createError, queryCollection, queryCollectionItemSurroundings, useAsyncData, useHead, useRoute } from '#imports'

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
      </UPageBody>
      <template v-if="post.body.toc?.links.length" #right>
        <UContentToc :links="post.body.toc.links" />
      </template>
    </UPage>
  </UContainer>
</template>
