/** @jsx h */
import { h } from 'hyperapp'
import styles from './Artist.css'

import UIPage from '../UI/UIPage'
import UIHeader from '../UI/UIHeader'
import UIBackButton from '../UI/UIBackButton'
import artistPlaceholder from '../../assets/artist_placeholder.svg'
import UIIcon from '../UI/UIIcon'
import SongList from '../SongList'
import AlbumList from '../AlbumList'
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

let albumData = [
  {
    title: 'Goldberg Variations',
    artist: 'Kimiko Ishizaka',
    songCount: 25
  },
  {
    title: 'adfs',
    artist: 'sdfadsf',
    songCount: 5
  },
  {
    title: 'The Art of the Fuge',
    artist: 'Kimiko Ishizaka',
    songCount: 5
  }
]

let View = (state, actions) => () => () => {
  return (
    <div class={styles['artist']}>
      <OpenGraph
        title='[Artist Name] on Flamous Music'
        description='[Artist page description...]'
      />
      <UIHeader
        noDynamicTitle
        title={(
          <div class={styles['header-inner']}>
            <div class={styles['header-image']}>
              <img src={artistPlaceholder} />
            </div>
            <div class={styles['header-infos']}>
              <span class={styles['header-title']}><span>Artist title</span></span>
              <div class={styles['header-items-row']}>
                {/* <span>Artist 1, Artist 2</span> */}
                {/* <button class='white'><UIIcon icon='more-horizontal' /></button> */}
              </div>
            </div>
          </div>)}
        nav={{
          start: <UIBackButton />,
          middle: 'Artist',
          end: <button class='white'><UIIcon icon='share-2' style={{ strokeWidth: '1.5px' }} /></button>
        }}
      />

      <main class={styles['main']}>
        <section>
          <h3>Top 5</h3>
          <SongList mode='artist' songs={songData} />
        </section>
        <section>
          <h3>Albums</h3>
          <AlbumList albums={albumData} />
        </section>
      </main>

      <footer class={styles['footer']}>
        13 Songs &middot; &copy; Artist 1
      </footer>
    </div>
  )
}

export default (props) => (
  <UIPage {...props}>
    <View {...props} />
  </UIPage>
)
