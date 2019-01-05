/** @jsx h */
import { h } from 'hyperapp'
import UILink from './UILink'
import leftArrow from '~/assets/blue_left.svg'
import styles from './UIBackButton.css'

export default (props, children) => (state) => {
  let { text } = props
  let { views, location } = state
  let parentViewStack = views.stacks[views.activeView].stack
  let previousViewStackPath = parentViewStack.length > 1 && parentViewStack[parentViewStack.length - 2].path

  let backLocation = previousViewStackPath || `/${views.activeView}`
  let isBrowserHistoryBack = location.previous === previousViewStackPath

  return <UILink class={styles['back-button']} back={isBrowserHistoryBack} replace={!isBrowserHistoryBack} to={backLocation}>
    <img src={leftArrow} /><span>{text || 'Back'}</span>
  </UILink>
}
