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
    <UPage>
      <UPageBody>
        <ContentRenderer v-if="post" :value="post" />
        <UEmpty
          v-else
          icon="i-lucide:ghost"
          title="This post could not be found."
          description="Perhaps you found it before I did."
          variant="naked"
          :actions="[
            { to: '/posts', label: 'Read other posts' },
          ]"
        />
        <UContentSurround :surround="surround" />
      </UPageBody>
      <template v-if="post?.body.toc?.links.length" #right>
        <UContentToc :links="post.body.toc.links" :ui="{ linkText: 'font-medium' }" />
      </template>
    </UPage>
  </UContainer>
</template>
