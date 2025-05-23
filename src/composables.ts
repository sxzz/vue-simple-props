import {
  camelize,
  getCurrentInstance,
  useAttrs,
  useSlots,
  type CSSProperties,
} from 'vue'

function camelizePropKey(p: string | symbol): string | symbol {
  return typeof p === 'string' ? camelize(p) : p
}

export function useProps<T>(): T {
  const instance = getCurrentInstance()
  if (!instance) {
    throw new Error('useProps must be called inside setup()')
  }

  const slots = useSlots()
  const getProps = () => {
    return Object.fromEntries(
      Object.entries(instance.vnode.props || {}).map(([k, v]) => [
        camelize(k),
        v,
      ]),
    )
  }

  const proxy = new Proxy(
    {},
    {
      get(target, p, receiver) {
        const slotName = getSlotName(p)
        if (slotName) {
          const slot = Reflect.get(slots, slotName, receiver)
          if (slot) return slot
        }
        const key = camelizePropKey(p)

        // track reactivity
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        instance.proxy?.$attrs

        return Reflect.get(getProps(), key, receiver)
      },
      ownKeys() {
        return [
          ...new Set([
            ...Reflect.ownKeys(getProps()),
            ...Reflect.ownKeys(slots).map((k) =>
              typeof k === 'string' ? camelize(`render-${k}`) : k,
            ),
          ]),
        ]
      },
      has(target, p) {
        const slotName = getSlotName(p)
        if (slotName) {
          return Reflect.has(slots, slotName)
        }
        return Reflect.has(getProps(), camelizePropKey(p))
      },
      getOwnPropertyDescriptor(target, p) {
        const slotName = getSlotName(p)
        if (slotName) {
          const descriptor = Reflect.getOwnPropertyDescriptor(slots, slotName)
          if (descriptor) return descriptor
        }
        return Reflect.getOwnPropertyDescriptor(getProps(), camelizePropKey(p))
      },
    },
  ) as any

  return proxy
}

function getSlotName(p: PropertyKey) {
  if (typeof p === 'string' && p.startsWith('render'))
    return p.slice(6).replace(/^[A-Z]/, (s) => s.toLowerCase())
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
