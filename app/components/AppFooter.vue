<script lang="ts" setup>
function backToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<template>
  <UFooter class="py-4" :ui="{ left: 'mt-6', center: 'mt-6' }">
    <template #left>
      <p class="text-muted text-sm">
        <ULink href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener noreferrer">CC-BY 4.0</ULink> © {{ new Date().getFullYear() }}</p>
    </template>
    <template #right>
      <UButton
        icon="i-lucide:arrow-up"
        variant="link"
        color="neutral"
        @click="backToTop"
      />
    </template>
  </UFooter>
</template>
