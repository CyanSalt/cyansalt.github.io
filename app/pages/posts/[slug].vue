<script lang="ts" setup>
import { queryCollection, queryCollectionItemSurroundings, useAsyncData, useHead, useRoute } from '#imports'

const route = useRoute()

const { data: post } = await useAsyncData(() => route.path, () => {
  return queryCollection('posts').path(route.path).first()
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
  <UContainer>
    <UPage v-if="post">
      <UPageBody>
        <ContentRenderer :value="post" />
        <UContentSurround :surround="surround" />
      </UPageBody>
      <template v-if="post.body.toc?.links.length" #right>
        <UContentToc :links="post.body.toc.links" :ui="{ linkText: 'font-medium' }" />
      </template>
    </UPage>
  </UContainer>
</template>
