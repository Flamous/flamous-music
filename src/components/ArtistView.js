import { h } from 'hyperapp'
import picostyle from 'picostyle'
import Page from './Page'
import Header, { HeaderBold, HeaderImage } from './Header'
import { Route, Link } from '@hyperapp/router'
import LazyLoad from 'vanilla-lazyload'
import LazyImage from './LazyImage'
// import profilePic from '../assets/wowa.jpg'
import playImage from '../public/play_white.svg'
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

const ShuffleButtonStyle = style('span')({
  borderRadius: '10px',
  backgroundColor: '#007AFF',
  backgroundImage: 'linear-gradient(to top, rgb(0, 122, 255), rgb(59, 153, 255))',
  color: 'white',
  padding: '0.6em 1em',
  marginRight: '1em',
  fontWeight: 'bold',
  transition: 'opacity 70ms 70ms',
  border: '1px solid rgba(0, 0, 0, 0.1)',
  ':active': {
    backgroundColor: 'rgb(59, 153, 255)',
    backgroundImage: 'linear-gradient(to top, rgb(0, 122, 255), rgb(32, 139, 255))'
  }
})

const PlayAllButton = (props) => {
  return <ShuffleButtonStyle onclick={() => {
    !window.Amplitude.getShuffle() && window.Amplitude.setShuffle()
    window.Amplitude.next()
    window.Amplitude.play()
  }}>
    <img src={playImage} style={{paddingRight: '0.35em'}} />
    Shuffle All
  </ShuffleButtonStyle>
}

const SongListStyle = style('div')({
  transition: 'opacity 70ms',
  ' ul': {
    listStyleType: 'none',
    padding: '0'
  },
  ' .song-list-item': {
    display: 'flex',
    padding: '0.6em 1em 0.6em 1.5em',
    alignItems: 'center'
  },
  ' .song-list-item *:not(img)': {
    margin: '0'
  }
})

const Thumbnail = style(LazyImage)({
  height: '3.3em',
  width: '3.3em',
  marginRight: '0.8em',
  transition: 'opacity 350ms 300ms',
  ':not([src])': {
    opacity: '0'
  }
})

const StyledListItem = style('li')({
  transition: 'background-color 100ms',
  '&:hover': {
    backgroundColor: '#fafafa'
  },
  '&:active': {
    backgroundColor: '#f0f0f0',
    transform: 'scale(0.95)',
    opacity: '0.7'
  }
})

const ListItem = (props) => {
  return <StyledListItem {...props} class='song-list-item'>
    <Thumbnail src={props.image} />
    <div>
      <p style={{fontWeight: 'bold'}}>{props.title}</p>
      <p>{props.sub}</p>
    </div>
  </StyledListItem>
}

const SongList = (props) => {
  return <SongListStyle>
    <ul>
      {
        props.songs.map((song, index) => {
          return <ListItem onclick={() => {
            window.Amplitude.getShuffle() && window.Amplitude.setShuffle(false)
            window.Amplitude.playSongAtIndex(index)
          }} key={song.id} title={song.name} image={song.cover_art_url} sub={song.artist} />
        })
      }
    </ul>
  </SongListStyle>
}

let Album = (props) => (context) => {
  let {playingState, playingContext: {id}} = context
  let artist
  let songs

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
      songs = kimikoSongs
      // import('../songs/kimiko_ishizaka').then((res) => {
      //   songs = res.default
      // })
      break
  }

  let out = artist
    ? <div oncreate={initLazyLoad} onremove={removeLazyLoad} onupdate={updateLazyLoad}>
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
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <h3 style={{paddingLeft: '1.5em', fontWeight: 'bold'}}>Singles</h3>
        <PlayAllButton />
      </div>
      <Link to='/about'>Demo Link (About)</Link>
      <SongList songs={songs} />
    </div>
    : <div>
      <h2>Artist not found</h2>
    </div>

  return out
}

export default (props) => <Page>
  <Route path={`${props.match.path}/:artistId`} render={(matchProps) => { return <Album {...matchProps} /> }} />
</Page>
