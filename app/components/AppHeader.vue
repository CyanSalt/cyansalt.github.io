<script lang="ts" setup>
import iconInvert from '../assets/icon-invert.svg'
import icon from '../assets/icon.svg'
</script>

<template>
  <UHeader title="" class="border-none">
    <template #title>
      <span class="flex items-center gap-2">
        <UColorModeImage
          :light="icon"
          :dark="iconInvert"
          alt="@CyanSalt"
          class="size-6"
        />
      </span>
    </template>
    <template #body>
      <slot name="body"></slot>
    </template>
    <template #right>
      <UButton
        to="/posts"
        label="Blog"
        variant="link"
        color="neutral"
        class="text-base font-normal"
      />
      <UButton
        label="Projects"
        variant="link"
        color="neutral"
        class="text-base font-normal"
      />
      <USeparator orientation="vertical" class="mx-2 h-4" />
      <UColorModeButton />
    </template>
  </UHeader>
</template>
