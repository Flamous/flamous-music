/** @jsx h */
import { h } from 'hyperapp'

const UILink = (props, children) => (state) => {
  let { to, replace } = props

  return <a onclick={(event) => { event.preventDefault(); replace ? window.history.replaceState(state.location.previous, '', to) : window.history.pushState(state.location.pathname, '', to) }} {...props}>{children}</a>
}

export default UILink
