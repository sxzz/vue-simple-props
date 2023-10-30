import { defineSimpleComponent, useProps } from 'vue-simple-props'

interface Props {
  foo: string
  onClick: (evt: boolean) => void
  onInput: (evt: string) => void
  renderDefault?: () => JSX.Element
  renderTitle?: () => JSX.Element
}

export const Comp = defineSimpleComponent<Props>({
  name: 'Comp',
  setup() {
    const props = useProps<Props>()
    return () => (
      <div>
        <p>foo = {props.foo}</p>
        <button onClick={() => props.onClick(true)}>click me</button>
        <fieldset>
          <legend>slots</legend>
          {props.renderTitle?.()}
          {props.renderDefault?.()}
        </fieldset>
      </div>
    )
  },
})
