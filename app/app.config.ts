import { defineAppConfig } from '#imports'

export default defineAppConfig({
  ui: {
    colors: {
      primary: 'brand',
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
            false: 'w-auto max-w-full zoom-50',
          },
        },
      },
    },
  },
})
