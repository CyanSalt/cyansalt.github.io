import { defineAppConfig } from '#imports'

export default defineAppConfig({
  ui: {
    colors: {
      primary: 'cyan',
    },
    prose: {
      a: {
        base: 'wrap-anywhere',
      },
      h2: {
        slots: {
          base: 'mt-6 pt-6 border-t border-default',
          leading: 'top-7',
        },
      },
      img: {
        variants: {
          width: {
            false: 'mx-auto w-auto max-w-[50%]',
          },
        },
      },
      blockquote: {
        base: 'text-muted',
      },
    },
  },
})
