import { defineFunctionalComponent as defineComponent } from 'vue-simple-props'
import type { VNode } from 'vue'

interface Props {
  foo: string
  onClick?: (evt: boolean) => void
  onInput?: (evt: string) => void
  renderDefault?: () => VNode
  renderTitle?: (scope: { id: number }) => VNode
}

export const Comp = defineComponent((props: Props) => {
  return () => {
    return (
      <div>
        <p>foo = {props.foo}</p>
        <button onClick={() => props.onClick?.(true)}>click me</button>
        <fieldset>
          <legend>slots</legend>
          {props.renderTitle?.({ id: 0 })}
          {props.renderDefault?.()}
        </fieldset>
      </div>
    )
  }
})
