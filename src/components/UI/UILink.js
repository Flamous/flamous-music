/** @jsx h */
import { h } from 'hyperapp'

const UILink = (props, children) => (state) => {
  function handleClick (event) {
    if (props.onclick) props.onclick()
    if (
      event.shiftKey ||
      event.altKey ||
      event.ctrlKey
    ) return

    event.preventDefault()
    if (!replace && !back) {
      window.history.pushState(state.location.pathname, '', to)
      return
    }
    if (replace) {
      window.history.replaceState(state.location.previous, '', to)
      return
    }
    if (back) window.history.back()
  }

  let { to, replace, back } = props
  // TODO: Set href properly when 'back' prop is used

  return <a {...props} onclick={handleClick} href={props.to}>{children}</a>
}

export default UILink
