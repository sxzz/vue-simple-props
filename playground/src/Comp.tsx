import { ref, type AllowedComponentProps, type VNode } from 'vue'
import { defineFunctionalComponent, useClassAndStyle } from 'vue-simple-props'

interface Props extends AllowedComponentProps {
  foo: string
  onClick?: (evt: boolean) => void
  onInput?: (evt: string) => void
  renderDefault?: () => VNode
  renderTitle?: (scope: { count: number }) => VNode
}

export const Comp = defineFunctionalComponent(
  (props: Props) => {
    const styles = useClassAndStyle()
    const count = ref(0)

    return () => {
      // eslint-disable-next-line no-console
      console.log('render update')

      return (
        <div {...styles}>
          <p>foo = {props.foo}</p>
          <button onClick={() => props.onClick?.(true)}>click me</button>{' '}
          <button onClick={() => count.value++}>increment</button>
          <fieldset>
            <legend>slots</legend>
            {props.renderTitle?.({ count: count.value })}
            {props.renderDefault?.()}
          </fieldset>
        </div>
      )
    }
  },
  { emits: ['click', 'input'] },
)
