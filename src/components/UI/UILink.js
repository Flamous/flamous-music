/** @jsx h */
import { h } from 'hyperapp'

const UILink = (props, children) => (state) => {
  function handleClick (event) {
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

  return <a onclick={handleClick} href={props.to} {...props}>{children}</a>
}

export default UILink
