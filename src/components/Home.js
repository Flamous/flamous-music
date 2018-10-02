import { h } from 'hyperapp'
import picostyle from 'picostyle'
import artists from '../artists.js'
import Page from './Page.js'
import Gallery from './Gallery'
import Header from './Header.js'
import { Link } from '@hyperapp/router'
import LazyImage from './LazyImage.js'
import rightArrow from '../assets/blue_right.svg'

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

const ArtistStyle = style(Link)({
  textAlign: 'center',
  padding: '1em',
  '> img': {
    borderRadius: '100%',
    width: '10em',
    height: '9.9em',
    border: '1px solid rgba(0, 0, 0, 0.14)'
  },
  ' .artist-line': {
    fontSize: '1.2em',
    padding: '0.1em 0.4em',
    backgroundColor: 'rgba(251, 251, 251, 0.9)',
    borderRadius: '10px',
    transform: 'translateY(-1.2em)',
    display: 'inline-block',
    border: '1px solid rgba(0, 0, 0, 0.14)',
    color: '#212121'
  },
  ' .secondary': {
    color: '#212121',
    transform: 'translateY(-1.2em)',
    display: 'inline-block',
    fontSize: '0.94em'
  },
  '&:active': {
    backgroundColor: '#f0f0f0'
  }
})
const Artist = ArtistStyle

const Home = (props) => (context) => {
  let {updateAvailable} = context
  return (
    <Page nonInteractive key={props.key}>
      {updateAvailable ? <Button to='/about' text='Update Available' /> : ''}
      <Header title='Flamous Music' />
      <Gallery heading='Artists'>
        {
          artists.map((artist, index) => {
            return <Artist to={`/artist/${artist.name.toLowerCase().replace(' ', '_')}`}>
              <LazyImage src={artist.cover_art_url} />
              <div>
                <span class='artist-line'>{artist.name}</span>
                <br />
                <span class='secondary'>Artist, {artist.songCount} songs</span>
              </div>
            </Artist>
          })
        }

      </Gallery>
      {/* <Gallery
        heading='Featured Artists'>
        {artists.map((item, index) => {
          return <Link to={item.name ? '/artist/wowa' : '/'} style={{display: 'contents'}} onclick={(e) => { if (window.clickLock) { e.preventDefault() } }}>
            <GalleryItem title={artists[index].name} sub='Artist' image={artists[index].cover_art_url} />
          </Link>
        })}
      </Gallery> */}
      <p style={{maxWidth: '500px', margin: '0 auto', padding: '0 2em', textAlign: 'center'}}>
        <p>
        We see Public Domain content as the future of creative art. Music is no exception.<br /><br />
        Share, mix, download or cover music you discover on Flamous.
        </p>
        <Link to='/about' style={{display: 'flex', justifyContent: 'center'}}>
          <span style={{display: 'inline-block'}}>About Flamous</span><img src={rightArrow} style={{height: '1.2em', marginLeft: '0.2em'}} />
        </Link>
      </p>
    </Page>
  )
}

export default Home
