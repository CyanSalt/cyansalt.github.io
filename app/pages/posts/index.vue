<script lang="ts" setup>
import { computed, queryCollection, useAsyncData, useSeoMeta } from '#imports'

const title = 'Articles'
const description = 'My Slop without AI :)'

useSeoMeta({
  title,
  description,
})

const { data: posts } = await useAsyncData('posts', () => {
  return queryCollection('posts')
    .select('path', 'title', 'createdAt')
    .all()
}, {
  default: () => [],
})

function formatYear(date: Date) {
  return new Intl.DateTimeFormat(undefined, {
    year: 'numeric',
  }).format(date)
}

const groups = computed(() => {
  return Array.from(
    Map.groupBy(posts.value, post => formatYear(new Date(post.createdAt))),
    ([date, items]) => ({
      date,
      posts: items.toSorted((a, b) => b.createdAt.localeCompare(a.createdAt)),
    }),
  ).sort((a, b) => b.date.localeCompare(a.date))
})
</script>

<template>
  <UPageSection
    :title="title"
    :description="description"
    variant="naked"
  />
  <UContainer class="pb-12 sm:pb-24">
    <UChangelogVersions>
      <UChangelogVersion v-for="group in groups" :key="group.date" :date="group.date">
        <template #body>
          <div class="flex flex-col items-start gap-4">
            <UButton
              v-for="post in group.posts"
              :key="post.path"
              :to="post.path"
              color="neutral"
              variant="link"
              :label="post.title"
              :ui="{
                base: 'flex-wrap gap-2 p-0 text-lg font-normal',
                label: 'whitespace-normal',
              }"
            >
              <template #trailing>
                <NuxtTime
                  :datetime="post.createdAt"
                  year="numeric"
                  month="short"
                  day="numeric"
                  class="text-dimmed"
                />
              </template>
            </UButton>
          </div>
        </template>
      </UChangelogVersion>
    </UChangelogVersions>
  </UContainer>
</template>
