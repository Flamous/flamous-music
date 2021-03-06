/** @jsx h */
import { h } from 'hyperapp'
import { nestable } from 'hyperapp-context'
import { slideUp } from '../functions/animation'
import UIIcon from '../UI/UIIcon'
import UILink from '../UI/UILink'
import styles from './Player.css'
import cc from 'classcat'

// import placeholder from '../../assets/song_placeholder.svg'
import placeholder from '../../assets/song_placeholder.svg'

const state = {
  animation: slideUp.state
}

const actions = {
  animation: slideUp.actions
}

let matchedPreviously = false

const view = (state, actions) => (props) => (context) => {
  let { animation: { slideOut, start: startAnimation } } = actions
  let { isMatch } = props
  let isSwipe = window.history.state && window.history.state.isSwipe
  let initialLoad = context.initialLoad

  let { title } = context.currentSongData
  let { isPlaying } = context.player

  function togglePlay (index) {
    console.log(isPlaying)
    isPlaying && context.actions.pause()
    !isPlaying && context.actions.play(index)
  }

  function onRouteMatch (element) {
    if (isMatch && !matchedPreviously) {
      matchedPreviously = true
      startAnimation({
        element,
        initialInteractive: isSwipe,
        slideOutInteractive: true,
        initialLoad,
        back: () => window.history.back()
      })
    }
  }
  return <div
    class={[styles['player']]}
    oncreate={(element) => {
      element.parentNode.actions = actions

      onRouteMatch(element)
    }}
    onupdate={element => {
      onRouteMatch(element)

      if (!isMatch && matchedPreviously) {
        matchedPreviously = false
        slideOut({
          element
        })
      }
    }}
  >
    <div class={styles['wrapper']}>
      <header class={styles['header']}>
        <UILink back class={styles['close']}>
          <UIIcon height='48' width='48' icon='chevron-down' />
        </UILink>
        <h1>
        Playing
        </h1>
        {/* <span>from [Playlist]</span> */}
      </header>

      <main class={styles['main']}>
        <div class={styles['song-meta-wrapper']}>
          <div class={styles['cover-image']}>
            <img src={placeholder} />
          </div>
          <div class={styles['song-infos']}>
            <span class={styles['title']}>{title}</span><br />
            {/* <span class={styles['artists']}>Artists 1, Artist 2</span> */}
          </div>
        </div>
        <div class={styles['scrubber']}>
          <span>
          00:00
          </span>
          <div class={styles['slider']}>
            <span class={styles['thumb']} />
          </div>
          <span>
          00:00
          </span>
        </div>
        <div class={styles['controls']}>
          <button class='white'>
            <UIIcon height='36' width='36' icon='rewind' />
          </button>
          <button onclick={() => togglePlay()} class={cc(['white', styles['play']])}>
            <UIIcon height='48' width='48' icon={isPlaying ? 'pause' : 'play'} />
          </button>
          <button class='white'>
            <UIIcon height='36' width='36' icon='fast-forward' />
          </button>
        </div>
      </main>

      <footer class={styles['footer']}>
        <button class='white'>
          <UIIcon icon='shuffle' />
        </button>
        <button class='white'>
          <UIIcon height='30' width='30' icon='plus' />
          <span>Add to Library</span>
        </button>
        {/* <button class='white'>
          <UIIcon icon='share-2' />
        </button> */}
        <button
          class='white'
          onclick={(event) => context.actions.actionMenu.open({
            items: [
              { text: 'Share',
                icon: 'share-2'
              },
              { text: 'Loop Song',
                icon: 'repeat'
              },
              { text: 'Go to Artist',
                icon: 'user'
              },
              { text: 'Download Audio File',
                icon: 'download'
              },
              { text: 'Report Content',
                icon: 'slash'
              }
            ],
            event
          })}>
          <UIIcon height='30' width='30' icon='more-horizontal' />
        </button>
      </footer>
    </div>
  </div>
}

const Player = nestable(
  {
    ...state
  },
  {
    ...actions
  },
  view,
  'music-player'
)

export default (props) => { return <Player {...props} key='player' /> }
