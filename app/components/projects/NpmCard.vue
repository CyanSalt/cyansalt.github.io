<script lang="ts" setup>
import type { PageCardProps } from '@nuxt/ui'
import ShieldsBadge from './ShieldsBadge.vue'
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
</script>

<template>
  <UPageCard
    :to="to ?? defaultGitHubURL"
    target="_blank"
    :title="title ?? name"
    spotlight
    v-bind="card"
    :ui="{ ...card.ui, footer: 'flex items-center gap-3' }"
  >
    <template #leading>
      <slot name="leading"></slot>
    </template>
    <template #footer>
      <a :href="npmURL" target="_blank" rel="noopener noreferrer">
        <ShieldsBadge
          :pathname="`/npm/v/${name}`"
          :params="{ logo: 'npm' }"
          alt="npm"
        />
      </a>
      <slot name="footer"></slot>
    </template>
  </UPageCard>
</template>
