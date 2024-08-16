import { mount } from '@vue/test-utils'
import { expect, test } from 'vitest'
import { defineComponent, h, nextTick, ref, type VNode } from 'vue'
import {
  defineFunctionalComponent,
  defineSimpleComponent,
  useClassAndStyle,
  useProps,
  type ClassAndStyle,
} from '../src'

interface Props {
  foo: string
  onClick: Function
  renderDefault: () => VNode
  renderTitle: () => VNode
}

test('defineSimpleComponent', async () => {
  const foo = ref('bar')
  let props: Props

  const Comp = defineSimpleComponent<Props>({
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
  const app = mount(Parent)

  expect(props!.foo).toBe('bar')

  foo.value = 'baz'
  await nextTick()
  expect(props!.foo).toBe('baz')

  expect(app.html()).toMatchInlineSnapshot(`"<div></div>"`)
})

test('defineFunctionalComponent', async () => {
  const foo = ref('bar')
  let props: Props

  const Comp = defineFunctionalComponent<Props>((_props) => {
    props = _props
    expect(Object.keys(props)).toEqual([
      'foo',
      'onClick',
      'renderDefault',
      'renderTitle',
    ])
    return () => h('div')
  })
  const Parent = defineComponent({
    setup() {
      return () => {
        return h(
          Comp,
          {
            foo: foo.value,
            onClick: () => {},
          },
          {
            default: () => h('span', ['hello']),
            title: () => h('span', ['title']),
          },
        )
      }
    },
  })
  const app = mount(Parent)

  expect(props!.foo).toBe('bar')

  foo.value = 'baz'
  await nextTick()
  expect(props!.foo).toBe('baz')

  expect(app.html()).toMatchInlineSnapshot(`"<div></div>"`)
})

test('useClassAndStyle', () => {
  let styles: ClassAndStyle | undefined
  const Comp = defineFunctionalComponent(() => {
    styles = useClassAndStyle()

    return () => h('div')
  })
  const Parent = defineComponent({
    setup() {
      return () => {
        return h(Comp, {
          class: ['foo', 'bar'],
          style: [{ color: 'red' }, { color: 'blue' }],
          whatever: 'whatever',
        })
      }
    },
  })
  mount(Parent)

  expect(styles).toBeDefined()
  if (!styles) return

  expect(Object.keys(styles)).toEqual(['class', 'style'])
  expect('class' in styles && 'style' in styles).toBe(true)
  expect('whatever' in styles).toBe(false)

  expect(styles).toEqual({
    class: 'foo bar',
    style: { color: 'blue' },
  })
})
