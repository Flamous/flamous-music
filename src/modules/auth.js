import API, { graphqlOperation } from '@aws-amplify/api'
import { getUser, getArtistAlbums } from '../graphql/queries'
import { onCreatedAlbum } from '../graphql/subscriptions'
import { createUser, createArtist, updateUser } from '../graphql/mutations'

const state = {
  tries: 0,
  isAuthenticated: false,
  cognitoUser: null,
  user: null,
  albums: null,
  isLoadingAlbums: false
}

const actions = {
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

}

export default {
  state,
  actions
}
