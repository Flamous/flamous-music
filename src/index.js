import { h, app as _app } from 'hyperapp'
import picostyle from 'picostyle'
import TrackBar from './components/TrackBar.js'
import Home from './components/Home.js'

import placeholder from './public/song_placeholder.svg'
import About from './elements/About'
import nativeWebApp from 'native-web-app'
import '../node_modules/native-web-app/native.css'
import 'babel-polyfill'

import { location, Route, Link } from '@hyperapp/router'
import ArtistView from './components/ArtistView.js'

import ImageViewer from './components/ImageViewer.js'
import StreamView from './components/StreamView.js'

import { withContext } from 'hyperapp-context'
import SongSubmit from './elements/SongSubmit.js'
import AlbumView from './components/AlbumView.js'
import FAQ from './elements/FAQ'
import HowTo from './elements/HowTo'
import PageRoute from './components/PageRoute'
import UIViewGroup from './components/UI/UIViewGroup'
import UIView from './components/UI/UIView'
import UIPage from './components/UI/UIPage'
import TestPage from './components/TestPage'
import UITabBar from './components/UI/UITabBar'
import MusicKit from './components/MusicKit'
import UIViewRoute from './components/UI/UIViewRoute'

const app = withContext(_app)

nativeWebApp()

window.addEventListener('beforeinstallprompt', function (event) {
  // Prevent Chrome 67 and earlier from automatically showing the prompt
  event.preventDefault()
  window.installPrompt = event
})

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

const style = picostyle(h)

const AppShell = style('div')({
  display: 'contents',
  left: '0',
  width: '100%',
  height: '100%',
  top: '100%'
})

