import API, { graphqlOperation } from '@aws-amplify/api'
import Auth from '@aws-amplify/auth'
import { getUser, getArtistAlbums } from '../graphql/queries'
import { createUserAndArtist, createNewArtist } from '../graphql/mutations'
import gqlApi from '../components/functions/gqlApi'

const isProductionContext = process.env.BRANCH !== 'dev'
const S3_BUCKET = isProductionContext
  ? process.env.S3_BUCKET
  : process.env.DEV_S3_BUCKET

const state = {
  tries: 0,
  isAuthenticated: false,
  cognitoUser: null,
  user: null,
  albums: null,
  artistId: null,
  isLoadingAlbums: false,
  isLoadingUser: false
}

const actions = {
  init: () => (state, actions) => {
    let currentAuthenticatedUserRes
    Auth.currentAuthenticatedUser()
      .then((result) => {
        currentAuthenticatedUserRes = result
        console.info('Flamous: User has authenticated. Initializing profile now...')
        return Auth.currentUserInfo()
      })
      .then((currentUserInfo) => {
        actions.setAuthenticated({
          cognitoUser: currentAuthenticatedUserRes,
          user: currentUserInfo,
          s3BasePath: `https://s3.eu-central-1.amazonaws.com/${S3_BUCKET}/protected/${currentUserInfo.id}`,
          isAuthenticated: true
        })
        actions.fetchUserInfo()
      })
      .catch((error) => {
        console.info('Flamous: No user signed in', error)
      })
  },
  update (data) {
    return data
  },
  logout: () => (state, actions) => {
    Auth.signOut()
      .then((result) => {
        actions.setAuthenticated(false)
      })
      .catch((error) => {
        console.error(error)
      })
  },
  setAuthenticated (obj) {
    if (!obj) {
      return {
        isAuthenticated: false,
        cognitoUser: null,
        albums: null,
        user: null
      }
    }

    return {
      isAuthenticated: true,
      ...obj
    }
  },
  fetchUserInfo: () => (state, actions) => {
    let { user = {} } = state // TODO: Skip the nesting and spread the user info in the init function. Need adaption of some pages (e.g. Profile.js)
    let { attributes = {} } = user
    let { artistId, nickname } = attributes

    gqlApi({
      operation: getUser
    })
    .then(function (response) {
      if (response.userNotExists) {
        console.info('Flamous: No uer connection yet. Creating now...')
        return gqlApi({
          operation: createNewArtist,
          parameters: {
            name: nickname
          }
        })
      }
    })
    .then(function (result) {
      if (result && result.artistId) {
        console.info(`Flamous: New artist created successfully: `, result)
        actions.update({
          artistId: result.artistId
        })
      }
    })
    .catch(console.error)
  },
  fetchUserAlbums: () => (state, actions) => {
    if (!state.artistId) return
    if (state.albums) return

    gqlApi({ // TODO: Upate to new Promise-based gqlApi wrapper
      operation: getArtistAlbums,
      parameters: {
        artistId: state.artistId
      },
      callback: (response) => {
        let responseData = response.data[Object.keys(response.data)[0]]

        actions.update({
          albums: responseData,
          isLoadingAlbums: false
        })
      }
    })
  }
}

export default {
  state,
  actions
}
