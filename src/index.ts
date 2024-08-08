import {
  camelize,
  defineComponent,
  getCurrentInstance,
  useAttrs,
  type Component,
  type ComponentOptions,
  type FunctionalComponent,
} from 'vue'
import type { ComponentType } from './types'

export function useProps<T>(): T {
  const instance = getCurrentInstance()
  if (!instance) {
    throw new Error('useProps must be called inside setup()')
  }

  const attrs = useAttrs()

  function getSlotName(p: PropertyKey) {
    if (typeof p === 'string' && p.startsWith('render'))
      return p.slice(6).replace(/^[A-Z]/, (s) => s.toLowerCase())
  }

  return new Proxy(
    {},
    {
      get(target, p, receiver) {
        const slotName = getSlotName(p)
        if (slotName) return Reflect.get(instance.slots, slotName, receiver)
        return Reflect.get(attrs, p, receiver)
      },
      ownKeys() {
        return [
          ...Reflect.ownKeys(attrs),
          ...Reflect.ownKeys(instance.slots).map((k) =>
            typeof k === 'string' ? camelize(`render-${k}`) : k,
          ),
        ]
      },
      has(target, p) {
        const slotName = getSlotName(p)
        if (slotName) return Reflect.has(instance.slots, slotName)
        return Reflect.has(attrs, p)
      },
      getOwnPropertyDescriptor(target, p) {
        const slotName = getSlotName(p)
        if (slotName)
          return Reflect.getOwnPropertyDescriptor(instance.slots, slotName)
        return Reflect.getOwnPropertyDescriptor(attrs, p)
      },
    },
  ) as any
}

/**
 * use `useProps` to get props
 */
export function defineSimpleComponent<T extends Record<any, any>>(
  comp: Component,
  extraOptions?: ComponentOptions,
): ComponentType<T> {
  return defineComponent(comp as any, extraOptions) as any
}

export function defineFunctionalComponent<T extends Record<any, any>>(
  comp: FunctionalComponent<T, any, any>,
  extraOptions?: ComponentOptions,
): ComponentType<T> {
  const fn: FunctionalComponent = (_props, ctx) => {
    const props = useProps()
    return comp(props as any, ctx)
  }
  Object.keys(comp).forEach((key) => {
    // @ts-expect-error
    fn[key] = comp[key]
  })
  return defineComponent(fn, extraOptions) as any
}
