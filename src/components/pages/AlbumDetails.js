/** @jsx h */
import { h } from 'hyperapp'
import UIPage from '../UI/UIPage'
import UILink from '../UI/UILink'
import UIHeader from '../UI/UIHeader'
import Auth from '@aws-amplify/auth'
import { button } from '~/global.css'
import UISpinner from '../UI/UISpinner'
import { deleteAlbum, updateAlbum } from '~/graphql/mutations'
import API, { graphqlOperation } from '@aws-amplify/api'
import styles from './AlbumDetails.css'

const AlbumDetails = (props) => (state, actions) => (context) => {
  let { auth, actions: { auth: authActions } } = state
  let { UIPage } = context
  let albumId = props.match.params.albumId

  function handleChange (event) {
    UIPage.put({
      [event.target.id]: event.target.value,
      propsToUpdate: [
        ...new Set([
          ...UIPage.state.propsToUpdate,
          event.target.id
        ])
      ]
    })
  }

  function handleSave (event) {
    event.preventDefault()

    UIPage.put({
      isLoading: true
    })

    let valuesToUpdate = {}

    UIPage.state.propsToUpdate.forEach((property) => {
      valuesToUpdate[property.split('-')[1]] = UIPage.state[property]
    })

    try {
      API.graphql(graphqlOperation(updateAlbum, { albumId: UIPage.state.albumId, ...valuesToUpdate }))
        .then((response) => {
          UIPage.put({
            isLoading: false
          })

          let updatedAlbum = response.data.updateAlbum

          let newUserAlbums = auth.albums.map((album) => {
            return album.albumId === albumId ? updatedAlbum : album
          })

          authActions.setUserAlbums(newUserAlbums)
        })
    } catch (error) {
      console.error(error)

      UIPage.put({
        isLoading: false
      })
    }
  }

  function handleDelete (event) {
    event.preventDefault()

    UIPage.put({
      isLoading: true
    })

    try {
      API.graphql(graphqlOperation(deleteAlbum, { albumId }))
        .then((response) => {
          let newUserAlbums = auth.albums.filter((album) => {
            return album.albumId !== albumId
          })

          authActions.setUserAlbums(newUserAlbums)
          window.history.replaceState('', {}, '/profile')
        })
    } catch (error) {
      console.error(error)

      UIPage.put({
        isLoading: false
      })
    }
  }

  !UIPage.state.albumId && UIPage.put({
    albumId,
    propsToUpdate: []
  })

  return <div>
    <UIHeader title='Album' nav={{ end: <button style={{ backgroundColor: 'red' }} onclick={handleDelete}>Delete</button> }} />

    <main class={styles['main']}>
      {
        UIPage.state.isLoading && <UISpinner />
      }
      {
        !UIPage.state.isLoading && <form onsubmit={handleSave}>
          <label for='album-title'>Title</label>
          <input type='text' id='album-title' oninput={handleChange} value={UIPage.state['album-title']} />
          <label for='album-description'>Description</label>
          <input type='text' id='album-description' oninput={handleChange} value={UIPage.state['album-description']} />
          <button type='submit'>Save</button>
        </form>
      }
    </main>
  </div>
}

export default (props) => <UIPage {...props}>
  <AlbumDetails {...props} />
</UIPage>
