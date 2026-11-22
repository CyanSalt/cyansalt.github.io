<script lang="ts" setup>
import ShieldsBadge from './ShieldsBadge.vue'
import { computed } from '#imports'

const { level } = defineProps<{
  /** {@link https://github.com/DimwitLabs/AI-DECLARATION.md} */
  level: 'none' | 'hint' | 'assist' | 'pair' | 'copilot' | 'auto',
}>()

const color = computed(() => {
  switch (level) {
    case 'hint':
      return 'ecfccb'
    case 'assist':
      return 'fef9c3'
    case 'pair':
      return 'ffedd5'
    case 'copilot':
      return 'fee2e2'
    case 'auto':
      return 'ede9fe'
    case 'none':
    default:
      return 'dcfce7'
  }
})
</script>

<template>
  <ShieldsBadge
    :pathname="`/badge/AI-${level}-${color}`"
    :params="{ label: 'AI', labelColor: color, color }"
  />
</template>
