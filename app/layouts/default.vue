<script lang="ts" setup>
import AppFooter from '~/components/AppFooter.vue'
import AppHeader from '~/components/AppHeader.vue'
</script>

<template>
  <NuxtLoadingIndicator :color="false" class="!bg-primary" />
  <UApp>
    <AppHeader />
    <UMain>
      <slot></slot>
    </UMain>
    <AppFooter />
  </UApp>
</template>
