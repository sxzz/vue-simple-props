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

> **Note**
> For HMR to work properly, you need to rename helper function to `defineComponent`. See https://github.com/vitejs/vite-plugin-vue/tree/main/packages/plugin-vue-jsx#hmr-detection

### Functional Component (Stateful)

```tsx
import { defineFunctionalComponent as defineComponent } from 'vue-simple-props'

interface Props {
  foo: string
  onClick: () => void
  renderDefault?: () => JSX.Element
}

const Comp = defineComponent<Props>(
  (props) => {
    return () => <div>...</div>
  },
  { inheritAttrs: false }
)
```

### Options Component

```tsx
import {
  defineSimpleComponent as defineComponent,
  useProps,
} from 'vue-simple-props'

interface Props {
  foo: string
  onClick: () => void
  renderDefault?: () => JSX.Element
}

export const Comp = defineComponent<Props>({
  inheritAttrs: false,
  setup() {
    const props = useProps<Props>()
    return () => <div>...</div>
  },
})
```

## Sponsors

<p align="center">
  <a href="https://cdn.jsdelivr.net/gh/sxzz/sponsors/sponsors.svg">
    <img src='https://cdn.jsdelivr.net/gh/sxzz/sponsors/sponsors.svg'/>
  </a>
</p>

## License

[MIT](./LICENSE) License © 2023 [三咲智子](https://github.com/sxzz)
