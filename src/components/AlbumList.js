/** @jsx h */
import { h } from 'hyperapp'
import styles from './AlbumList.css'
import albumCoverPlaceholer from '../assets/song_placeholder.svg'
import UIIcon from './UI/UIIcon'
import UILink from './UI/UILink'

let view = (props, children) => (state) => (context) => {
  let { albums = [] } = props
  let { actionMenu } = context.actions

  function openActionMenu (event) {
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
  }

  return <ul class={styles['album-list']}>
    { albums.length > 0 && albums.map(album => (
      <li>
        <UILink
          class={styles['album-item']}
          to='/'
          // data-long-press-delay='500'
          oncreate={elem => {
            elem.addEventListener('long-press', openActionMenu)
          }}
        >
          <div class={styles['album-body']}>
            <div class={styles['album-text']}>
              <span class={styles['album-title']}>
                {album.title}
              </span>
              <br />
              <span class={styles['album-infos']}>
                {album.artist} &middot; {album.songCount} Songs
              </span>
            </div>
            <button class='white' onclick={openActionMenu}>
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

let AlbumList = view

export default AlbumList
