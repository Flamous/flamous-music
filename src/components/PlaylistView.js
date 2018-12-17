/** @jsx h */
import { h } from 'hyperapp'
import Page from '../components/Page'
import Header from '../components/Header'
import Gallery, { GalleryItem } from '../components/Gallery'
import songList from '../songs/wowa'
import placeholder from '../public/song_placeholder.svg'

const PlaylistView = (props) => {
  return <Page key='playlist'>
    <Header title='Wowa' sub='Free music by Wowa (www.wowa.me)' back={{ text: 'Back', to: '/' }} />
    <Gallery heading='Songs' playAllButton>
      {songList.map((item) => {
        return <GalleryItem key={item.id} class={(props.playingState && props.playingId === item.id) ? 'playing' : ''} image={item.cover_art_url || placeholder} title={item.name} sub={item.artist} />
      })}
    </Gallery>
  </Page>
}

export default PlaylistView
