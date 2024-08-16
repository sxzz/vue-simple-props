# vue-simple-props [![npm](https://img.shields.io/npm/v/vue-simple-props.svg)](https://npmjs.com/package/vue-simple-props)

[![Unit Test](https://github.com/sxzz/vue-simple-props/actions/workflows/unit-test.yml/badge.svg)](https://github.com/sxzz/vue-simple-props/actions/workflows/unit-test.yml)

Remove emits, slots, and attrs concepts in Vue.

## Features

- 🤐 No need to define props, emits, slots, and attrs in runtime.
- 🦾 Fully TypeScript support.
- 👾 Non-invasive.

## Install

```bash
npm i vue-simple-props
```

## Usage

### Functional Component (Stateful)

```tsx
import { defineFunctionalComponent } from 'vue-simple-props'

interface Props {
  foo: string
  onClick: () => void
  renderDefault?: () => JSX.Element
}

const Comp = defineFunctionalComponent(
  (props: Props) => {
    return () => <div>...</div>
  },
  {
    // other options, e.g. name, inheritAttrs, etc.
  },
)
```

### Options Component

```tsx
import { defineSimpleComponent, useProps } from 'vue-simple-props'

interface Props {
  foo: string
  onClick: () => void
  renderDefault?: () => JSX.Element
}

export const Comp = defineSimpleComponent<Props>({
  setup() {
    const props = useProps<Props>()
    return () => <div>...</div>
  },
})
```

### HMR support

```ts
// vite.config.ts
import vueJsx from '@vitejs/plugin-vue-jsx'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    // ...
    vueJsx({
      defineComponentName: [
        'defineComponent',
        'defineFunctionalComponent',
        'defineSimpleComponent',
      ],
    }),
  ],
})
```

## Caveats

- `inheritAttrs` is `false` by default.

## Sponsors

<p align="center">
  <a href="https://cdn.jsdelivr.net/gh/sxzz/sponsors/sponsors.svg">
    <img src='https://cdn.jsdelivr.net/gh/sxzz/sponsors/sponsors.svg'/>
  </a>
</p>

## License

[MIT](./LICENSE) License © 2023 [三咲智子 Kevin Deng](https://github.com/sxzz)
