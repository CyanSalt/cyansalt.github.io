<script lang="ts" setup>
import { useSeoMeta } from '#imports'
import NpmCard from '~/components/projects/NpmCard.vue'

const title = 'My Projects'
const description = 'None of them were created with AI unless otherwise specified.'

useSeoMeta({
  title,
  description,
})
</script>

<template>
  <UPageHero
    :title="title"
    :description="description"
    variant="naked"
  >
    <template #links>
      <UButton
        to="https://github.com/CyanSalt"
        target="_blank"
        label="Oh Toodles!"
        icon="i-simple-icons:github"
        color="neutral"
        size="xl"
        class="px-6 py-3 text-xl rounded-full shadow-md"
      />
    </template>
  </UPageHero>
  <UPageSection
    title="Cross-platform Apps"
    description="I like Electron, even though many people don't."
  >
    <template #links>
      <UButton
        to="https://github.com/CyanSalt/homebrew-cask"
        target="_blank"
        label="Install with Homebrew Cask"
        trailing-icon="i-lucide:arrow-right"
        variant="outline"
        size="xl"
      />
    </template>
    <UPageGrid>
      <UPageCard
        to="https://github.com/CyanSalt/commas"
        target="_blank"
        title="Commas"
        description="A hackable, pluggable terminal, and also a command runner"
        spotlight
      >
        <template #leading>
          <img
            src="https://raw.githubusercontent.com/CyanSalt/commas/master/resources/images/icon.png"
            alt="Commas"
            class="size-16"
          >
        </template>
        <template #footer>
          <img
            src="https://img.shields.io/github/v/release/CyanSalt/commas?style=for-the-badge&label=&color=00B8DB"
            alt="Version"
          >
        </template>
      </UPageCard>
      <UPageCard
        to="https://github.com/CyanSalt/lyrically"
        target="_blank"
        title="Lyrically"
        description="Music player inspired by Lyric Speaker"
        spotlight
      >
        <template #leading>
          <img
            src="https://raw.githubusercontent.com/CyanSalt/lyrically/master/resources/images/icon.png"
            alt="Lyrically"
            class="size-16"
          >
        </template>
        <template #footer>
          <img
            src="https://img.shields.io/github/v/release/CyanSalt/lyrically.svg?style=for-the-badge&label=&color=00B8DB"
            alt="Version"
          >
        </template>
      </UPageCard>
      <UPageCard
        to="https://github.com/CyanSalt/re-pwsbh"
        target="_blank"
        title="強風オールバック"
        description="Cross-platform remaster of PowerfulWindSlickedBackHair"
        spotlight
      >
        <template #leading>
          <img
            src="https://raw.githubusercontent.com/CyanSalt/re-pwsbh/main/resources/images/icon.png"
            alt="強風オールバック"
            class="size-16"
          >
        </template>
        <template #footer>
          <img
            src="https://img.shields.io/github/v/release/CyanSalt/re-pwsbh.svg?style=for-the-badge&label=&color=00B8DB"
            alt="Version"
          >
        </template>
      </UPageCard>
    </UPageGrid>
  </UPageSection>
  <UPageSection
    title="Working with AI"
    description="These infrastructure components help you make better use of LLM and Harness."
  >
    <UPageGrid>
      <UPageCard
        to="https://github.com/CyanSalt/dsh-plugins"
        target="_blank"
        icon="i-simple-icons:deepseek"
        title="cyansalt/dsh-plugins"
        description="My DeepSeek Harness (DSH) plugins"
        spotlight
      />
      <NpmCard
        name="decision-pony"
        icon="i-lucide:chess-knight"
        description="OpenAI Decisions API and TypeSafe API (Jev) polyfill with conversational LLM protocols"
      />
      <NpmCard
        name="openai-ollama"
        icon="i-simple-icons:ollama"
        description="Create a local Ollama proxy service for the OpenAI compatible backend"
      />
    </UPageGrid>
  </UPageSection>
  <UPageSection
    title="Vue Ecosystem"
    description="Vue is my preferred front-end framework."
  >
    <UPageGrid>
      <NpmCard
        name="@legacy-vue/compiler-sfc"
        to="https://github.com/CyanSalt/compiler-sfc"
        icon="i-simple-icons:vuedotjs"
        description="A drop-in replacement for @vue/compiler-sfc for Vue legacy versions (2.7.x)"
        :ui="{ leadingIcon: 'text-[#4FC08D]' }"
      />
      <NpmCard
        name="@legacy-vue/vite-plugin-vue2"
        to="https://github.com/CyanSalt/vite-plugin-vue2"
        icon="i-simple-icons:vite"
        description="A drop-in replacement for @vitejs/plugin-vue2 for Vue legacy versions (2.7.x)"
        :ui="{ leadingIcon: 'text-[#9135FF]' }"
      />
      <NpmCard
        name="@legacy-vue/vue-loader"
        to="https://github.com/CyanSalt/vue-loader"
        icon="i-simple-icons:webpack"
        description="A drop-in replacement for vue-loader for Vue legacy versions (2.7.x)"
        :ui="{ leadingIcon: 'text-[#8DD6F9]' }"
      />
      <NpmCard
        name="roughness"
        description="A Vue component library with hand-drawn appearance"
      >
        <template #leading>
          <UColorModeImage
            light="https://raw.githubusercontent.com/CyanSalt/roughness/main/docs/public/r.svg"
            dark="https://raw.githubusercontent.com/CyanSalt/roughness/main/docs/public/r-dark.svg"
            alt="roughness"
            class="size-5"
          />
        </template>
      </NpmCard>
      <NpmCard
        name="vue-demarque"
        icon="i-simple-icons:markdown"
        description="Content renderer for Vue"
      />
      <NpmCard
        name="vue-spinach"
        description="Transform Vue SFC between Option API and Composition API"
      >
        <template #leading>
          <img
            src="https://raw.githubusercontent.com/CyanSalt/vue-spinach/main/docs/spinach.svg"
            alt="vue-spinach"
            class="size-5"
          >
        </template>
      </NpmCard>
      <NpmCard
        name="vue-typescript-schema"
        icon="i-simple-icons:typescript"
        description="Generate JSON schema from Vue SFC with type annotations"
        :ui="{ leadingIcon: 'text-[#3178C6]' }"
      />
    </UPageGrid>
  </UPageSection>
  <UPageSection
    title="Vite Ecosystem"
    description="Sharing best practices for Vite that I’ve gathered from real-world projects."
  >
    <UPageGrid>
      <NpmCard
        name="vite-plugin-auto-preload"
        icon="i-lucide:gauge"
        description="Vite plugin for adding preload resource hints in HTML"
      />
      <NpmCard
        name="vite-plugin-html-sort-tags"
        icon="i-lucide:list-sort-ascending"
        description="Vite plugin for sorting head tags in HTML"
      />
      <NpmCard
        name="vite-plugin-legacy-swc"
        icon="i-simple-icons:swc"
        description="Provides legacy browsers support for the production build with SWC"
        :ui="{ leadingIcon: 'text-[#F8C457]' }"
      />
      <NpmCard
        name="vite-plugin-prefetch-chunk"
        icon="i-lucide:gauge"
        description="Vite plugin for adding prefetch resource hints in HTML"
      />
      <NpmCard
        name="vite-plugin-template-html"
        to="https://github.com/includeios/vite-plugin-template-html"
        icon="i-lucide:code-xml"
        description="Plugin for vite to inject data into html and request proxy"
      />
      <NpmCard
        name="vite-plugin-unused-code"
        icon="i-lucide:square-dashed-bottom-code"
        description="Vite/Rollup plugin to detect unused files and unused exports in used files"
      />
    </UPageGrid>
  </UPageSection>
  <UPageSection
    title="Other Build Tools"
    description="Sometimes you may also have to use other build tools, such as Webpack."
  >
    <UPageGrid>
      <NpmCard
        name="babel-preset-omit-plugins"
        icon="i-simple-icons:babel"
        description="Omit certain plugins from a Babel preset"
        :ui="{ leadingIcon: 'text-[#F9DC3E]' }"
      />
      <NpmCard
        name="module-federation-plugin"
        icon="i-simple-icons:webpack"
        description="Module federation for webpack@4"
        :ui="{ leadingIcon: 'text-[#8DD6F9]' }"
      />
      <NpmCard
        name="parallelize-webpack-unplugin"
        icon="i-simple-icons:webpack"
        description="Use unplugin with thread-loader in webpack"
        :ui="{ leadingIcon: 'text-[#8DD6F9]' }"
      />
      <NpmCard
        name="postcss-transform-decl"
        icon="i-simple-icons:postcss"
        description="Transform any declarations with custom rules"
        :ui="{ leadingIcon: 'text-[#DD3A0A]' }"
      />
      <NpmCard
        name="rolldown-plugin-module-replace"
        icon="i-simple-icons:rolldown"
        description="Replace aliases for bundle dependencies"
        :ui="{ leadingIcon: 'text-[#FF4100]' }"
      />
      <NpmCard
        name="typescript-transform-aliases"
        icon="i-simple-icons:typescript"
        description="Transform aliases in TypeScript files"
        :ui="{ leadingIcon: 'text-[#3178C6]' }"
      />
    </UPageGrid>
  </UPageSection>
  <UPageSection
    title="Linter"
    description="Collections of opinionated rules."
  >
    <UPageGrid>
      <NpmCard
        name="@cyansalt/eslint-config"
        to="https://github.com/CyanSalt/eslint-config"
        icon="i-simple-icons:eslint"
        description="My ESLint configuration preset"
        :ui="{ leadingIcon: 'text-[#4B32C3]' }"
      />
      <NpmCard
        name="@cyansalt/stylelint-config"
        to="https://github.com/CyanSalt/stylelint-config"
        icon="i-simple-icons:stylelint"
        description="My Stylelint configuration preset"
      />
      <NpmCard
        name="@cyansalt/tsconfig"
        to="https://github.com/CyanSalt/tsconfig"
        icon="i-simple-icons:typescript"
        description="My TypeScript configuration"
        :ui="{ leadingIcon: 'text-[#3178C6]' }"
      />
      <NpmCard
        name="eslint-plugin-galaxy"
        icon="i-simple-icons:eslint"
        description="Various ESLint rules in one plugin"
        :ui="{ leadingIcon: 'text-[#4B32C3]' }"
      />
      <NpmCard
        name="stylelint-plugin-aurora"
        icon="i-simple-icons:stylelint"
        description="Various Stylelint rules in one plugin"
      />
      <NpmCard
        name="stylelint-test-rule-vitest"
        icon="i-simple-icons:vitest"
        description="A Stylelint rule tester using Vitest"
        :ui="{ leadingIcon: 'text-[#00FF74]' }"
      />
    </UPageGrid>
  </UPageSection>
  <UPageSection
    title="Editor Themes"
    description="Color scheme is the most important feature of a code editor."
  >
    <UPageGrid>
      <UPageCard
        to="https://github.com/CyanSalt/vscode-theme-porcelain"
        target="_blank"
        icon="i-simple-icons:trae"
        title="vscode-theme-porcelain"
        description="Porcelain theme for VSCode"
        spotlight
        :ui="{ leadingIcon: 'text-[#32F08C]' }"
      >
        <template #footer>
          <img
            src="https://img.shields.io/open-vsx/v/cyansalt/vscode-theme-porcelain?style=for-the-badge&label=&color=00B8DB"
            alt="Version"
          >
        </template>
      </UPageCard>
      <UPageCard
        to="https://github.com/CyanSalt/zed-theme-porcelain"
        target="_blank"
        icon="i-simple-icons:zedindustries"
        title="zed-theme-porcelain"
        description="Porcelain theme for Zed"
        spotlight
        :ui="{ leadingIcon: 'text-[#084CCF]' }"
      />
    </UPageGrid>
  </UPageSection>
  <UPageSection
    title="Others"
    description="I think they're useful. You could give them a try."
  >
    <UPageGrid>
      <NpmCard
        name="corner-smoothie"
        icon="i-lucide:square-round-corner"
        description="Create elements with Figma corner smoothing"
      />
      <NpmCard
        name="croonjs"
        to="https://github.com/CyanSalt/croon"
        icon="i-lucide:clef-treble"
        description="A toolkit for parsing and playing numbered musical notation"
      />
      <NpmCard
        name="font-cloak"
        icon="i-lucide:book-lock"
        description="Encrypt your data with random fonts"
      />
      <NpmCard
        name="git9"
        description="Utilities for Git"
      >
        <template #leading>
          <img
            src="https://raw.githubusercontent.com/CyanSalt/git9/main/docs/icon.svg"
            alt="git9"
            class="size-5"
          >
        </template>
      </NpmCard>
      <NpmCard
        name="parseport"
        icon="i-lucide:variable"
        description="Get static value from a JavaScript or TypeScript file"
      />
      <NpmCard
        name="transchema"
        icon="i-simple-icons:typescript"
        description="Transform JSON Schema definition into inline TypeScript type"
        :ui="{ leadingIcon: 'text-[#3178C6]' }"
      />
      <NpmCard
        name="whistle.try"
        description="Provide fallback functionality for local rules of whistle"
      >
        <template #leading>
          <img
            src="https://user-images.githubusercontent.com/11450939/168828068-99e38862-d5fc-42bc-b5ab-6262b2ca27d6.png"
            alt="whistle.try"
            class="size-5"
          >
        </template>
      </NpmCard>
    </UPageGrid>
  </UPageSection>
</template>
