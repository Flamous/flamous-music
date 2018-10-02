import { h, app as _app } from 'hyperapp'
import Amplitude from 'amplitudejs'
import picostyle from 'picostyle'
import ScrubBar from './components/ScrubBar.js'
import Home from './components/Home.js'
import songList from './songs/wowa.js'
import placeholder from './public/song_placeholder.svg'
import About from './elements/About'
import nativeWebApp from 'native-web-app'
import '../node_modules/native-web-app/native.css'
import 'babel-polyfill'

import { location, Route } from '@hyperapp/router'
import PlaylistView from './components/PlaylistView.js'
import ArtistView from './components/ArtistView.js'

import ImageViewer from './components/ImageViewer.js'
import StreamView from './components/StreamView.js'

import { withContext } from 'hyperapp-context'

const app = withContext(_app)

nativeWebApp()

window.addEventListener('touchend', unlockiOSAudio)

function unlockiOSAudio () { // On iOs, audio has to be unlocked first by a user action. Thanks to Simon_Weaver on StackOverflow: https://stackoverflow.com/questions/12517000/no-sound-on-ios-6-web-audio-api
  window.AudioContext = window.AudioContext || window.webkitAudioContext
  var context = new window.AudioContext()

  // create a dummy sound - and play it immediately in same 'thread'
  var oscillator = context.createOscillator()
  oscillator.frequency.value = 400
  oscillator.connect(context.destination)
  oscillator.start(0)
  oscillator.stop(0)

  console.info('Unlocked audio (for iOS devices)')
  window.removeEventListener('touchend', unlockiOSAudio)
}

if ('serviceWorker' in navigator) {
  // Use the window load event to keep the page load performant
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./serviceWorker.js')
      .then(function (registration) { // Track updates to the Service Worker.
        if (!navigator.serviceWorker.controller) return

        // When the user asks to refresh the UI, we'll need to reload the window
        let refreshing
        navigator.serviceWorker.addEventListener('controllerchange', function (event) {
          if (refreshing) return
          refreshing = true
          window.location.reload()
        })

        function listenInstalledStateChange () {
          registration.installing.addEventListener('statechange', function (event) {
            if (event.target.state === 'installed') {
              // A new service worker is available, inform the user
              window.flamous.updateAvailable(registration)
            }
          })
        }
        if (registration.waiting) return window.flamous.updateAvailable(registration)

        if (registration.installing) return listenInstalledStateChange()

        registration.addEventListener('updatefound', listenInstalledStateChange)
      })
  })
}

window.Amplitude = Amplitude

const style = picostyle(h)

const AppShell = style('div')({
  display: 'fixed',
  left: '0',
  width: '100%',
  height: '100%',
  top: '100%'
})

Amplitude.setDebug(true)
Amplitude.init({
  songs: songList,
  default_album_art: placeholder,
  shuffle_on: 'false',
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
            flamous.playingContext.updateMetaData(meta)
          }
        }
      }

      flamous.playingContext.updateMetaData(meta)
    },
    before_play: () => {
      flamous.setPlayState(true)
    },
    before_pause: () => {
      flamous.setPlayState(false)
    }
  }
})

window.Amplitude.getShuffle() && window.Amplitude.setShuffle(false)
window.Amplitude.playSongAtIndex(0)
window.Amplitude.pause()

const flamous = app(
  {
    location: location.state,
    playingState: false,
    playingContext: {
      artist: songList[0].artist,
      name: songList[0].name,
      cover_art_url: songList[0].cover_art_url || Amplitude.getDefaultAlbumArt(),
      id: 0,
      duration: 0
    },
    playbackTime: 0,
    pages: [],
    updateAvailable: false,
    imageViewer: {
      isActive: false,
      bounds: null,
      image: null
    },
    streamView: {
      isActive: false
    }
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
    },
    updateAvailable: () => (state) => {
      state.updateAvailable = true
      console.info('New update available')
      return {
        updateAvailable: true
      }
    },
    checkForUpdate: () => async (state, {updateAvailable}) => {
      console.info('Checking for updates...')

      let registration = await navigator.serviceWorker.getRegistration()
      registration.update()
    },
    update: () => async ({updateWorker, updateAvailable}) => {
      console.info('Updating...')
      let registration = await navigator.serviceWorker.getRegistration()
      registration.waiting.postMessage('skipWaiting')
    },
    getState: () => state => state,
    imageViewer: {
      showImageViewer: (data) => {
        // console.log('data: ', data)
        return {
          isActive: true,
          image: data.image,
          bounds: data.bounds
        }
      },
      hideImageViewer: () => {
        return {
          isActive: false
        }
      }
    },
    streamView: {
      show: () => {
        return {
          isActive: true
        }
      },
      hide: () => {
        return {
          isActive: false
        }
      }
    },
    setTime: (time) => {
      return {
        playbackTime: time
      }
    },
    playingContext: {
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
          artist: metaData.artist,
          name: metaData.name,
          cover_art_url: metaData.cover_art_url || Amplitude.getDefaultAlbumArt(),
          id: metaData.id
        }
      },
      setDuration: (duration) => {
        return {
          duration
        }
      }
    }
  },
  (state, actions) => (context, setContext) => {
    let {playingContext, playingState, updateAvailable, imageViewer, playbackTime} = state
    setContext(state)
    return <AppShell oncreate={() => { window.flamous.checkForUpdate(); window.setInterval(window.flamous.checkForUpdate, 7200000) }}>
      <Home key='home' updateAvailable={updateAvailable} playingId={playingContext.id} playingState={playingState} />
      <ScrubBar
        key='scrub-bar'
        playbackTime={playbackTime}
        playingState={playingState}
        artist={playingContext.artist}
        name={playingContext.name}
        image={playingContext.cover_art_url}
        duration={playingContext.duration} />

      <Route path='/playlists' render={() => <PlaylistView playingId={playingContext.id} playingState={playingState} />} />
      <Route parent path='/artist' render={(props) => <ArtistView {...props} playingId={playingContext.id} playingState={playingState} />} />
      <Route path='/about' render={() => <About updateAvailable={updateAvailable} />} />
      {/* <Route path='/stream-view' render={() => <StreamView playbackTime={playbackTime} playingContext={playingContext} playingState={playingState} />} /> */}
      <Route path='/stream-view' render={() => <StreamView playbackTime={playbackTime} playingContext={playingContext} playingState={playingState} />} />

      {
        imageViewer.isActive && <ImageViewer image={imageViewer.image} bounds={imageViewer.bounds} />
      }
      {
        // TODO: Use Hyperapp nestables context to pass the playingContext!
        // streamView.isActive && <StreamView playbackTime={playbackTime} playingContext={playingContext} playingState={playingState} />
      }
    </AppShell>
  },
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
console.log(flamous.getState())

window.Amplitude.audio().addEventListener('timeupdate', (event) => {
  window.flamous.setTime(event.target.currentTime)
})
window.Amplitude.audio().addEventListener('durationchange', (event) => {
  window.flamous.playingContext.setDuration(event.target.duration)
})

location.subscribe(flamous.location)
