import { mount } from '@vue/test-utils'
import { expect, test, vi } from 'vitest'
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

test('pass slot via attrs', () => {
  interface Props {
    renderDefault: () => VNode
  }
  const fn = vi.fn()

  const Comp = defineSimpleComponent<Props>({
    setup() {
      useProps<Props>().renderDefault()
      return () => h('div')
    },
  })
  const Parent = defineComponent({
    setup() {
      return () => {
        return h(Comp, {
          renderDefault: fn,
        })
      }
    },
  })
  mount(Parent)

  expect(fn).toHaveBeenCalledTimes(1)
})

test("don't update when emit handler changes", async () => {
  interface Props {
    onClick: () => void
  }
  const handler1 = vi.fn()
  const handler2 = vi.fn()

  const handler = ref(handler1)
  const updated = vi.fn()

  const Comp = defineSimpleComponent<Props>({
    setup() {
      const props = useProps<Props>()
      return () => {
        updated()
        return <button id="target" onClick={props.onClick} />
      }
    },
  })

  const Parent = defineComponent({
    setup() {
      return () => {
        return (
          <>
            <Comp onClick={() => handler.value()} />
            <button id="change" onClick={() => (handler.value = handler2)}>
              change handler
            </button>
          </>
        )
      }
    },
  })
  const app = mount(Parent)

  expect(updated).toHaveBeenCalledTimes(1)
  expect(handler1).toHaveBeenCalledTimes(0)
  expect(handler2).toHaveBeenCalledTimes(0)

  await app.find('#target').trigger('click')
  expect(updated).toHaveBeenCalledTimes(1)
  expect(handler1).toHaveBeenCalledTimes(1)
  expect(handler2).toHaveBeenCalledTimes(0)

  await app.find('#change').trigger('click')
  await app.find('#target').trigger('click')
  expect(updated).toHaveBeenCalledTimes(1)
  expect(handler1).toHaveBeenCalledTimes(1)
  expect(handler2).toHaveBeenCalledTimes(1)
})

test('hyphenated', () => {
  let props: any
  const Comp = defineSimpleComponent({
    setup() {
      props = useProps()
      return () => h('div')
    },
  })

  const Parent = defineComponent({
    setup() {
      return () => (
        <Comp
          max-count={10}
          on-update:modelValue={() => {}}
          render-default={() => {}}
        />
      )
    },
  })
  mount(Parent)

  expect(props).toEqual({
    maxCount: 10,
    'onUpdate:modelValue': expect.anything(),
    renderDefault: expect.anything(),
  })
  expect(props['max-count']).toBe(props.maxCount)
  expect(props.MAX_COUNT).toBeUndefined()
  expect(props.MaxCount).toBeUndefined()

  expect(props['on-update:modelValue']).toBe(props['onUpdate:modelValue'])
  expect(props['render-default']).toBe(props.renderDefault)
})
