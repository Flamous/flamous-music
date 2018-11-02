import { h } from 'hyperapp'
import picostyle from 'picostyle'
import Page from './Page'
import Header, { HeaderBold, HeaderImage } from './Header'
import { Route, Link } from '@hyperapp/router'
import LazyLoad from 'vanilla-lazyload'
import SongList from './SongList'
import { nestable } from 'hyperapp-context'
import Divider from './Divider'
// import profilePic from '../assets/wowa.jpg'
import artists from '../artists'

import wowaSongs from '../songs/wowa'
import kimikoSongs from '../songs/kimiko_ishizaka'
import billySongs from '../songs/billy_murray'

function updateLazyLoad (elem) {
  elem.lazyLoader.update()
}
function removeLazyLoad (elem) {
  elem.lazyLoader.destroy()
}
function initLazyLoad (elem) {
  let config = {
    container: elem,
    element_selector: '.image'
  }
  if (!elem.lazyLoader) {
    elem.lazyLoader = new LazyLoad(config)
  }

  elem.lazyLoader.update()
}

const style = picostyle(h)

const StyledAlbumThumbnail = style(Link)({
  width: '45%',
  padding: '1.5em',
  maxWidth: '230px',
  '& > img': {
    width: '100%',
    borderRadius: '2px 1px 1px 2px',
    borderRight: '2px solid rgba(0, 0, 0, 0.3)',
    boxShadow: 'rgba(0, 0, 0, 0.3) 0px 4px 25px 1px',
    transition: 'box-shadow 500ms'
  },
  '@media (pointer: fine)': {
    '&': {
      transition: 'transform 500ms'
    },
    '&:hover': {
      transform: 'scale(1.05)'
    },
    '&:hover img': {
      boxShadow: 'rgba(0, 0, 0, 0.3) 0px 6px 35px 0px'
    }
  },
  '@media (pointer: coarse)': {
    '&': {
      transition: 'transform 120ms'
    },
    '&:active': {
      transform: 'scale(1.05)'
    },
    '&:active img': {
      boxShadow: 'rgba(0, 0, 0, 0.3) 0px 6px 35px 0px'
    }
  }
})
const AlbumThumbnail = (props) => {
  return <StyledAlbumThumbnail to={`/albums/${props.id}`}>
    <img src={props.image} />
    <p style={{textAlign: 'center', color: 'black', fontSize: '0.9rem'}}>
      {props.name}
    </p>
  </StyledAlbumThumbnail>
}

const StyledAlbumList = style('div')({
  '& .album-list-wrapper': {
    maxWidth: '40rem',
    margin: '0 auto'
  }
})
const AlbumList = (props) => {
  return <StyledAlbumList>
    <div class='album-list-wrapper'>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <h3 style={{marginBottom: '0px', paddingLeft: '1.5em', fontWeight: 'bold'}}>Albums</h3>
        {/* <PlayAllButton title='Shuffle' /> */}
      </div>
      <div style={{display: 'flex', flexWrap: 'wrap'}}>
        {props.albums.map((album) => {
          return <AlbumThumbnail id={album.amplitudeName} image={album.songs[0].cover_art_url} name={album.name} amplitudeName={album.amplitudeName} />
        })}
      </div>
    </div>
  </StyledAlbumList>
}

let Artist = (props) => (context) => {
  let {playingState, playingContext: {id}} = context
  let artist
  let songs
  let albums
  let playlist

  switch (props.match.params.artistId) {
    case 'wowa':
      artist = artists[0]
      songs = wowaSongs
      playlist = 'wowa'
      // lel = import('../songs/wowa').then((res) => {
      //   song = res.default
      //   return renderArtist()
      // })
      break
    case 'kimiko_ishizaka':
      artist = artists[1]
      // songs = kimikoSongs
      albums = [
        {
          amplitudeName: 'open_goldberg_variations',
          name: 'J​.​S. Bach: "Open" Goldberg Variations, BWV 988 (Piano)',
          songs: kimikoSongs.filter((song) => {
            return song.album === 'J​.​S. Bach: "Open" Goldberg Variations, BWV 988 (Piano)'
          })
        },
        {
          amplitudeName: 'the_art_of_the_fugue',
          name: 'The Art of the Fugue',
          songs: kimikoSongs.filter((song) => {
            return song.album === 'The Art of the Fugue'
          })
        }
      ]
      // import('../songs/kimiko_ishizaka').then((res) => {
      //   songs = res.default
      // })
      break
    case 'billy_murray':
      artist = artists[2]
      songs = billySongs
      playlist = 'billy_murray'
      break
  }

  let out = artist
    ? <div key={props.match.params.artistId} oncreate={initLazyLoad} ondestroy={removeLazyLoad} onupdate={updateLazyLoad}>
      <Header title={artist.name} back={{text: 'Back', to: '/'}}>
        <HeaderBold style={{textAlign: 'center'}}>
          <HeaderImage onclick={(event) => {
            let bounds = event.target.getBoundingClientRect()
            window.flamous.imageViewer.showImageViewer({image: artist.cover_art_url, bounds: bounds})
          }} src={artist.cover_art_url} />
          <p style={{fontSize: '1rem', fontWeight: 'normal', margin: '0.5rem 0 0 -0.2rem', textTransform: 'uppercase'}}>Artist</p>
          {artist.name}
        </HeaderBold>
      </Header>
      <Divider />

      {songs && <SongList playlist={playlist} songs={songs} />}
      { songs && albums && <Divider /> }
      {albums && <AlbumList albums={albums} />}
    </div>
    : <div>
      <h2>Artist not found</h2>
    </div>

  return out
}

const ArtistView = nestable({
  stuff: {
    name: null,
    content: null
  }
},
{
  stuff: {
    addContent: (prop) => (state) => {
      if (state.name) return

      return {
        content: prop.content,
        name: prop.name
      }
    }
  }
},
(state, actions) => (props, children) => {
  return <div>
    { state.stuff.content && <state.stuff.content /> }
    <Route path={`${props.match.path}/:artistId`} render={(matchProps) => {
      actions.stuff.addContent({content: () => { return <Artist {...matchProps} /> }, name: 'About'})
    }}
    // render={(matchProps) => { return <Artist {...matchProps} /> }}
    />
  </div>
})

export default (props) => {
  return <Page key={props.key}>
    <ArtistView {...props} />
  </Page>
}

// export default (props) => <Page>
//   <Route path={`${props.match.path}/:artistId`} render={(matchProps) => { return <Artist {...matchProps} /> }} />
// </Page>

// const Container = (props) => {

// }
