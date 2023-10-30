import {
  type Component,
  type FunctionalComponent,
  camelize,
  computed,
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

export function defineSimpleComponent<T extends Record<any, any>>(
  comp: Component
): FunctionalComponent<ExtractProps<T>, ExtractEvent<T>, ExtractSlots<T>> {
  return comp as any
}
