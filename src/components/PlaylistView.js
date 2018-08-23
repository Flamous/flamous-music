import { h } from 'hyperapp'
import Page from '../components/Page'
import Header from '../components/Header'
import { GalleryItem } from '../components/Gallery'
import Gallery from '../components/Gallery'
import songList from '../songs'
import placeholder from '../public/song_placeholder.svg'
import { Link } from '@hyperapp/router'

const PlaylistView = (props) => {
  return <Page key='playlist'>
    <Header title='Wowa' sub='Free music by Wowa (www.wowa.me)' back={{name: 'Flamous Music', to: '/'}} />
    <Gallery heading='Songs'>
      {songList.map((item) => {
        return <GalleryItem key={item.id} class={(props.playingState && props.playingId === item.id) ? 'playing' : ''} image={item.cover_art_url || placeholder} title={item.name} sub={item.artist} onclick={() => { if (window.clickLock) return; console.log(item.id); window.Amplitude.playSongAtIndex(item.id) }} />
      })}
    </Gallery>
  </Page>
}

export default PlaylistView
