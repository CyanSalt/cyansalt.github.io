import config from '@cyansalt/eslint-config'

export default config({
  vue: true,
  configs: [
    {
      languageOptions: {
        parserOptions: {
          project: [
            './.nuxt/tsconfig.app.json',
            './.nuxt/tsconfig.server.json',
            './.nuxt/tsconfig.shared.json',
            './.nuxt/tsconfig.node.json',
            './tsconfig.misc.json',
          ],
          extraFileExtensions: ['.vue'],
        },
      },
    },
  ],
})
