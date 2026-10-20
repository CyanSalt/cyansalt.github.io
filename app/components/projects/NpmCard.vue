<script lang="ts" setup>
import type { PageCardProps } from '@nuxt/ui'
import { computed } from '#imports'

const { name, to, title, ...card } = defineProps<{
  name: string,
  // Recommended props. Other properties can also be inherited via `attrs`.
  to?: PageCardProps['to'],
  title?: PageCardProps['title'],
  icon?: PageCardProps['icon'],
  description?: PageCardProps['description'],
  ui?: PageCardProps['ui'],
}>()

const defaultGitHubURL = computed(() => `https://github.com/CyanSalt/${name}`)

const npmURL = computed(() => `https://www.npmjs.com/package/${name}`)

const badgeURL = computed(() => `https://img.shields.io/npm/v/${name}?style=for-the-badge&logo=npm&label=&color=00B8DB`)
</script>

<template>
  <UPageCard
    :to="to ?? defaultGitHubURL"
    target="_blank"
    :title="title ?? name"
    spotlight
    v-bind="card"
  >
    <template #leading>
      <slot name="leading"></slot>
    </template>
    <template #footer>
      <a :href="npmURL" target="_blank" rel="noopener noreferrer">
        <img :src="badgeURL" alt="npm">
      </a>
    </template>
  </UPageCard>
</template>
