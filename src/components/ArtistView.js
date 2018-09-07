import { h } from 'hyperapp'
import picostyle from 'picostyle'
import Page from './Page'
import Header from './Header'
import { Route } from '@hyperapp/router'
import LazyLoad from 'vanilla-lazyload'
import LazyImage from './LazyImage'

import songs from '../songs'

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
  },
  ' .song-list-item:active': {
    transition: 'opacity 70ms',
    opacity: '0.6'
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

const ListItem = (props) => {
  return <li {...props} class='song-list-item'>
    <Thumbnail src={props.image} />
    <div>
      <p style={{fontWeight: 'bold'}}>{props.title}</p>
      <p>{props.sub}</p>
    </div>
  </li>
}

const SongList = (props) => {
  return <SongListStyle>
    <ul>
      {
        props.songs.map((song, index) => {
          return <ListItem onclick={() => { window.Amplitude.playSongAtIndex(song.id) }} key={song.id} title={song.name} image={song.cover_art_url} sub={song.artist} />
        })
      }
    </ul>
  </SongListStyle>
}

const Album = (props) => {
  return props.match.params.artistId === 'wowa'
    ? <div oncreate={initLazyLoad} onremove={removeLazyLoad} onupdate={updateLazyLoad}>
      <Header title='Wowa' back={{text: 'Back', to: '/'}} />
      <p style={{paddingLeft: '1.5em', fontWeight: 'bold'}}>Singles</p>
      <SongList songs={songs} />
    </div>
    : <h2>Artist not found</h2>
}

export default (props) => <Page>

  <Route path={`${props.match.path}/:artistId`} render={(matchProps) => { return <Album {...matchProps} /> }} />
</Page>
