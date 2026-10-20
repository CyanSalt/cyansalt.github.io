<script lang="ts" setup>
import AppFooter from '~/components/AppFooter.vue'
import AppHeader from '~/components/AppHeader.vue'
</script>

<template>
  <UApp>
    <AppHeader />
    <UMain>
      <slot></slot>
    </UMain>
    <AppFooter />
  </UApp>
</template>
