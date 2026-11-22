<script lang="ts" setup>
import { computed } from '#imports'

const { pathname, params } = defineProps<{
  pathname: string,
  params?: Record<string, string>,
}>()

const lightSearchParams = computed(() => {
  return new URLSearchParams({
    style: 'for-the-badge',
    label: '',
    color: '00B8DB',
    ...params,
  })
})

const darkSearchParams = computed(() => {
  return new URLSearchParams({
    style: 'for-the-badge',
    label: '',
    color: '00D3F3',
    ...params,
  })
})

const lightBadgeURL = computed(() => `https://img.shields.io${pathname}?${lightSearchParams.value}`)
const darkBadgeURL = computed(() => `https://img.shields.io${pathname}?${darkSearchParams.value}`)
</script>

<template>
  <UColorModeImage
    :light="lightBadgeURL"
    :dark="darkBadgeURL"
  />
</template>
