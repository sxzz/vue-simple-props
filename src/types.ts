import type { FunctionalComponent } from 'vue'

type RemovePrefix<
  K extends string,
  P extends string,
> = K extends `${P}${infer Event}` ? Uncapitalize<Event> : never

export type ExtractProps<T> = Omit<T, `render${string}`>
export type ExtractEvent<T> = {
  [P in keyof T as RemovePrefix<string & P, 'on'>]: T[P]
}
export type ExtractSlots<T> = {
  [P in keyof T as RemovePrefix<string & P, 'render'>]: T[P]
}

export type ComponentType<T extends Record<any, any>> = FunctionalComponent<
  ExtractProps<T>,
  ExtractEvent<T>,
  ExtractSlots<T>
>
