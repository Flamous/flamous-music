import 'babel-polyfill'
import { h, app as _app } from 'hyperapp'
import picostyle from 'picostyle'

import nativeWebApp from 'native-web-app'
import '../node_modules/native-web-app/native.css'

import { location, Route } from '@hyperapp/router'
import { withContext } from 'hyperapp-context'

import UIViewRoute from './components/UI/UIViewRoute'
import UIView from './components/UI/UIView'
import UITabBar from './components/UI/UITabBar'

import AlbumView from './components/AlbumView.js'
import ArtistView from './components/ArtistView.js'

import Library from './components/pages/Library'
import Auth from '@aws-amplify/auth'
import Login from './components/pages/Login'
import Home from './components/Home.js'
import MusicKit from './components/MusicKit'

Auth.configure({
  region: 'eu-central-1',
  userPoolId: 'eu-central-1_KdCd2PTrR',
  identityPoolId: 'eu-central-1:9e280996-fa9d-4498-a11e-a0f39e2ffd30',
  userPoolWebClientId: '9qh23krli4gbgrsuveg0jc9bm'

})

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
    auth: {
      isAuthenticated: false,
      cognitoUser: null
    },
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
    },
    login: {
      errorMessage: '',
      isLoggedIn: false,
      hasSubmittedEmail: false,
      hasSubmittedAuthCode: false,
      email: '',
      password: '',
      authCode: ''
    }
  },
  {
    auth: {
      isAuthenticated (obj) {
        return {
          isAuthenticated: !!obj,
          cognitoUser: obj || null
        }
      }
    },
    login: {
      update (data) {
        return data
      }
    },
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
        let { viewName, path, Component } = options
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
    let context = Object.assign({}, state, { actions: actions })
    delete context.scrubBar

    setContext(context)
    return <AppShell oncreate={() => { window.flamous.checkForUpdate(); window.setInterval(window.flamous.checkForUpdate, 7200000) }}>
      <UITabBar />

      <UIViewRoute path='/' exact render={Home} viewName='home' />
      <UIViewRoute path='/artists' parent render={ArtistView} viewName='home' />
      <UIViewRoute path='/albums' parent render={AlbumView} viewName='home' />
      <UIViewRoute path='/music-kit' render={MusicKit} viewName='music-kit' />
      <UIViewRoute path='/library' render={Library} viewName='library' />

      <UIView displayView='home' />
      <UIView displayView='music-kit' />
      <UIView displayView='library' />

      <Route path='/login' render={Login} />
      <Route path='/signup' render={Login} />
    </AppShell>
  },
  document.body
)

// if ('mediaSession' in navigator) {
//   navigator.mediaSession.metadata = new window.MediaMetadata({
//     title: '',
//     artist: '',
//     artwork: [{
//       src: ''
//     }]
//   })

// navigator.mediaSession.setActionHandler('play', )
// navigator.mediaSession.setActionHandler('pause', )
// navigator.mediaSession.setActionHandler('previoustrack', )
// navigator.mediaSession.setActionHandler('nexttrack', )
// }

window.flamous = flamous

location.subscribe(flamous.location)

Auth.currentAuthenticatedUser()
  .then((result) => {
    flamous.auth.isAuthenticated(result)
  })
  .catch((error) => {
    console.info(error)
  })
