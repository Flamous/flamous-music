/** @jsx h */
import { h } from 'hyperapp'
import iconSprite from '~/assets/icons/feather-sprite.svg'
import cc from 'classcat'

const Use = (props, children) => {
  const href = props.href
  const XLINK_NS = 'http://www.w3.org/1999/xlink'

  const setLink = (element, oldProps) => {
    if (href) {
      element.setAttributeNS(XLINK_NS, 'href', href)
    } else if (!oldProps || href !== oldProps.href) {
      element.removeAttributeNS(XLINK_NS, 'href')
    }
  }

  return (
    <use {...props} oncreate={setLink}>
      {children}
    </use>
  )
}

const UIIcon = (props) => {
  let { icon } = props

  delete props.icon
  return <svg width='24' height='24' {...props} class={cc(['icon', props.class])}>
    <Use href={`${iconSprite}#${icon}`} />
  </svg>
}

export default UIIcon
