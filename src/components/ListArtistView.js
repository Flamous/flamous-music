import { h } from 'hyperapp'
import picostyle from 'picostyle'
import Gallery from './Gallery'
import { Link } from '@hyperapp/router'
import artists from '../artists.js'
import Header from './Header'

const style = picostyle(h)

const ArtistStyle = style(Link)({
  textAlign: 'center',
  width: 'calc(50% - 2em)',
  border: '1px solid rgba(0, 0, 0, 0.14)',
  borderRadius: '16px',
  padding: '1px',
  margin: '0.7em 1em',
  boxShadow: '0px 5px 36px -5px rgba(0, 0, 0, 0.14)',
  '@media (min-width: 800px)': {
    '&': {
      maxWidth: '200px'
    }
  },
  '> img': {
    borderRadius: '16px 16px 3px 3px',
    width: '100%',
    borderBottom: '1px solid rgba(0, 0, 0, 0.14)'
  },
  ' .artist-line': {
    color: 'black',
    fontWeight: 'bold'
  },
  ' .secondary': {
    color: '#212121'
  },
  '&:active': {
    backgroundColor: '#f0f0f0'
  }
})
const Artist = ArtistStyle

const ListArtistView = (props) => {
  return <div>
    <Header title='Artists' back={{text: 'Back', to: '/'}} />
    <Gallery id='artists' heading='Browse Artists'>
      {
        artists.map((artist, index) => {
          return <Artist to={`/artists/${artist.name.toLowerCase().replace(' ', '_')}`}>
            <img src={artist.cover_art_url} />
            <div style={{padding: '0.8em 1em 1em'}}>
              <span class='artist-line'>{artist.name}</span>
              <br />
              <span class='secondary'>{artist.songCount} Songs</span>
            </div>
          </Artist>
        })
      }
      <p style={{textAlign: 'center', width: '100%'}}>
          Click on an artist above and listen to some tunes.
      </p>

    </Gallery>
  </div>
}

export default ListArtistView
