import { h } from 'hyperapp'
import picostyle from 'picostyle'
import Page from './Page'
import Header, { HeaderBold, HeaderImage } from './Header'
import { Route, Link } from '@hyperapp/router'
import LazyLoad from 'vanilla-lazyload'
import SongList from './SongList'
// import profilePic from '../assets/wowa.jpg'
import artists from '../artists'

import wowaSongs from '../songs/wowa'
import kimikoSongs from '../songs/kimiko_ishizaka'

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
  transition: 'transform 500ms',
  maxWidth: '320px',
  '&:hover': {
    transform: 'scale(1.05)'
  },
  '& > img': {
    width: '100%',
    borderRadius: '3px',
    borderRight: '2px solid #636363',
    boxShadow: 'rgba(0, 0, 0, 0.3) 0px 4px 25px 1px',
    transition: 'box-shadow 500ms'
  },
  '&:hover img': {
    boxShadow: 'rgba(0, 0, 0, 0.3) 0px 6px 35px 0px'
  }
})
const AlbumThumbnail = (props) => {
  return <StyledAlbumThumbnail to={`/albums/${props.id}`}>
    <img src={props.image} />
    <p style={{textAlign: 'center'}}>
      {props.name}
    </p>
  </StyledAlbumThumbnail>
}

const StyledAlbumList = style('div')({})
const AlbumList = (props) => {
  return <StyledAlbumList>
    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
      <h3 style={{paddingLeft: '1.5em', fontWeight: 'bold'}}>Albums</h3>
      {/* <PlayAllButton title='Shuffle' /> */}
    </div>
    <div style={{display: 'flex', flexWrap: 'wrap'}}>
      {props.albums.map((album) => {
        console.log(album)
        return <AlbumThumbnail id={album.amplitudeName} image={album.songs[0].cover_art_url} name={album.name} amplitudeName={album.amplitudeName} />
      })}
    </div>
  </StyledAlbumList>
}

let Artist = (props) => (context) => {
  let {playingState, playingContext: {id}} = context
  let artist
  let songs
  let albums

  switch (props.match.params.artistId) {
    case 'wowa':
      artist = artists[0]
      songs = wowaSongs
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
        }
      ]
      // import('../songs/kimiko_ishizaka').then((res) => {
      //   songs = res.default
      // })
      break
  }

  let out = artist
    ? <div key={props.match.params.artistId} oncreate={initLazyLoad} onremove={removeLazyLoad} onupdate={updateLazyLoad}>
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

      {songs && <SongList songs={songs} />}
      {albums && <AlbumList albums={albums} />}
    </div>
    : <div>
      <h2>Artist not found</h2>
    </div>

  return out
}

export default (props) => <Page>
  <Route path={`${props.match.path}/:artistId`} render={(matchProps) => { return <Artist {...matchProps} /> }} />
</Page>
