import { h } from 'hyperapp'
import picostyle from 'picostyle'
import artists from '../artists.js'
import Page from './Page.js'
import { GalleryItem } from './Gallery'
import Gallery from './Gallery'
import Header from './Header.js'
import { Link } from '@hyperapp/router'
import rightArrow from '../public/blue_right.svg'
import LazyImage from './LazyImage.js';

const style = picostyle(h)

const FlamousHeaderStyle = style('header')({
  zIndex: '100',
  position: 'sticky',
  display: 'block',
  width: '100%',
  top: '0',
  padding: '1em',
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
  fontWeight: 'bold',
  textAlign: 'center'
})

const FlamousHeader = (props) => {
  return <FlamousHeaderStyle>
    Flamous Music
  </FlamousHeaderStyle>
}

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
    transform: 'translateY(-1em)',
    display: 'inline-block'
  }
})
const Artist = ArtistStyle

const Home = (props) => {
  return (
    <Page nonInteractive key={props.key}>
      {/* {props.updateAvailable ? <UpdateBanner /> : <UpdateBanner />} */}
      {props.updateAvailable ? <Button to='/about' text='Update Available' /> : ''}
      {/* <Header title='Flamous Music' /> */}
      <FlamousHeader />
      <Gallery>
        <Artist to='/artist/wowa'>
          <LazyImage src={artists[0].cover_art_url} />
          <div>
            <span class='artist-line'>{artists[0].name}</span>
            <br />
            <span class='secondary'>14 songs</span>
          </div>
        </Artist>
      </Gallery>
      {/* <Gallery
        heading='Featured Artists'>
        {artists.map((item, index) => {
          return <Link to={item.name ? '/artist/wowa' : '/'} style={{display: 'contents'}} onclick={(e) => { if (window.clickLock) { e.preventDefault() } }}>
            <GalleryItem title={artists[index].name} sub='Artist' image={artists[index].cover_art_url} />
          </Link>
        })}
      </Gallery> */}
      <p style={{textAlign: 'center'}}>
        <Link style={{color: '#767676'}} to='/about'>About Flamous</Link>
        <span style={{margin: '0 0.4em'}}>
        &middot;
        </span>
        <a target='_blank' style={{color: '#767676'}} href='https://github.com/christiankaindl/flamous-music'>View on GitHub</a>
      </p>
    </Page>
  )
}

export default Home
