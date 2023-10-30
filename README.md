# vue-simple-props [![npm](https://img.shields.io/npm/v/vue-simple-props.svg)](https://npmjs.com/package/vue-simple-props)

[![Unit Test](https://github.com/sxzz/vue-simple-props/actions/workflows/unit-test.yml/badge.svg)](https://github.com/sxzz/vue-simple-props/actions/workflows/unit-test.yml)

Remove props, emits, slots, and attrs concepts in Vue.

## Install

```bash
npm i vue-simple-props
```

## Usage

```tsx
import { defineSimpleComponent, useProps } from 'vue-simple-props'

interface Props {
  foo: string
  onClick: () => void
  renderDefault?: () => JSX.Element
}

export const Comp = defineSimpleComponent<Props>({
  name: 'Comp',
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
