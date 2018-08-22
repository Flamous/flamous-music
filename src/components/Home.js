import { h } from 'hyperapp'
// import picostyle from 'picostyle'
import albums from '../albums.js'
import Page from './Page.js'
import { GalleryItem } from './Gallery'
import Gallery from './Gallery'
import Header from './Header.js'
import About from '../elements/About.js'
import songList from '../songs'
import { Link } from '@hyperapp/router'

// const style = picostyle(h)
console.log(GalleryItem)
const Home = () => {
  return (
    <Page nonInteractive>
      <Header title='Flamous Music' sub='The best of Public Domain music.' button={{text: 'About Flamous >', to: '/about'}} />
      <Gallery
        heading='Playlists'>
        {/* <GalleryItem /> */}
        {albums.map((item, index) => {
          return <Link to={item.name ? '/playlists' : '/'}>
            <GalleryItem title={albums[index].name} sub={albums[index].artist} image={albums[index].cover_art_url} />
          </Link>
        })}
      </Gallery>
    </Page>
  )
}

export default Home

        // onclick={() => { if (window.clickLock) return; window.flamous.addPage([<Header title='Wowa' sub='Free music by Wowa (www.wowa.me)' />, <Gallery data={songList} />]) }}
