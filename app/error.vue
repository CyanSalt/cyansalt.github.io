<script setup lang="ts">
import type { NuxtError } from '#app'
import { computed } from '#imports'

const { error } = defineProps<{
  error: NuxtError,
}>()

const statusText = computed(() => {
  if (error.statusText === error.message) {
    const matches = error.statusText.match(/^(?<prefix>.+):\s+/)
    if (matches) return matches.groups!.prefix
  }
  return error.statusText
})

const normalized = computed<NuxtError & { message: string }>(() => {
  return {
    ...error,
    statusText: statusText.value,
    statusMessage: statusText.value,
  }
})
</script>

<template>
  <NuxtLayout>
    <UError
      :error="normalized"
      icon="i-lucide:ghost"
      :clear="{
        icon: 'i-lucide:arrow-left',
        size: 'xl',
        class: 'rounded-full',
      }"
    />
  </NuxtLayout>
</template>
