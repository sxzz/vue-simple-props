/* eslint-disable vue/one-component-per-file */

import { expect, test } from 'vitest'
import { type VNode, defineComponent, h, nextTick, ref } from 'vue'
import { mount } from '@vue/test-utils'
import { useProps } from '../src'

test('basic', async () => {
  const foo = ref('bar')
  let props: {
    foo: string
    onClick: Function
    renderDefault: () => VNode
  }

  const Comp = defineComponent({
    inheritAttrs: false,
    setup() {
      props = useProps()
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
          }
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
