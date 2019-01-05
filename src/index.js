import regeneratorRuntime from 'regenerator-runtime'
import { h, app as _app } from 'hyperapp'
import picostyle from 'picostyle'

import nativeWebApp from 'native-web-app'

import { location, Route } from '@hyperapp/router'
import { withContext } from 'hyperapp-context'

import UIViewRoute from './components/UI/UIViewRoute'
import UIView from './components/UI/UIView'
import UITabBar from './components/UI/UITabBar'

import AlbumView from './components/AlbumView.js'
import ArtistView from './components/ArtistView.js'

import Library from './components/pages/Library'
import Profile from './components/pages/Profile'
import Amplify from '@aws-amplify/core'
import Auth from '@aws-amplify/auth'
import API, { graphqlOperation } from '@aws-amplify/api'
import PubSub from '@aws-amplify/pubsub'
import Login from './components/pages/Login'
import Home from './components/Home.js'
import MusicKit from './components/MusicKit'
import registerServiceWorker from './modules/serviceWorker'
import NewAlbum from './components/pages/NewAlbum'
import AlbumDetails from './components/pages/AlbumDetails'
import License from './components/pages/License'
import { getUser, getArtistAlbums } from './graphql/queries'
import { onCreatedAlbum } from './graphql/subscriptions'
import { createUser, createArtist, updateUser } from './graphql/mutations'

import('./normalize.css').then(() => {})
import('./global.css').then(() => {})

window.regeneratorRuntime = regeneratorRuntime

const isProductionContext = process.env.CONTEXT === 'production'

const API_ENDPOINT = isProductionContext
  ? process.env.API
  : process.env.DEV_API

const IDENTITY_POOL = isProductionContext
  ? process.env.IDENTITY_POOL
  : process.env.DEV_IDENTITY_POOL

const USER_POOL = isProductionContext
  ? process.env.USER_POOL
  : process.env.DEV_USER_POOL

const USER_POOL_CLIENT = isProductionContext
  ? process.env.USER_POOL_CLIENT
  : process.env.DEV_USER_POOL_CLIENT

const S3_BUCKET = isProductionContext
  ? process.env.S3_BUCKET
  : process.env.DEV_S3_BUCKET

Amplify.configure({
  aws_appsync_graphqlEndpoint: API_ENDPOINT,
  aws_appsync_region: 'eu-central-1',
  aws_appsync_authenticationType: 'AMAZON_COGNITO_USER_POOLS',
  Auth: {
    region: 'eu-central-1',
    userPoolId: USER_POOL,
    identityPoolId: IDENTITY_POOL,
    userPoolWebClientId: USER_POOL_CLIENT
  },
  Storage: {
    bucket: S3_BUCKET,
    region: 'eu-central-1'
  }
})

const app = withContext(_app)

nativeWebApp()

window.addEventListener('beforeinstallprompt', function (event) {
  // Prevent Chrome 67 and earlier from automatically showing the prompt
  event.preventDefault()
  window.installPrompt = event
})

registerServiceWorker()

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
      tries: 0,
      isAuthenticated: false,
      cognitoUser: null,
      user: null,
      albums: null,
      isLoadingAlbums: false
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
    updateAvailable: false,
    imageViewer: {
      isActive: false,
      bounds: null,
      image: null
    },
    installPrompt: null,
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
    auth: {
      update (data) {
        return data
      },
      isAuthenticated (obj) {
        return {
          isAuthenticated: !!obj,
          cognitoUser: obj || null
        }
      },
      setUserInfo (user) {
        return {
          user
        }
      },
      setUserAlbums (albums) {
        return {
          albums
        }
      },
      addAlbum: (album) => (state) => {
        let { albums } = state

        albums.push(album)

        return {
          albums
        }
      },
      fetchUserInfo: () => (state, actions) => {
        API.graphql(graphqlOperation(getUser))
          .then((userResponse) => {
            if (!userResponse.data.user) {
              API.graphql(graphqlOperation(createUser))
                .then((userData) => {
                  actions.fetchUserInfo()
                })

              return
            } else if (!userResponse.data.user.artistId) {
              API.graphql(graphqlOperation(createArtist))
                .then((result) => {
                  let artistId = result.data.createArtist.artistId
                  API.graphql(graphqlOperation(updateUser, { artistId }))
                    .then((response) => {
                      artistId && actions.fetchUserInfo()
                    })
                    .catch((error) => {
                      console.error(error)
                    })
                })

              return
            }

            actions.setUserInfo(userResponse.data.user)
            actions.update({
              isLoadingAlbums: true
            })

            API.graphql(graphqlOperation(getArtistAlbums, { artistId: userResponse.data.user.artistId }))
              .then((response) => {
                // try {
                //   API.graphql(graphqlOperation(onCreatedAlbum, { artistId: userResponse.data.user.artistId }))
                //     .subscribe({
                //       next: (albumData) => { console.log('SUBSCRIPTIONS: ' + albumData) },
                //       error: (error) => { console.error(error) }
                //     })
                // } catch (error) {
                //   console.error(error)
                // }

                actions.setUserAlbums(response.data.getArtistAlbums)
                actions.update({
                  isLoadingAlbums: false
                })
              })
              .catch((error) => {
                console.error(error)
              })
          })
          .catch((error) => {
            console.error(error)
          })
      }
    },
    login: {
      update (data) {
        return data
      }
    },
    location: location.actions,
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
    return <AppShell oncreate={() => { window.flamous.checkForUpdate(); window.setInterval(window.flamous.checkForUpdate, 7200000) }}>
      <UITabBar />

      <UIViewRoute path='/' exact render={Home} viewName='home' />
      <UIViewRoute path='/artists' parent render={ArtistView} viewName='home' />
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
    flamous.auth.fetchUserInfo()
  })
  .catch((error) => {
    console.info(error)
  })
