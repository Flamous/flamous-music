import Auth from '@aws-amplify/auth'
import { getUser, getAlbumList } from '../graphql/queries'
import { createNewArtist } from '../graphql/mutations'
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
  isLoadingUser: true
}

const actions = {
  init: () => async (state, actions) => {
    try {
      let result = await Auth.currentAuthenticatedUser()
      console.info('Flamous: User has authenticated. Initializing profile now...')
      let currentUserInfo = await Auth.currentUserInfo()
      actions.setAuthenticated({
        cognitoUser: result,
        user: currentUserInfo,
        s3BasePath: `https://s3.eu-central-1.amazonaws.com/${S3_BUCKET}/protected/${currentUserInfo.id}`,
        isAuthenticated: true
      })
      actions.fetchUserInfo()
    } catch (error) {
      console.info('Flamous: No user signed in --> ', error)
      console.info('Flamous: Proceeding with guest user...')

      let res = await Auth.currentCredentials()

      actions.update({
        isLoadingUser: false
      })
    }
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
      console.info('Flamous: Getting guest user after signout...')
      Auth.currentCredentials()
        .catch(console.error)
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
  fetchUserInfo: () => async (state, actions) => {
    let { user = {} } = state // TODO: Skip the nesting and spread the user info in the init function. Need adaption of some pages (e.g. Profile.js)
    let { attributes = {} } = user
    let { artistId, nickname } = attributes

    try {
      let response2
      let response = await gqlApi({
        operation: getUser
      })

      if (response.userNotExists) {
        console.info('Flamous: No uer connection yet. Creating now...')
        response2 = await gqlApi({
          operation: createNewArtist,
          parameters: {
            name: nickname
          }
        })

        if (response2 && response2.artistId) {
          console.info(`Flamous: New artist created successfully: `, response2)
          actions.update({
            artistId: response2.artistId,
            uploadStatus: response.uploadStatus
          })
        }
      } else {
        actions.update({
          artistId: response.artistId
        })
      }
      actions.update({
        isLoadingUser: false
      })
      actions.fetchArtistAlbums()
    } catch (error) {
      console.error(error)
    }
  },
  fetchArtistAlbums: () => (state, actions) => {
    if (!state.artistId) return
    if (state.albums) return

    actions.update({
      isLoadingAlbums: true
    })

    gqlApi({
      operation: getAlbumList,
      parameters: {
        artistId: state.artistId
      }
    })
    .then(function handleResponse (response) {
      actions.update({
        albums: response,
        isLoadingAlbums: false
      })
    })
    .catch(console.error)
  }
}

export default {
  state,
  actions
}
