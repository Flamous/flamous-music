/** @jsx h */
import { h } from 'hyperapp'
import UIIcon from './UIIcon'
import styles from './UIActionMenu.css'

let UIActionMenu = (props, children) => (state) => (context) => {
  let { items } = props
  let { close } = context.actions.actionMenu

  return <div
    key='action-menu'
    class={styles['action-menu']}
    oncreate={elem => { window.requestAnimationFrame(() => window.requestAnimationFrame(() => elem.classList.toggle('open'))) }}
    onremove={(elem, done) => { elem.classList.toggle('open'); window.setTimeout(done, 500) }}
  >
    <div class={styles['background']} />
    <div class={styles['container']}>
      <ul class={styles['action-list']}>
        {
          items && items.map((item) => {
            let { action, text, icon } = item

            delete item.action
            delete item.text
            delete item.icon

            return <li {...item} onclick={() => action({ close })}>
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

export default UIActionMenu
