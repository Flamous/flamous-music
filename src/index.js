import { h, app } from 'hyperapp'
import Amplitude from 'amplitudejs'
import picostyle from 'picostyle'
import ScrubBar from './components/ScrubBar.js'
import Home from './components/Home.js'
import songList from './songs.js'
import placeholder from './public/song_placeholder.svg'
import Page from './components/Page.js'
import About from './elements/About'
import nativeWebApp from 'native-web-app'
import '../node_modules/native-web-app/native.css'

import { location, Route } from '@hyperapp/router'
import PlaylistView from './components/PlaylistView.js'

nativeWebApp()

window.Amplitude = Amplitude

const style = picostyle(h)

const AppShell = style('div')({
  height: '100%',
  width: '100%',
  position: 'relative',
  overflow: 'hidden'
})

Amplitude.setDebug(true)
Amplitude.init({
  songs: songList,
  default_album_art: placeholder,
  callbacks: {
    song_change: () => {
      let meta = JSON.parse(JSON.stringify(Amplitude.getActiveSongMetadata())) // Deep copy so we don't modify the original object
      let image = new window.Image()

      if (meta.cover_art_url) {
        image.src = meta.cover_art_url

        if (!image.complete) {
          meta.cover_art_url = placeholder
          image.onload = () => {
            meta.cover_art_url = image.src
            flamous.updateMetaData(meta)
          }
        }
      }

      flamous.updateMetaData(meta)
    },
    before_play: () => {
      flamous.setPlayState(true)
    },
    before_pause: () => {
      flamous.setPlayState(false)
    }
  }
})

const flamous = app(
  {
    location: location.state,
    playingState: false,
    playingContext: {
      artist: songList[0].artist,
      name: songList[0].name,
      cover_art_url: songList[0].cover_art_url || Amplitude.getDefaultAlbumArt(),
      id: 0
    },
    pages: []
  },
  {
    location: location.actions,
    playPause: () => {
      if (!Amplitude.audio().paused) {
        Amplitude.pause()
      } else {
        Amplitude.play()
      }
    },
    updateMetaData: (metaData) => {
      if ('mediaSession' in navigator) {
        navigator.mediaSession.metadata = new window.MediaMetadata({
          title: metaData.name,
          artist: metaData.artist,
          artwork: [{
            src: metaData.cover_art_url
          }]
        })
      }

      return {
        playingContext: {
          artist: metaData.artist,
          name: metaData.name,
          cover_art_url: metaData.cover_art_url || Amplitude.getDefaultAlbumArt(),
          id: metaData.id
        }
      }
    },
    addPage: (page) => (state) => {
      state.pages.push(page)
      // console.log(state)
      return {
        pages: state.pages
      }
    },
    killPage: () => (state) => {
      state.pages.pop()

      return {
        pages: state.pages
      }
    },
    setPlayState: (isPlaying) => {
      return {
        playingState: isPlaying
      }
    }
  },
  ({playingContext, playingState, pages}) =>
    <AppShell key='container'>
      <Home key='home' playingId={playingContext.id} playingState={playingState} />
      <ScrubBar
        key='scrub-bar'
        playingState={playingState}
        artist={playingContext.artist}
        name={playingContext.name}
        image={playingContext.cover_art_url} />

      <Route path='/playlists' render={() => <PlaylistView playingId={playingContext.id} playingState={playingState} />} />
      <Route path='/about' render={About} />
    </AppShell>,
  document.body
)

if ('mediaSession' in navigator) {
  navigator.mediaSession.metadata = new window.MediaMetadata({
    title: songList[0].name,
    artist: songList[0].artist,
    artwork: [{
      src: songList[0].cover_art_url
    }]
  })

  navigator.mediaSession.setActionHandler('play', Amplitude.play)
  navigator.mediaSession.setActionHandler('pause', Amplitude.pause)
  navigator.mediaSession.setActionHandler('previoustrack', Amplitude.prev)
  navigator.mediaSession.setActionHandler('nexttrack', Amplitude.next)
}

window.flamous = flamous

location.subscribe(flamous.location)
