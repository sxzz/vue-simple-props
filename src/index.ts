import {
  type Component,
  type ComponentOptions,
  type FunctionalComponent,
  camelize,
  computed,
  defineComponent,
  getCurrentInstance,
  useAttrs,
} from 'vue'
import { toReactive } from './utils'

export function useProps<T>(): T {
  const instance = getCurrentInstance()
  if (!instance) {
    throw new Error('useProps must be called inside setup()')
  }

  const attrs = useAttrs()
  const { slots } = instance

  return toReactive(
    computed(() => ({
      ...attrs,
      ...Object.fromEntries(
        Object.entries(slots).map(([k, v]) => [camelize(`render-${k}`), v])
      ),
    }))
  ) as any
}

type RemovePrefix<
  K extends string,
  P extends string,
> = K extends `${P}${infer Event}` ? Uncapitalize<Event> : never

export type ExtractProps<T extends Record<any, any>> = Omit<
  T,
  `${'on' | 'render'}${string}`
>
export type ExtractEvent<T extends Record<any, any>> = {
  [P in keyof T as RemovePrefix<string & P, 'on'>]: T[P]
}
export type ExtractSlots<T extends Record<any, any>> = {
  [P in keyof T as RemovePrefix<string & P, 'render'>]: T[P]
}

/**
 * use `useProps` to get props
 */
export function defineSimpleComponent<T extends Record<any, any>>(
  comp: Component,
  extraOptions?: ComponentOptions
): FunctionalComponent<ExtractProps<T>, ExtractEvent<T>, ExtractSlots<T>> {
  return defineComponent(comp as any, extraOptions)
}

export function defineFunctionalComponent<T extends Record<any, any>>(
  comp: FunctionalComponent<any, any, any>,
  extraOptions?: ComponentOptions
): FunctionalComponent<ExtractProps<T>, ExtractEvent<T>, ExtractSlots<T>> {
  const fn: FunctionalComponent = (_props, ctx) => {
    const props = useProps()
    return comp(props, ctx)
  }
  Object.keys(comp).forEach((key) => {
    // @ts-expect-error
    fn[key] = comp[key]
  })
  return defineComponent(fn as any, extraOptions)
}
