/** @jsx h */
import { h } from 'hyperapp'
import styles from './SongList.css'
import albumCoverPlaceholer from '../assets/song_placeholder.svg'
import UIIcon from './UI/UIIcon'

let ctx = {
  standalone: [
    { text: 'Add to Queue',
      icon: 'corner-down-left'
    },
    { text: 'Save to Library',
      icon: 'heart'
    },
    { text: 'Go to Album',
      icon: 'disc'
    },
    { text: 'Go to Artist',
      icon: 'user'
    },
    { text: 'Share Song',
      icon: 'share-2'
    },
    { text: 'Download Audio File',
      icon: 'download'
    },
    { text: 'Report Content',
      icon: 'slash'
    }
  ],
  album: [
    { text: 'Save to Library',
      icon: 'heart'
    },
    { text: 'Add to Queue',
      icon: 'corner-down-left'
    },
    { text: 'Go to Artist',
      icon: 'user'
    },
    { text: 'Share Song',
      icon: 'share-2'
    }
  ],
  artist: [
    { text: 'Save to Library',
      icon: 'heart'
    },
    { text: 'Add to Queue',
      icon: 'corner-down-left'
    },
    { text: 'Go to Album',
      icon: 'disc'
    },
    { text: 'Share Song',
      icon: 'share-2'
    }
  ]
}

/**
 * Displays a list of songs
 * @param {string} [mode=standalone] - Possible values are 'standalone', 'album' or 'artist'. Depending on the mode, different features are enabled/disabled.
 * @param {Object[]} songs - List of songs to display
 */

let view = (props, children) => (state) => (context) => {
  let { songs = [], mode = 'standalone' } = props
  let { actionMenu } = context.actions

  // openActionMenu should be extracted (probably into a decorator). Maybe something along CtxMenuAction
  function openActionMenu (event, initiator) {
    let details = event.detail

    if (!details.initiator) {
      details = {
        initiator,
        pos: {
          x: event.clientX,
          y: event.clientY
        }
      }
    }

    event.preventDefault()
    event.stopPropagation()
    actionMenu.open({
      event,
      details,
      items: ctx[mode]
    })
  }

  return <ul class={styles['song-list']}>
    { songs.length > 0 && songs.map(song => (
      <li>
        <div
          class={styles['song-item']}
          to='/'
          oncreate={elem => {
            elem.addEventListener('long-press', openActionMenu)
          }}
        >
          <div class={styles['song-body']}>
            <div class={styles['song-text']}>
              <span class={styles['song-title']}>
                {song.title}
              </span>
              <br />
              <span class={styles['song-infos']}>
                {song.artist} {mode !== 'album' ? <span>&middot; {song.album}</span> : ''}
              </span>
            </div>
            <button class='white' onmouseup={(e) => openActionMenu(e, 'cursor')} ontouchend={(e) => openActionMenu(e, 'touch')}>
              <UIIcon icon='more-horizontal' />
            </button>
          </div>
          { mode !== 'album' && (
            <div class={styles['cover-image']}>
              <img src={albumCoverPlaceholer} />
            </div>)
          }
        </div>
      </li>
    ))}
  </ul>
}

let SongList = view

export default SongList
