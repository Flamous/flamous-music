/** @jsx h */
import { h } from 'hyperapp'
import styles from './ArtistList.css'
import albumCoverPlaceholer from '../assets/song_placeholder.svg'
import UIIcon from './UI/UIIcon'
import UILink from './UI/UILink'

let view = (props, children) => (state) => (context) => {
  let { artists = [] } = props
  let { actionMenu } = context.actions

  return <ul class={styles['artist-list']}>
    { artists.length > 0 && artists.map(artist => (
      <li>
        <UILink class={styles['artist-item']} to='/'>
          <div class={styles['artist-body']}>
            <div class={styles['artist-text']}>
              <span class={styles['artist-name']}>
                {artist.name}
              </span>
              <br />
              <span class={styles['artist-infos']}>
                {artist.monthlyListeners} listeners
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
          <div class={styles['profile-image']}>
            <img src={albumCoverPlaceholer} />
          </div>
        </UILink>
      </li>
    ))}
  </ul>
}

let ArtistList = view

export default ArtistList
