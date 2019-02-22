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
import Login from './components/pages/Login'
import Home from './components/Home.js'
import registerServiceWorker from './modules/serviceWorker'
import NewAlbum from './components/pages/NewAlbum'
import AlbumDetails from './components/pages/AlbumDetails'
import License from './components/pages/License'
import ChangePassword from './components/pages/ChangePassword'
import Player from './components/pages/Player'
import AlbumEditor from './components/pages/AlbumEditor'

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
        songs: [],
        title: null,
        isLoading: false
      }
    }
  },
  {
    init: () => (state, actions) => {
      actions.auth.init()
    },
    auth: auth.actions,
    views: views.actions,
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
      <UIViewRoute path='/library' render={Library} viewName='library' />
      <UIViewRoute path='/profile' render={Profile} viewName='profile' />
      <UIViewRoute path='/settings/change-password' render={ChangePassword} viewName='profile' exact />
      <UIViewRoute path='/albums/:albumId' exact render={AlbumDetails} viewName='profile' />

      <UIView displayView='home' />
      <UIView displayView='profile' />
      <UIView displayView='library' />

      <Route path='/login' render={Login} />
      <Route path='/signup' render={Login} />
      <Route path='/player' render={Player} />

      <Route path='/flamous-license' render={License} />
      <Route path='/create-album' render={NewAlbum} />
      <Route path='/album-editor' render={AlbumEditor} />
    </div>
  },
  document.body
)

window.flamous = flamous
flamous.init()

location.subscribe(flamous.location)
