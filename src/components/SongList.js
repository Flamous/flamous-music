/** @jsx h */
import { h } from 'hyperapp'
import styles from './SongList.css'
import albumCoverPlaceholer from '../assets/song_placeholder.svg'
import UIIcon from './UI/UIIcon'
import UILink from './UI/UILink'

let view = (props, children) => (state) => (context) => {
  let { songs = [] } = props
  let { actionMenu } = context.actions

  return <ul class={styles['song-list']}>
    { songs.length > 0 && songs.map(song => (
      <li>
        <UILink class={styles['song-item']} to='/'>
          <div class={styles['song-body']}>
            <div class={styles['song-text']}>
              <span class={styles['song-title']}>
                {song.title}
              </span>
              <br />
              <span class={styles['song-infos']}>
                {song.artist} &middot; {song.album}
              </span>
            </div>
            <button class='white' onclick={event => {
              actionMenu.open({
                event,
                items: [
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
                  { text: 'Share',
                    icon: 'share-2'
                  },
                  { text: 'Download Audio File',
                    icon: 'download'
                  },
                  { text: 'Report Content',
                    icon: 'slash'
                  }
                ]
              })
            }}>
              <UIIcon icon='more-horizontal' />
            </button>
          </div>
          <div class={styles['cover-image']}>
            <img src={albumCoverPlaceholer} />
          </div>
        </UILink>
      </li>
    ))}
  </ul>
}

let SongList = view

export default SongList
