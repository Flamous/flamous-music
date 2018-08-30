import { h } from 'hyperapp'
import picostyle from 'picostyle'
import albums from '../albums.js'
import Page from './Page.js'
import { GalleryItem } from './Gallery'
import Gallery from './Gallery'
import Header from './Header.js'
import { Link } from '@hyperapp/router'
import UpdateBanner from './UpdateBanner'
import rightArrow from '../public/blue_right.svg'

const style = picostyle(h)

const Button = (props) => style('span')({
  fontWeight: 'bold',
  color: '#007AFF',
  position: 'absolute',
  right: '1.5em',
  top: '1em'
})(
  {

  },
  <Link to={props.to}>
    {[props.text, <img src={rightArrow} style={{height: '0.8em', marginLeft: '0.4em', marginTop: '0em'}} />]}
  </Link>
)

const Home = (props) => {
  return (
    <Page nonInteractive key={props.key}>
      {/* {props.updateAvailable ? <UpdateBanner /> : <UpdateBanner />} */}
      {window.flamous.isUpdateAvailable() ? <Button to='/about' text='Update Available' /> : ''}
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
