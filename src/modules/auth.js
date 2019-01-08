import API, { graphqlOperation } from '@aws-amplify/api'
import Auth from '@aws-amplify/auth'
import { getUser, getArtistAlbums } from '../graphql/queries'
import { createUser } from '../graphql/mutations'

function gqlApi (options) {
  let { operation, parameters = {}, callback, errorCallback } = options

  API.graphql(graphqlOperation(operation, parameters))
    .then((response) => {
      callback(response)
    })
    .catch((error) => {
      console.error(error)

      typeof errorCallback === 'function' && errorCallback(error)
    })
}

const state = {
  tries: 0,
  isAuthenticated: false,
  cognitoUser: null,
  user: null,
  albums: null,
  isLoadingAlbums: false,
  isLoadingUser: false
}

const actions = {
  init: () => (state, actions) => {
    Auth.currentAuthenticatedUser()
      .then((result) => {
        actions.setAuthenticated(result)
        actions.fetchUserInfo()
      })
      .catch((error) => {
        console.info(error)
      })
  },
  update (data) {
    return data
  },
  logout: () => (state, actions) => {
    Auth.signOut()
      .then((result) => {
        console.log('here')
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
      cognitoUser: obj
    }
  },
  fetchUserInfo: () => (state, actions) => {
    gqlApi({
      operation: getUser,
      callback: handleFetch
    })

    function handleFetch (response) {
      let responseData = response.data[Object.keys(response.data)[0]]

      if (state.tries > 3) {
        console.error('Flamous: Too many fetch attempts', response)
        actions.update({
          isLoadingAlbums: false
        })
        return
      }

      if (!responseData) {
        actions.update({
          tries: state.tries++
        })
        gqlApi({
          operation: createUser,
          callback: handleFetch
        })

        return
      }

      actions.update({
        ...responseData,
        isLoadingAlbums: false
      })

      actions.fetchUserAlbums()
    }
  },
  fetchUserAlbums: () => (state, actions) => {
    if (!state.artistId) return
    if (state.albums) return

    gqlApi({
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
