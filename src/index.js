import regeneratorRuntime from 'regenerator-runtime'
import { h, app as _app } from 'hyperapp'

import nativeWebApp from 'native-web-app'

import { location, Route } from '@hyperapp/router'
import { withContext } from 'hyperapp-context'

import UIViewRoute from './components/UI/UIViewRoute'
import UIView from './components/UI/UIView'
import UITabBar from './components/UI/UITabBar'

import Library from './components/pages/Library'
import Profile from './components/pages/Profile'
import Auth from '@aws-amplify/auth'
import PubSub from '@aws-amplify/pubsub'
import Login from './components/pages/Login'
import Home from './components/Home.js'
import MusicKit from './components/MusicKit'
import registerServiceWorker from './modules/serviceWorker'
import NewAlbum from './components/pages/NewAlbum'
import AlbumDetails from './components/pages/AlbumDetails'
import License from './components/pages/License'

// Modules
import auth from './modules/auth'

import './config'

import('./normalize.css').then(() => {})
import('./global.css').then(() => {})

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
    ...auth.state,
    initialLoad: true,
    location: location.state,
    updateAvailable: false,
    imageViewer: {
      isActive: false,
      bounds: null,
      image: null
    },
    views: {
      stacks: {
        home: {
          stack: [
            {
              viewName: 'home',
              path: '/',
              Component: Home
            }
          ],
          root: '/'
        },
        'music-kit': {
          stack: [
            {
              viewName: 'music-kit',
              path: '/music-kit',
              Component: MusicKit
            }
          ],
          root: '/music-kit'
        },
        library: {
          stack: [
            {
              viewName: 'library',
              path: '/library',
              Component: Library
            }
          ],
          root: '/library'
        }
      },
      activeView: 'home'
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
        title: null,
        isLoading: false
      }
    }
  },
  {
    ...auth.actions,
    login: {
      update (data) {
        return data
      }
    },
    location: location.actions,
    update: () => async ({ updateWorker, updateAvailable }) => {
      console.info('Updating...')
      let registration = await navigator.serviceWorker.getRegistration()
      registration.waiting.postMessage('skipWaiting')
    },
    getState: () => state => state,
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
      add: (options) => (state, views) => {
        let { viewName, path, Component, silent } = options
        let stacks = { ...state.stacks }
        let { activeView } = state
        let stackInQuestion = stacks[viewName].stack

        if (stackInQuestion.length > 0 && path === stackInQuestion[stackInQuestion.length - 1].path) {
          if (activeView !== viewName) {
            return { activeView: viewName }
          }
          return
        }

        if (stackInQuestion.length > 1 && path === stackInQuestion[stackInQuestion.length - 2].path) {
          stackInQuestion.pop()

          return {
            stacks,
            activeView: viewName
          }
        }

        if (silent) {
          stackInQuestion.unshift({
            viewName,
            path,
            Component
          })
        } else {
          stackInQuestion.push({
            viewName,
            path,
            Component
          })
        }

        return {
          stacks,
          activeView: viewName
        }
      },
      // The same logic as UIBackButton but as API
      back: (options = {}) => (state) => {
        let { to, replace, back } = options
        let { activeView, stacks } = state

        let parentViewStack = stacks[activeView].stack
        let previousViewStackPath = parentViewStack.length > 1 && parentViewStack[parentViewStack.length - 2].path

        let { location } = window.flamous.getState()
        let isBrowserHistoryBack = location.previous === previousViewStackPath

        to = to || (previousViewStackPath || `/${activeView}`)
        replace = replace || !isBrowserHistoryBack
        back = back || isBrowserHistoryBack

        if (!replace && !back) {
          window.history.pushState(location.pathname, '', to)
          return
        }
        if (replace) {
          window.history.replaceState(location.previous, '', to)
          return
        }
        if (back) window.history.back()
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
    },
    new: {
      album: {
        update (data) {
          return data
        }
      }
    }
  },
  (state, actions) => (_, setContext) => {
    let context = Object.assign({}, state, { actions: actions })
    delete context.scrubBar

    setContext(context)
    return <div style={{ display: 'contents' }}>
      <UITabBar />

      <UIViewRoute path='/' exact render={Home} viewName='home' />
      {/* <UIViewRoute path='/albums' parent render={AlbumView} viewName='home' /> */}
      <UIViewRoute path='/license' render={License} viewName='home' />
      <UIViewRoute path='/music-kit' render={MusicKit} viewName='music-kit' />
      <UIViewRoute path='/library' render={Library} viewName='library' />
      <UIViewRoute path='/profile' render={Profile} viewName='library' />
      <UIViewRoute path='/albums/:albumId' exact render={AlbumDetails} viewName='library' />

      <UIView displayView='home' />
      <UIView displayView='music-kit' />
      <UIView displayView='library' />

      <Route path='/login' render={Login} />
      <Route path='/signup' render={Login} />

      <Route path='/create-album' render={NewAlbum} />
    </div>
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
    flamous.auth.fetchUserInfo()
  })
  .catch((error) => {
    console.info(error)
  })
