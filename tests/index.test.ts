/* eslint-disable vue/one-component-per-file */

import { expect, test } from 'vitest'
import { type VNode, defineComponent, h, nextTick, ref } from 'vue'
import { mount } from '@vue/test-utils'
import {
  defineFunctionalComponent,
  defineSimpleComponent,
  useProps,
} from '../src'

interface Props {
  foo: string
  onClick: Function
  renderDefault: () => VNode
}

test('defineSimpleComponent', async () => {
  const foo = ref('bar')
  let props: Props

  const Comp = defineSimpleComponent<Props>({
    inheritAttrs: false,
    setup() {
      props = useProps<Props>()
      expect(Object.keys(props)).toEqual([
        'foo',
        'onClick',
        'renderDefault',
        'renderTitle',
      ])
      return () => h('div')
    },
  })
  const Parent = defineComponent({
    setup() {
      return () => {
        return h(
          Comp,
          { foo: foo.value, onClick: () => {} },
          {
            default: () => h('span', ['hello']),
            title: () => h('span', ['title']),
          },
        )
      }
    },
  })
  mount(Parent)

  expect(props!.foo).toBe('bar')

  foo.value = 'baz'
  await nextTick()
  expect(props!.foo).toBe('baz')
})

test('defineFunctionalComponent', async () => {
  const foo = ref('bar')
  let props: Props

  const Comp = defineFunctionalComponent<Props>(
    (_props) => {
      props = _props
      expect(Object.keys(props)).toEqual([
        'foo',
        'onClick',
        'renderDefault',
        'renderTitle',
      ])
      return () => h('div')
    },
    { inheritAttrs: false },
  )
  const Parent = defineComponent({
    setup() {
      return () => {
        return h(
          Comp,
          { foo: foo.value, onClick: () => {} },
          {
            default: () => h('span', ['hello']),
            title: () => h('span', ['title']),
          },
        )
      }
    },
  })
  mount(Parent)

  expect(props!.foo).toBe('bar')

  foo.value = 'baz'
  await nextTick()
  expect(props!.foo).toBe('baz')
})
