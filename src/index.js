/** @jsx h */
import regeneratorRuntime from 'regenerator-runtime'
import { h, app as _app } from 'hyperapp'

import nativeWebApp from 'native-web-app'
import { location } from '@hyperapp/router'
import { withContext } from 'hyperapp-context'

import UITabBar from './components/UI/UITabBar'
import UIActionMenu from './components/UI/UIActionMenu'

// Modules
import registerServiceWorker from './modules/serviceWorker'
import auth from './modules/auth'
import views from './modules/views'
import actionMenu from './modules/actionMenu'
import device from './modules/device'

import gqlApi from './components/functions/gqlApi'
import { getFeatured } from './graphql/queries'
import './config'
import './global.css'
import './normalize.css'

import('./long-press-event.js').then((what) => {})
let Routes = import('./components/Routes.js')

window.regeneratorRuntime = regeneratorRuntime

nativeWebApp()
registerServiceWorker()

window.addEventListener('beforeinstallprompt', function (event) {
  // Prevent Chrome 67 and earlier from automatically showing the prompt
  event.preventDefault()
  window.installPrompt = event
})

const app = withContext(_app)

const flamous = app(
  {
    player: {
      isPlaying: false,
      audio: document.getElementById('my-audio'),
      currentSongData: {}
    },
    isLoadingFeatured: true,
    Routes: null,
    auth: auth.state,
    views: views.state,
    actionMenu: actionMenu.state,
    shareAPI: Boolean(navigator.share),
    initialLoad: true,
    location: location.state,
    updateAvailable: false,
    imageViewer: {
      isActive: false,
      bounds: null,
      image: null
    },
    login: {
      errorMessage: '',
      isLoggedIn: false,
      hasSubmittedEmail: false,
      hasSubmittedAuthCode: false,
      email: '',
      password: '',
      authCode: '',
      isLoading: false
    },
    new: {
      album: {
        songs: [],
        title: null,
        isLoading: false,
        activeEdit: -1
      }
    }
  },
  {
    init: () => async (state, actions) => {
      actions.auth.init()

      try {
        let featuredData = await gqlApi({
          operation: getFeatured,
          authMode: 'AWS_IAM'
        })

        actions.setState({
          currentSongData: featuredData.songs[0],
          featured: featuredData,
          isLoadingFeatured: false,
          player: {
            audio: document.getElementById('my-audio')
          }
        })
      } catch (error) {
        console.error('Flamous: Could not load featured data --> ', error)
      }
    },
    auth: auth.actions,
    views: views.actions,
    actionMenu: actionMenu.actions,
    login: {
      update (data) {
        return data
      }
    },
    location: location.actions,
    getState: () => state => state,
    setInitialLoad: (boolean) => {
      return {
        initialLoad: boolean
      }
    },
    play: (index) => (state) => {
      let song = state.featured.songs[index]

      state.player.audio.src = `${state.auth.s3BasePath}/${(song && song.audioSource) || state.currentSongData.audioSource}`
      state.player.audio.play()

      if (song) {
        return {
          currentSongData: {
            ...song,
            index
          },
          player: {
            ...state.player,
            isPlaying: true
          }
        }
      } else {
        return {
          player: {
            ...state.player,
            isPlaying: true
          }
        }
      }
    },
    pause: () => (state) => {
      state.player.audio.pause()
      return {
        player: {
          ...state.player,
          isPlaying: false
        }
      }
    },
    new: {
      album: {
        update (data) {
          return data
        }
      }
    },
    setState: (newState) => {
      return { ...newState }
    }
  },
  (state, actions) => (_, setContext) => {
    let context = Object.assign({}, state, { actions: actions })
    delete context.scrubBar

    setContext(context)
    return <div class={device.isStandalone ? 'standalone' : 'not-standalone'} style={{ display: 'contents' }}>
      <UITabBar />
      <audio id='my-audio'></audio>
      { state.Routes && <state.Routes /> }
      {
        state.actionMenu.isOpen && <UIActionMenu {...state.actionMenu} />
      }
    </div>
  },
  document.body
)

window.flamous = flamous
flamous.init()

Routes.then((result) => {
  flamous.setState({
    Routes: result.default
  })
})

location.subscribe(flamous.location)

if ('scrollRestoration' in window.history) {
  window.history.scrollRestoration = 'manual'
}
