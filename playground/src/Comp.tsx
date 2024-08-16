import { defineFunctionalComponent, useClassAndStyle } from 'vue-simple-props'
import type { AllowedComponentProps, VNode } from 'vue'

interface Props extends AllowedComponentProps {
  foo: string
  onClick?: (evt: boolean) => void
  onInput?: (evt: string) => void
  renderDefault?: () => VNode
  renderTitle?: (scope: { id: number }) => VNode
}

export const Comp = defineFunctionalComponent((props: Props) => {
  const styles = useClassAndStyle()
  return () => (
    <div {...styles}>
      <p>foo = {props.foo}</p>
      <button onClick={() => props.onClick?.(true)}>click me</button>
      <fieldset>
        <legend>slots</legend>
        {props.renderTitle?.({ id: 0 })}
        {props.renderDefault?.()}
      </fieldset>
    </div>
  )
})
