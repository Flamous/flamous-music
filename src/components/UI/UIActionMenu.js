/** @jsx h */
import { h } from 'hyperapp'
import UIIcon from './UIIcon'
import styles from './UIActionMenu.css'
import { slideUp } from '../functions/animation'
import { nestable } from 'hyperapp-context'

let state = {
  animation: slideUp.state
}

let actions = {
  animation: slideUp.actions,
  setMenuPos: (pos) => {
    let { x, y } = pos
    let width = 342 // Measured with DevTools ¯\_(ツ)_/¯
    let height = 360 // Also measured with DevTools
    let xMargin = window.innerWidth - (x + width)
    let yMargin = window.innerHeight - (y + height)

    if (xMargin < 0) x += xMargin
    if (yMargin < 0) y += yMargin

    return {
      x,
      y
    }
  }
}

let view = (state, actions) => (props, children) => (context) => {
  let { items, details } = props
  let { close } = context.actions.actionMenu
  let { start: startAnimation } = actions.animation
  let { x, y } = state

  return <div
    oncreate={(elem) => {
      details.pos && actions.setMenuPos({ x: details.pos.x, y: details.pos.y })
      elem.parentNode.actions = actions
      window.requestAnimationFrame(() => window.requestAnimationFrame(() => elem.parentNode.classList.toggle('open')))

      if (details.initiator === 'touch') {
        elem.classList.add(styles['touch'])
      }
      if (details.initiator === 'cursor') {
        elem.classList.add(styles['cursor'])
      }
    }}
  >
    <div
      class={styles['background']}
      onclick={close}
    />
    <div
      style={x && y ? `transform: translateX(${x - 5}px) translateY(${y - 5}px)` : details.initiator === 'touch' ? '' : 'display: none;'}
      class={styles['container']}
      oncreate={(element) => details.initiator === 'touch' && startAnimation({ element, initialLoad: context.initialLoad })}
    >
      <ul class={styles['action-list']}>
        {
          items && items.map((item) => {
            let { action, text, icon } = item

            return <li class={item.class || ''} style={item.style} onclick={() => action({ close })}>
              <div>
                {text}
              </div>
              {
                icon && <UIIcon icon={icon} />
              }
            </li>
          })
        }
      </ul>
      <div class={styles['cancel']} onclick={close}>
      Cancel
      </div>
    </div>
  </div>
}

const UIActionMenu = nestable(
  {
    ...state
  },
  {
    ...actions
  },
  view,
  'action-menu'
)
export default (props) => (
  <UIActionMenu
    onremove={(elem, done) => {
      let initiator = props.details.initiator
      elem.classList.toggle('open')
      if (initiator === 'touch') {
        elem.actions.animation.slideOut({ done, elem })
        return
      }

      done()
    }}
    {...props}
    key='action-menu'
    class={styles['action-menu']}
  />)
