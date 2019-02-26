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
  animation: slideUp.actions
}

let view = (state, actions) => (props, children) => (context) => {
  let { items } = props
  let { close } = context.actions.actionMenu
  let { start: startAnimation } = actions.animation

  return <div
    oncreate={(elem) => { elem.parentNode.actions = actions; window.requestAnimationFrame(() => window.requestAnimationFrame(() => elem.parentNode.classList.toggle('open'))) }}
  >
    <div
      class={styles['background']}
      onclick={close}
    />
    <div class={styles['container']} oncreate={(element) => startAnimation({ element, initialLoad: context.initialLoad })}>
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
    onremove={(elem, done) => { elem.classList.toggle('open'); elem.actions.animation.slideOut(done) }}
    {...props}
    key='action-menu'
    class={styles['action-menu']}
  />)
