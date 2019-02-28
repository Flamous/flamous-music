/** @jsx h */
import { h } from 'hyperapp'
import { spring, value, styler, listen, pointer, transform } from 'popmotion'
import { nestable } from 'hyperapp-context'
import { slideUp } from '../functions/animation'
import UIIcon from '../UI/UIIcon'
import UILink from '../UI/UILink'
import styles from './Player.css'
import cc from 'classcat'

// import placeholder from '../../assets/song_placeholder.svg'
import placeholder from '../../assets/song_placeholder.svg'

let { snap } = transform

const state = {
  animation: slideUp.state
}

const actions = {
  animation: slideUp.actions
}

const view = (state, actions) => () => (context) => {
  let { animation: { start: startAnimation } } = actions

  return <div
    class={styles['player']}
    oncreate={(element) => { element.parentNode.actions = actions; startAnimation({ element, initialLoad: context.initialLoad }) }}
  >
    <header class={styles['header']}>
      <UILink back class={styles['close']}>
        <UIIcon height='48' width='48' icon='chevron-down' />
      </UILink>
      <h1>
        Playing
      </h1>
      <span>from [Playlist]</span>
    </header>

    <main class={styles['main']}>
      <div class={styles['cover-image']}>
        <img src={placeholder} />
      </div>
      <div class={styles['song-infos']}>
        <span class={styles['title']}>Song Title</span><br />
        <span class={styles['artists']}>Artists 1, Artist 2</span>
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
        <button class={cc(['white', styles['play']])}>
          <UIIcon height='48' width='48' icon='pause' />
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
}

const Player = nestable(
  {
    ...state
  },
  {
    ...actions
  },
  view,
  'page-player'
)

export default (props) => { return <Player onremove={(elem, done) => { elem.actions.animation.slideOut(done) }} {...props} key='player' /> }
