/** @jsx h */
import { h } from 'hyperapp'

const UILink = (props, children) => (state) => {
  let { to } = props

  return <a onclick={(event) => { event.preventDefault(); window.history.pushState({}, '', to) }}>{children}</a>
}

export default UILink
