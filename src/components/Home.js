import { h } from 'hyperapp'
// import picostyle from 'picostyle'
import albums from '../albums.js'
import Page from './Page.js'
import { GalleryItem } from './Gallery'
import Gallery from './Gallery'
import Header from './Header.js'
import { Link } from '@hyperapp/router'

const Home = () => {
  return (
    <Page nonInteractive>
      <Header title='Flamous Music' sub='The best of Public Domain music.' button={{text: 'About', to: '/about'}} />
      <Gallery
        heading='Playlists'>
        {albums.map((item, index) => {
          return <Link to={item.name ? '/playlists' : '/'} style={{display: 'contents'}} onclick={(e) => { if (window.clickLock) { e.preventDefault() } }}>
            <GalleryItem title={albums[index].name} sub={albums[index].artist} image={albums[index].cover_art_url} />
          </Link>
        })}
      </Gallery>
    </Page>
  )
}

export default Home
