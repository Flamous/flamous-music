/** @jsx h */
import { h } from 'hyperapp'
import UILink from './UILink'
import styles from './UITabBar.css'
import librarySVG from '~/assets/icons/library.svg'
import libraryBlueSVG from '~/assets/icons/library_blue.svg'
import UIIcon from './UIIcon'
import cc from 'classcat'

import coverArtPlaceholder from '~/assets/song_placeholder.svg'

const THRESHOLD = 10
let startY
let hasFired = false

const UITabBar = (props, children) => (context) => {
  let { actions: { togglePlay, playNext, views: { setActive } }, views: { activeView }, currentSongData = {}, isPlaying, songProgress, imageUrl } = context

  let { title } = currentSongData

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
      startY = event.changedTouches[0].clientY
    }}
    ontouchmove={event => {
      event.preventDefault()
      let currentTouchY = event.changedTouches[0].clientY
      let delta = startY - currentTouchY

      if (delta >= THRESHOLD && !hasFired) {
        hasFired = true
        window.history.pushState({ isSwipe: true, initialY: currentTouchY - delta }, '', '/player')
      }
    }}
    ontouchend={event => {
      hasFired = false
    }}
  >
    <UILink to='/player' class={styles['top-row']}>
      <img src={imageUrl || coverArtPlaceholder} class={styles['cover-image']} />
      <div class={styles['title-wrapper']}>
        <span class={styles['song-title']}>{title}</span>
        <div class={styles['progress-bar']}>
          <div style={{ transform: `translateX(${(songProgress * 100) - 100}%)` }} />
        </div>
      </div>
      <button class='white' onclick={(event) => { event.stopPropagation(); event.preventDefault(); togglePlay() }}>
        <UIIcon icon={isPlaying ? 'pause' : 'play'} />
      </button>
      <button onclick={(event) => { event.stopPropagation(); event.preventDefault(); playNext() }} class='white'>
        <UIIcon icon='fast-forward' />
      </button>
    </UILink>

    <div class={styles['bottom-row']}>
      <SetActive viewName='library' class={cc([styles['item'], { [styles['active']]: activeView === 'library' }])}>
        <UIIcon icon='disc' />
        <span>Session</span>
      </SetActive>

      <SetActive viewName='library' class={cc([styles['item'], { [styles['active']]: activeView === 'library' }])}>
        <UIIcon icon='search' />
        <span>Search</span>
      </SetActive>

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
    </div>
  </nav>
}

export default UITabBar
