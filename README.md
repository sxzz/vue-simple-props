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

### Conventions

- Starts with `on` for event handlers.
- Starts with `render` for slots.
- Others are props.

### Functional Component (Stateful)

```tsx
import { defineFunctionalComponent, useClassAndStyle } from 'vue-simple-props'

interface Props {
  foo: string
  onClick: () => void
  renderDefault?: () => JSX.Element
}

const Comp = defineFunctionalComponent(
  (props: Props) => {
    const styles = useClassAndStyle()
    return () => <div {...styles}>...</div>
  },
  {
    // other options, e.g. name, inheritAttrs, etc.
  },
)
```

```vue
<!-- parent.vue -->
<template>
  <Comp foo="bar" @click="handleClick">slot</Comp>
</template>
```

### Options Component

```tsx
import {
  defineSimpleComponent,
  useClassAndStyle,
  useProps,
} from 'vue-simple-props'

interface Props {
  foo: string
  onClick: () => void
  renderDefault?: () => JSX.Element
}

export const Comp = defineSimpleComponent<Props>({
  setup() {
    const props = useProps<Props>()
    const styles = useClassAndStyle()
    return () => <div {...props}>...</div>
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

[MIT](./LICENSE) License © 2023-PRESENT [三咲智子 Kevin Deng](https://github.com/sxzz)
