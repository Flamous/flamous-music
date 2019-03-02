/** @jsx h */
import { h } from 'hyperapp'
import { Link } from '@hyperapp/router'
import styles from './UITabBar.css'
import placeholderImage from '~/assets/song_placeholder.svg'
import librarySVG from '~/assets/icons/library.svg'
import libraryBlueSVG from '~/assets/icons/library_blue.svg'
import UIIcon from './UIIcon'
import cc from 'classcat'

const THRESHOLD = 10
let lastTouchY = 0
let YDelta = 0
let hasFired = false

const UITabBar = (props, children) => (context) => {
  let { actions: { views: { setActive } }, views: { activeView } } = context

  const SetActive = (props, children) => {
    let { viewName } = props

    delete props.viewName

    return <div
      onclick={() => setActive(viewName)}
      onmousedown={() => setActive(viewName)}
      {...props}
    >
      {children}
    </div>
  }

  return <nav
    class={styles['tab-bar']}
    ontouchstart={event => {
      lastTouchY = event.changedTouches[0].clientY
    }}
    ontouchmove={event => {
      let currentTouchY = event.changedTouches[0].clientY
      let delta = lastTouchY - currentTouchY

      YDelta += delta
      lastTouchY = currentTouchY

      if (YDelta >= THRESHOLD && !hasFired) {
        hasFired = true
        window.history.pushState({ isSwipe: true }, '', '/player')
      }
    }}
    ontouchend={event => {
      YDelta = 0
      hasFired = false
    }}
  >
    <SetActive viewName='home' class={cc([styles['item'], { [styles['active']]: activeView === 'home' }])}>
      <UIIcon icon='music' />
      <span>Explore</span>
    </SetActive>

    <SetActive viewName='library' class={cc([styles['item'], { [styles['active']]: activeView === 'library' }])}>
      <img class={styles['icon']} alt='Library Icon' src={activeView === 'library' ? libraryBlueSVG : librarySVG} />
      <span>Library</span>
    </SetActive>

    <SetActive viewName='profile' class={cc([styles['item'], { [styles['active']]: activeView === 'profile' }])}>
      <UIIcon icon='user' />
      <span>Profile</span>
    </SetActive>

    <Link to='/player' class={cc([styles['item'], styles['player']])}>
      <img alt='Cover Image' src={placeholderImage} />
    </Link>
  </nav>
}

export default UITabBar
