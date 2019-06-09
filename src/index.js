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

import { Howl } from 'howler'

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

// Inspired by https://www.codespeedy.com/convert-seconds-to-hh-mm-ss-format-in-javascript/
function secondsToFormattedString (totalSeconds) {
  // let hours = Math.floor(totalSeconds / 3600)
  totalSeconds %= 3600
  let minutes = Math.floor(totalSeconds / 60) + ''
  let seconds = Math.floor(totalSeconds % 60) + ''
  return `${minutes.padStart(2, '0')}:${seconds.padStart(2, '0')}`
}

const flamous = app(
  {
    currentTime: 0,
    isPlaying: false,
    currentSongData: {},
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

        actions.setPlayingContext({
          songList: featuredData.songs
        })

        actions.setState({
          featured: featuredData,
          isLoadingFeatured: false
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
    setPlayingContext: (options) => (state, actions) => {
      let { songList, play: indexToPlay } = options
      let { auth: { s3BasePath } } = state
      let songToPlay = songList[indexToPlay || 0]
      let audioUrl = `${s3BasePath}/${songToPlay.audioSource}`

      let strings = songToPlay.audioSource.split('/')
      let imageUrl = `${s3BasePath}/${strings[0]}/${strings[1]}/${strings[2]}/coverImage`

      let seekInterval
      let audio = new Howl({
        src: audioUrl,
        format: ['mp3'],
        html5: true,
        onplay: function onplay () {
          let duration = audio.duration()
          actions.setState({ duration: secondsToFormattedString(duration) })
          seekInterval = window.setInterval(function updateSeekPosition () {
            let currentSeek = audio.seek()
            actions.setState({
              currentTime: secondsToFormattedString(Math.round(currentSeek)),
              songProgress: currentSeek / duration
            })
          }, 333)
        },
        onpause: function clearSeekInterval () {
          window.clearInterval(seekInterval)
        },
        onend: function clearSeekInterval () {
          window.clearInterval(seekInterval)
        }
      })

      if (typeof indexToPlay !== 'undefined') {
        audio.play()
      }

      return {
        audio,
        imageUrl,
        isPlaying: typeof indexToPlay !== 'undefined',
        currentSongData: songToPlay
      }
    },
    togglePlay: () => (state, actions) => {
      if (state.isPlaying) actions.pause()
      else actions.play()
    },
    play: (index) => (state, actions) => {
      let { audio } = state
      audio.play()

      return {
        isPlaying: true
      }
    },
    pause: () => (state) => {
      let { audio } = state
      audio.pause()
      return {
        isPlaying: false
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
      <audio id='my-audio' />
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
