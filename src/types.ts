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
