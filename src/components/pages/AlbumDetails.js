/** @jsx h */
import { h } from 'hyperapp'
import UIPage from '../UI/UIPage'
import UIHeader from '../UI/UIHeader'
import Storage from '@aws-amplify/storage'
import UISpinner from '../UI/UISpinner'
import { deleteAlbum, updateAlbum } from '~/graphql/mutations'
import { getAlbum } from '~/graphql/queries'
import API, { graphqlOperation } from '@aws-amplify/api'
import styles from './AlbumDetails.css'
import placeholder from '~/assets/song_placeholder.svg'
import UIBackButton from '../UI/UIBackButton'

const MAX_FILE_SIZE = 10000000 // 10000000 Bytes == 10 MB

const AlbumDetails = (props) => (state, actions) => (context) => {
  let { auth, actions: { auth: authActions } } = state
  let { UIPage } = context
  let albumId = props.match.params.albumId

  function validateFile (fileInput) {
    if (fileInput.size >= MAX_FILE_SIZE) {
      UIPage.put({
        fileError: 'The selected file is too large.'
      })
      return false
    }

    UIPage.put({
      fileError: null
    })
    return true
  }

  function handleChange (event) {
    let target = event.target

    UIPage.put({
      [event.target.id]: (target.files && target.files[0]) || target.value,
      propsToUpdate: [
        ...new Set([
          ...UIPage.state.propsToUpdate,
          event.target.id
        ])
      ]
    })

    if (target.files) {
      let reader = new window.FileReader()

      if (!validateFile(target.files[0])) return
      reader.readAsDataURL(target.files[0])
      reader.onloadend = () => {
        UIPage.put({
          coverImageUrl: reader.result
        })
      }
    }
  }

  async function handleSave (event) {
    event.preventDefault()

    if (UIPage.state.propsToUpdate.length === 0) return

    UIPage.put({
      isLoading: true
    })

    let valuesToUpdate = {}
    let file

    UIPage.state.propsToUpdate.forEach((property) => {
      valuesToUpdate[property.split('-')[1]] = UIPage.state[property]
    })

    if (valuesToUpdate['cover'] && validateFile(valuesToUpdate['cover'])) {
      file = valuesToUpdate['cover']
      valuesToUpdate.hasProfilePicture = true
      let coverImagePath = `albums/${albumId}/cover`
      valuesToUpdate.coverImagePath = coverImagePath

      try {
        await Storage.put(coverImagePath, file, {
          level: 'protected',
          contentType: file.type,
          progressCallback (progress) {
            console.info(progress)
            console.info(`Uploaded ${(progress.loaded / progress.total) * 100}%`)
          }
        })
      } catch (error) {
        console.error(error)
      }
    } else {
      delete valuesToUpdate.cover
    }

    if (Object.keys(valuesToUpdate).length === 0) {
      UIPage.put({
        isLoading: false
      })
      return
    }
    valuesToUpdate.albumId = albumId

    API.graphql(graphqlOperation(updateAlbum, valuesToUpdate))
      .then((response) => {
        UIPage.put({
          isLoading: false
        })

        let updatedAlbum = response.data.updateAlbum

        let newUserAlbums = auth.albums.map((album) => {
          return album.albumId === albumId ? updatedAlbum : album
        })

        authActions.update({
          albums: newUserAlbums
        })
      })
      .catch((error) => {
        console.error(error)

        UIPage.put({
          isLoading: false
        })
      })
  }

  function handleDelete (event) {
    event.preventDefault()

    UIPage.put({
      isLoading: true
    })

    API.graphql(graphqlOperation(deleteAlbum, { albumId }))
      .then((response) => {
        let newUserAlbums = auth.albums.filter((album) => {
          return album.albumId !== albumId
        })

        authActions.update({
          albums: newUserAlbums
        })
        window.history.replaceState('', {}, '/profile')
      })
      .catch((error) => {
        console.error(error)

        UIPage.put({
          isLoading: false
        })
      })
  }

  function fetchAlbum () {
    API.graphql(graphqlOperation(getAlbum, { albumId }))
      .then((response) => {
        let albumData = response.data.album

        UIPage.put({
          coverImagePath: albumData.coverImagePath,
          'album-title': albumData.title,
          'album-description': albumData.description,
          coverImageUrl: albumData.coverImagePath && auth.s3BasePath && `${auth.s3BasePath}/albums/${albumId}/cover`
        })
      })
      .catch((error) => {
        console.error(error)
      })
  }

  !UIPage.state.albumId && UIPage.put({
    albumId,
    propsToUpdate: []
  })

  if (auth.s3BasePath && !UIPage.state.coverImageUrl) {
    UIPage.put({
      coverImageUrl: UIPage.state.coverImagePath ? `${auth.s3BasePath}/albums/${albumId}/cover` : placeholder
    })
  }

  return <div oncreate={fetchAlbum}>
    <UIHeader title='Edit Album' nav={{ start: <UIBackButton />, end: <button style={{ backgroundColor: '#FF3B30' }} onclick={handleDelete}>Delete</button> }} />

    <main class={styles['main']}>
      {
        UIPage.state.isLoading && <UISpinner />
      }
      {
        !UIPage.state.isLoading && <form onsubmit={handleSave}>
          <label for='album-cover'>Album Cover</label>
          {
            UIPage.state.fileError && <p>{UIPage.state.fileError}</p>
          }
          <label for='album-cover'><img width='128' src={UIPage.state.coverImageUrl || placeholder} /></label>
          <input oninput={handleChange} style={{ margin: '1rem auto' }} id='album-cover' accept='image/*' type='file' />
          <label for='album-title'>Title</label>
          <input type='text' maxlength='40' id='album-title' oninput={handleChange} value={UIPage.state['album-title']} />
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
