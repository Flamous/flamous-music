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
    padding: '1em',
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
  height: '4em',
  width: '4em',
  marginRight: '1em',
  transition: 'opacity 350ms 300ms',
  ':not([src])': {
    opacity: '0'
  }
})

const ListItem = (props) => {
  return <li {...props} class='song-list-item'>
    <Thumbnail src={props.image} />
    <div>
      <h3>{props.title}</h3>
      <p>{props.sub}</p>
    </div>
  </li>
}

const SongList = (props) => {
  return <SongListStyle>
    <ul>
      {
        props.songs.map((song, index) => {
          return <ListItem onclick={() => { console.log(song.id); window.Amplitude.playSongAtIndex(song.id) }} key={song.id} title={song.name} image={song.cover_art_url} sub={song.artist} />
        })
      }
    </ul>
  </SongListStyle>
}

const Album = (props) => {
  return props.match.params.artistId === 'wowa'
    ? <div oncreate={initLazyLoad} onremove={removeLazyLoad} onupdate={updateLazyLoad}>
      <Header title='Wowa' back={{text: 'Back', to: '/'}} />
      <SongList songs={songs} />
    </div>
    : <h2>Artist not found</h2>
}

export default (props) => <Page>

  <Route parent path={`${props.match.path}/:artistId`} render={(matchProps) => { console.log(matchProps); return <Album {...matchProps} /> }} />
</Page>
