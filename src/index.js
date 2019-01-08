/** @jsx h */
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
import views from './modules/views'

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
    auth: auth.state,
    views: views.state,
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
        title: null,
        isLoading: false
      }
    }
  },
  {
    auth: auth.actions,
    views: views.actions,
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
