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

import gqlApi from '../functions/gqlApi'
import { getArtist } from '~/graphql/queries'

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

let View = (props, children) => (state) => {
  let { shareAPI, auth: { s3BasePath } } = state
  let artistId = props.match.params && props.match.params.artistId
  let { page } = state
  let { state: { albums = [], songs = [], artist = {} } } = page

  let profileImage = artist.imageSource ? `${s3BasePath}/${artist.imageSource}` : artistPlaceholder

  async function fetchArtist () {
    try {
      let result = await gqlApi({
        operation: getArtist,
        parameters: {
          artistId
        },
        authMode: 'AWS_IAM'
      })

      console.log('Album fetch result --> ', result)
      page.put({
        ...result
      })
    } catch (error) {
      console.error('Flamous: Could not load artist -->', artistId, error)
    }
  }

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
              <img src={profileImage} />
            </div>
            <div class={styles['header-infos']}>
              <span class={styles['header-title']}><span>{artist.name}</span></span>
              <div class={styles['header-items-row']}>
                {/* <span>Artist 1, Artist 2</span> */}
                {/* <button class='white'><UIIcon icon='more-horizontal' /></button> */}
              </div>
            </div>
          </div>)}
        nav={{
          start: <UIBackButton />,
          middle: 'Artist',
          end: shareAPI && <button onclick={() => navigator.share({
            title: 'Free high-quality music - Flamous',
            url: window.location.href,
            text: 'Some descriptive text...'
          })} class='white'><UIIcon icon='share-2' style={{ color: 'black', strokeWidth: '1.5px' }} /></button>
        }}
      />

      <main class={styles['main']}>
        <section class='centered'>
          <h3>Top 5</h3>
          <SongList mode='artist' songs={songs} />
        </section>
        <section class='centered'>
          <h3>Albums</h3>
          <AlbumList albums={albums} />
        </section>
      </main>

      <footer class={styles['footer']}>
        {artist.name}
      </footer>
    </div>
  )
}

export default (props) => (
  <UIPage {...props}>
    <View {...props} />
  </UIPage>
)