const flamous = app(
  {
    initialLoad: true,
    location: location.state,
    playingState: false,
    playingContext: {
      artist: null,
      name: null,
      cover_art_url: '',
      id: 0,
      duration: 0
    },
    playbackTime: 0,
    pages: {
      stack: []
    },
    updateAvailable: false,
    imageViewer: {
      isActive: false,
      bounds: null,
      image: null
    },
    streamView: {
      isActive: false
    },
    scrubBar: {
      visible: false
    },
    installPrompt: null,
    views: {
      stacks: {
        home: {
          stack: [],
          root: '/'
        },
        'music-kit': {
          stack: [],
          root: '/music-kit'
        },
        library: {
          stack: [],
          root: '/library'
        }
      },
      registered: [],
      activeView: 'home'
    }
  },
  {
    location: location.actions,
    playPause: () => (state, actions) => {
      if (!state.scrubBar.visible) actions.scrubBar.show()
    },
    pages: {
      add: (comp) => ({ stack }, { location }) => {
        stack.push(comp)

        return {
          stack: stack
        }
      },
      back: (setHistory = true) => ({ stack }) => {
        stack.pop()
        setHistory && window.history.back()
        return {
          stack: stack
        }
      },
      clear: () => ({ stack }) => {
        console.info('Clearing Stack')
        if (stack.length === 0) return
        return {
          stack: []
        }
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
    checkForUpdate: () => async (state, { updateAvailable }) => {
      console.info('Checking for updates...')

      let registration = await navigator.serviceWorker.getRegistration()
      registration.update()
    },
    update: () => async ({ updateWorker, updateAvailable }) => {
      console.info('Updating...')
      let registration = await navigator.serviceWorker.getRegistration()
      registration.waiting.postMessage('skipWaiting')
    },
    getState: () => state => state,
    imageViewer: {
      showImageViewer: (data) => {
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
          cover_art_url: metaData.cover_art_url,
          id: metaData.id
        }
      },
      setDuration: (duration) => {
        return {
          duration
        }
      }
    },
    scrubBar: {
      show: () => {
        return {
          visible: true
        }
      }
    },
    setInstallPromt: (prop) => {
      return {
        installPromt: prop
      }
    },
    setInitialLoad: (boolean) => {
      return {
        initialLoad: boolean
      }
    },
    views: {
      setActive: (viewName) => (state) => {
        let { stacks } = state
        let stackInQuestion = stacks[viewName].stack

        let goTo = stacks[viewName].root

        if (stackInQuestion.length > 0) {
          goTo = stackInQuestion[stacks[viewName].stack.length - 1].path // Last item
        }

        window.history.pushState({}, '', goTo)
      },
      add: (options) => (state) => {
        let { viewName, path, Component, setActive = true } = options
        let stacks = { ...state.stacks }
        let { activeView } = state
        let stackInQuestion = stacks[viewName].stack

        if (stackInQuestion.length > 0 && path === stackInQuestion[stackInQuestion.length - 1].path) {
          if (activeView !== viewName) {
            return { activeView: viewName }
          }
          return
        }

        stackInQuestion.push({
          viewName,
          path,
          Component
        })

        return {
          stacks,
          activeView: viewName
        }
      },
      remove: () => (state) => {
        let { stack } = state
        let newStack = [...stack]

        console.log(`Removing page from stack ${state.scopeId} | page: ${stack[stack.length - 1].path}`)

        newStack.pop()

        return {
          stack: newStack
        }
      }
    }
  },
  (state, actions) => (_, setContext) => {
    let { imageViewer, pages, scrubBar } = state
    let context = Object.assign({}, state, { actions: actions })
    delete context.scrubBar

    setContext(context)
    return <AppShell oncreate={() => { window.flamous.checkForUpdate(); window.setInterval(window.flamous.checkForUpdate, 7200000) }}>
      {/* <Route render={Home} /> */}

      {/* {<TrackBar key='track-bar' hidden={!scrubBar.visible} />} */}
      {/* {<TrackBar oncreate={actions.scrubBar.show} key='track-bar' hidden={!scrubBar.visible} />} */}
      <UITabBar />

      {/* <Route path='/' render={(props) => {
        actions.pages.clear()
      }} /> */}
      {/* <PageRoute parent path='/artists' render={ArtistView} />
      <PageRoute path='/about' render={About} />
      <PageRoute path='/song-submit' render={SongSubmit} />
      <PageRoute parent path='/albums' render={AlbumView} />
      <PageRoute path='/how-to' render={HowTo} />
      <PageRoute path='/faq' render={FAQ} />
      <PageRoute path='/stream-view' render={StreamView} /> */}

      <UIViewRoute path='/' exact render={Home} viewName='home' />
      <UIViewRoute path='/artists' parent render={ArtistView} viewName='home' />
      {/* <UIViewRoute path='/artists/:id' render={ArtistView} viewName='home' /> */}
      <UIViewRoute path='/albums' parent render={AlbumView} viewName='home' />

      <UIViewRoute path='/music-kit' render={MusicKit} viewName='music-kit' />

      <UIViewRoute path='/library' render={TestPage} viewName='library' />

      <UIView displayView='home' />
      <UIView displayView='music-kit' />
      <UIView displayView='library' />

      {/* <PageRoute path='/player' render={StreamView} /> */}

      {/* <UIViewGroup scope={['/', '/artists', '/albums']} root={Home}>
        <UIView route='' exact />
        <UIView route=':artistId' render={TestPage} />
        <UIView route=':albumId' render={TestPage} />
      </UIViewGroup>
      <UIViewGroup scope={['/music-kit']} root={MusicKit}>
        <UIView route='chapters/:id' render={TestPage} />
      </UIViewGroup>
      <UIViewGroup scope={['/library']} root={() => <h1>Library</h1>}>
        <UIView route='artists/:id' render={TestPage} />
      </UIViewGroup>
      <UIViewGroup scope={['/player']} root={() => <h1>Player</h1>}>
        <UIView route=':id' render={StreamView} />
      </UIViewGroup> */}

      {/* <UIViewGroup scope='/music' root={() => <h1>lel</h1>}>
        <UIPageView route='artists/:id' >
          <UIPage>
            <h1>This is a test</h1>
            <p>artists page</p>
            <Link to='/music/artists/1234'>New page 1</Link>
            <Link to='music/artists/54321'>New page 2</Link>
            <Link to='music/test/1234'>New page 3</Link>
          </UIPage>
        </UIPageView>
        <UIPageView route='test/:id' >
          <UIPage>
            <h1>This is a test</h1>
            <p>test page</p>
            <Link to='artists/1234'>New page 1</Link>
            <Link to='artists/54321'>New page 2</Link>
            <Link to='test/1234'>New page 3</Link>
          </UIPage>
        </UIPageView>
      </UIViewGroup> */}

      {/* {
        pages.stack.map((item) => {
          return item.page()
        })
      } */}

      {/* {
        imageViewer.isActive && <ImageViewer image={imageViewer.image} bounds={imageViewer.bounds} />
      } */}
    </AppShell>
  },
  document.body
)

if ('mediaSession' in navigator) {
  navigator.mediaSession.metadata = new window.MediaMetadata({
    title: '',
    artist: '',
    artwork: [{
      src: ''
    }]
  })

  // navigator.mediaSession.setActionHandler('play', )
  // navigator.mediaSession.setActionHandler('pause', )
  // navigator.mediaSession.setActionHandler('previoustrack', )
  // navigator.mediaSession.setActionHandler('nexttrack', )
}

window.flamous = flamous

location.subscribe(flamous.location)
