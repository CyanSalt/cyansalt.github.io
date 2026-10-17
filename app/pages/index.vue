<template>
  <UPageHero
    title="Sun Xiaoran"
    description="A non-independent developer who is passionate about open-source projects"
    :ui="{
      description: 'text-xl sm:text-2xl/8',
    }"
  >
    <template #headline>
      <img
        src="../assets/avatar.png"
        alt="CyanSalt"
        class="mx-auto size-36 rounded-full hover:scale-103 transition-transform duration-300 ease-in-out"
      >
    </template>
    <template #links>
      <UButton
        to="/posts"
        label="Browse"
        trailing-icon="i-lucide:arrow-right"
        size="xl"
        class="px-6 py-3 text-xl rounded-full shadow-md"
      />
      <UButton
        to="https://github.com/CyanSalt"
        target="_blank"
        icon="i-simple-icons:github"
        color="neutral"
        size="xl"
        class="px-6 py-3 text-xl rounded-full shadow-md"
      />
    </template>
  </UPageHero>
</template>
