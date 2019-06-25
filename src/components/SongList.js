/** @jsx h */
import { h } from 'hyperapp'
import styles from './SongList.css'
import albumCoverPlaceholer from '../assets/song_placeholder.svg'
import UIIcon from './UI/UIIcon'
import cc from 'classcat'

function buildActions (song) {
  let { aritstId, albumId } = song

  let ctx = {
    standalone: [
      { text: 'Add to Queue',
        icon: 'corner-down-left'
      },
      { text: 'Save to Library',
        icon: 'heart'
      },
      { text: 'Go to Album',
        icon: 'disc',
        action: function goToArtist ({ close }) {
          window.history.pushState({}, '', `/albums/${albumId}`)
          close()
        }
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

  return ctx
}

/**
 * Displays a list of songs
 * @param {string} [mode=standalone] - Possible values are 'standalone', 'album' or 'artist'. Depending on the mode, different features are enabled/disabled.
 * @param {Object[]} songs - List of songs to display
 */

let view = (props, children) => (state) => (context) => {
  let { actionMenu: { isOpen: actionMenuIsOpen }, auth: { s3BasePath }, currentSongData } = state
  let { songs = [], mode = 'standalone', album } = props
  let { actionMenu } = context.actions

  let { audioSource } = currentSongData

  // openActionMenu should be extracted (probably into a decorator). Maybe something along CtxMenuAction?
  function openActionMenu (event, initiator, song) {
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
      items: buildActions(song)[mode]
    })
  }

  return <ul class={styles['song-list']}>
    { songs.length > 0 && songs.map((song, index) => {
      return <li onclick={(event) => {
        context.actions.setPlayingContext({
          songList: songs,
          play: index
        })
      }}>
        <div
          class={cc([styles['song-item'], { [styles['active-song']]: audioSource === song.audioSource }])}
          to='/'
          oncreate={elem => {
            elem.addEventListener('long-press', (event) => openActionMenu(event, null, song))
          }}
        >
          <div class={styles['song-body']}>
            <div class={styles['song-text']}>
              <span class={styles['song-title']}>
                {song.title}
              </span>
              <br />
              <span class={styles['song-infos']}>
                {song.artist} {mode !== 'album' ? <span>&middot; {album}</span> : ''}
              </span>
            </div>
            <button class='white' onmousedown={(e) => openActionMenu(e, 'cursor', song)} onclick={(e) => !actionMenuIsOpen && openActionMenu(e, 'touch', song)}>
              <UIIcon icon='more-horizontal' />
            </button>
          </div>
          { mode !== 'album' && (
            <div class={styles['cover-image']}>
              <img src={`${s3BasePath}/${song.imageSource}` || albumCoverPlaceholer} />
            </div>)
          }
        </div>
      </li>
    })}
  </ul>
}

let SongList = view

export default SongList
