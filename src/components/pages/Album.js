/** @jsx h */
import { h } from 'hyperapp'
import styles from './Album.css'

import UIPage from '../UI/UIPage'
import UIHeader from '../UI/UIHeader'
import UIBackButton from '../UI/UIBackButton'
import albumPlaceholder from '../../assets/song_placeholder.svg'
import UIIcon from '../UI/UIIcon'
import SongList from '../SongList'
import cc from 'classcat'
import OpenGraph from '../OpenGraph'

let songData = [
  {
    title: 'They Say',
    artist: 'Wowa & Pipo',
    album: 'Single'
  },
  {
    title: 'Contrapunctus 2',
    artist: 'Kimiko Ishizaka',
    album: 'The Art of the Fuge'
  },
  {
    title: 'Varianto 3 a 1 Clav. Canone all Unisuono',
    artist: 'Kimiko Ishizaka',
    album: 'Goldberg Variations'
  },
  {
    title: "I'll Do It All Over Again",
    artist: 'Billy Murray',
    album: 'Single'
  },
  {
    title: 'Easy [iPhone Production]',
    artist: 'Wowa',
    album: 'Single'
  }
]

let View = (state, actions) => () => (context) => {
  let { shareAPI } = context

  return (
    <div class={styles['album']}>
      <OpenGraph
        title='[Album Name] by [Artist Name]'
        description='Listen to the album [Album Name] on Flamous Music.'
      />
      <UIHeader
        noDynamicTitle
        title={(
          <div class={styles['header']}>
            <div class={styles['header-inner']}>
              <div class={styles['header-image']}>
                <img src={albumPlaceholder} />
              </div>
              <div class={styles['header-infos']}>
                <span class={styles['header-title']}>
                  <span>Album title</span>
                  <span class={styles['artists']}>Artist 1, Artist 2</span>
                </span>
              </div>
            </div>
            <div class={styles['header-items-row']}>
              <span class={styles['misc']}>13 Songs &middot; 25 Min</span>
              <button class={styles['shuffle-button']}><UIIcon icon='play' width='20' height='20' />Shuffle</button>
              <button class={cc(['white', styles['album-menu']])}><UIIcon icon='more-horizontal' /></button>
            </div>
          </div>)}
        nav={{
          start: <UIBackButton />,
          middle: 'Album',
          end: shareAPI && <button onclick={() => navigator.share({
            title: 'Free high-quality music - Flamous',
            url: window.location.href,
            text: 'Some descriptive text...'
          })} class='white'><UIIcon icon='share-2' style={{ color: 'black', strokeWidth: '1.5px' }} /></button>
        }}
      />

      <main class={styles['main']}>
        <SongList mode='album' songs={songData} />

        <section class={styles['story']}>
          <h3>Album story</h3>
          <blockquote>
            When we initially recorded the album, we met Phil. He's now a band member, so one could say it paid off.
          </blockquote>
        </section>
      </main>

      <footer class={styles['footer']}>
        7 Songs &middot; &copy; Artist 1
      </footer>
    </div>
  )
}

export default (props) => (
  <UIPage {...props}>
    <View {...props} />
  </UIPage>
)
