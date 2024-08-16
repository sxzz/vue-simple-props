import { camelize, getCurrentInstance, useAttrs, type CSSProperties } from 'vue'

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

export interface ClassAndStyle {
  class?: string
  style?: CSSProperties
}

export function useClassAndStyle(): ClassAndStyle {
  const instance = getCurrentInstance()
  if (!instance) {
    throw new Error('useClassAndStyle must be called inside setup()')
  }

  const attrs = useAttrs()
  const keys = ['class', 'style']

  return new Proxy(attrs, {
    get(target, p, receiver) {
      if (keys.includes(p as string)) {
        return Reflect.get(target, p, receiver)
      }
    },
    ownKeys: () => keys,
    has: (target, p) => keys.includes(p as string),
  })
}
