import {
  defineComponent,
  type Component,
  type ComponentOptions,
  type FunctionalComponent,
} from 'vue'
import { useProps } from './composables'
import type { ComponentType } from './types'

export * from './composables'

/**
 * use `useProps` to get props
 */
export function defineSimpleComponent<T extends Record<any, any>>(
  comp: Component,
  extraOptions?: ComponentOptions,
): ComponentType<T> {
  const c: any = defineComponent(comp as any, {
    inheritAttrs: false,
    ...extraOptions,
  })
  c.inheritAttrs ??= false
  return c
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
  return defineComponent(fn, {
    inheritAttrs: false,
    ...extraOptions,
  }) as any
}
