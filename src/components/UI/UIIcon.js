/** @jsx h */
import { h } from 'hyperapp'
import iconSprite from '~/assets/icons/feather-sprite.svg'

const UIIcon = (props) => {
  let { icon } = props

  delete props.icon
  return <svg width='24' height='24' {...props}>
    <use href={`${iconSprite}#${icon}`} />
  </svg>
}

export default UIIcon
