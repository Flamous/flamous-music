/** @jsx h */
import { h } from 'hyperapp'
import { nestable } from 'hyperapp-context'
import { slideUp } from '../functions/animation'
import styles from './AlbumEditor.css'
import API, { graphqlOperation } from '@aws-amplify/api'
import Storage from '@aws-amplify/storage'
import { createNewAlbum, createSong, updateAlbum, updateSong } from '~/graphql/mutations'
import { getAlbum, getSongList } from '~/graphql/queries'
import UILink from '../UI/UILink'
import UIIcon from '../UI/UIIcon'
import UIHeader from '../UI/UIHeader'
import cc from 'classcat'
import albumPlaceholder from '../../assets/song_placeholder.svg'

import gqlApi from '../functions/gqlApi'

const state = {
  animation: slideUp.state
}

const actions = {
  animation: slideUp.actions
}
let outerProgress = 0
let outerProgress2 = 0
const view = (state, actions) => (props, children) => (context) => {
  let { auth: { artistId, albums, s3BasePath }, new: { album }, actions: { new: newActions, auth: authActions, actionMenu } } = context
  let { animation: { start: startAnimation } } = actions
  let previousUrl = props.location.previous === '/album-editor' ? '/' : props.location.previous

  let activeEdit = album.activeEdit
  let albumUrlParam = props.match && props.match.params.albumId

  function handleInput (event, index) {
    let isSongInput = event.target.id.includes('song')

    if (isSongInput) {
      let songs = [...album.songs]

      songs[index].title = event.target.value
      newActions.album.update({
        songs
      })
      return
    }

    newActions.album.update({
      [event.target.id]: event.target.value
    })
  }

  async function handleSubmit (event) {
    event.preventDefault()
    newActions.album.update({
      isLoading: true
    })
    try {
      let request = await API.graphql(graphqlOperation(createAlbum, { artistId: artistId, title: album.title }))

      albums.push(request.data.createAlbum)
      authActions.update({
        albums
      })
      newActions.album.update({
        isLoading: true,
        title: null
      })
      window.history.replaceState('', {}, previousUrl)
    } catch (error) {
      console.error(error)
    }
  }

  async function addSong () {
    let newSong
    try {
      newSong = await gqlApi({
        operation: createSong,
        parameters: {
          albumId: albumUrlParam
        }
      })
      console.log(newSong)
    } catch (error) {
      console.error(error)
    }
   
    let songs = [...album.songs, newSong]

    newActions.album.update({
      songs
    })
  }

  function uploadCoverImage (event) {
    let file = event.target.files && event.target.files[0]
    let coverImagePath = `albums/${albumUrlParam}/cover`

    console.log(file)
    
    Storage.put(coverImagePath, file, {
      level: 'protected',
      contentType: file.type,
      progressCallback (progress) {
        outerProgress = (progress.loaded / progress.total) * 100
        console.info(`Uploaded ${(progress.loaded / progress.total) * 100}%`)
      }
    })
    .then(function handleCoverImage (result) {
      console.log(result)
      newActions.album.update({
        imageSource: result.key
      })
    })
  }

  function uploadAudioFile (event) {
    let file = event.target.files && event.target.files[0]
    let songId = event.target.dataset.songId
    let audioPath = `albums/${albumUrlParam}/${songId}/audio`
    console.log(event.target)
    
    Storage.put(audioPath, file, {
      level: 'protected',
      contentType: file.type,
      progressCallback (progress) {
        outerProgress2 = (progress.loaded / progress.total) * 100
        console.info(`Uploaded ${(progress.loaded / progress.total) * 100}%`)
      }
    })
    .then(function handleSongFile (result) {
      console.log(result)

      let songs = album.songs.map(function filterSong (song) {
        if (song.songId === songId) {
          song.audioSource = result.key
        }

        return song
      })
      console.log('songs: ', songs)
      newActions.album.update({
        songs
      })
    })
    .catch(console.error)
  }

  function removeSong (index) {
    let songs = [...album.songs]

    songs.splice(index, 1)
    newActions.album.update({
      songs
    })
  }

  function fetchAlbum () {
    if (albumUrlParam !== 'new') {
      gqlApi({
        operation: getAlbum,
        parameters: {
          albumId: albumUrlParam,
          artistId
        }
      })
      .then(function albumResult (result) {
        newActions.album.update({
          ...result
        })
      })
      .then(function albumResult (result) {
        // console.log(result.title)
        // newActions.album.update({result})
        newActions.album.update({
          ...result
        })
        console.log(albumUrlParam)
        return gqlApi({
          operation: getSongList,
          parameters: {
            albumId: albumUrlParam
          }
        })
      })
      .then(function songResults (response) {
        console.log("SUCCESS", response)
        newActions.album.update({
          songs: response
        })
      })
      .catch(console.error)
    } else {
      gqlApi({
        operation: createNewAlbum,
        parameters: {
          title: "Untitled",
          artistId
        }
      })
      .catch(console.error)
    }
  }

  function saveSong (index) {
    let song = album.songs[index]
    gqlApi({
      operation: updateSong,
      parameters: {
        songId: song.songId,
        albumId: albumUrlParam,
        songData: {
          title: song.title,
          audioSource: song.audioSource
        }
      }
    })
    .then(function saveResult (saveResult) {
      console.log("SUCCESS", saveResult)
    })
    .catch(console.error)
    newActions.album.update({
      activeEdit: -1,
      isSavingActiveSong: false
    })
  }

  function saveAlbumAndExit () {
    console.log('Title is ', album.title)
    gqlApi({
      operation: updateAlbum,
      parameters: {
        artistId,
        albumId: albumUrlParam,
        data: {
          title: album.title,
          imageSource: album.imageSource
        }
      }
    })
    .then(function handleSave (saveResult) {
      console.log("SUCCESS", saveResult)
    })
    .catch(console.error)
  }

  return <div
    class={styles['wrapper']}
    key='new-album'
    oncreate={(element) => {
      element.parentNode.actions = actions
      startAnimation({ element, initialLoad: context.initialLoad })

      fetchAlbum()
    }}
  >
    <UIHeader
      title='Album Editor'
      nav={{
        start: <UILink back class='button white'>Close</UILink>,
        end: <button onclick={saveAlbumAndExit} class='white' style={{ fontWeight: 'bold' }}>Save &amp; Exit</button>
      }}
    />

    <main class={styles['main']}>
      <section class={styles['account']}>
        <div class={cc(['row', styles['input-row']])}>
          <div style={{ display: 'flex', width: '100%', alignItems: 'center' }}>
            <div class={styles['cover-image']}>
              <img src={`${s3BasePath}/${album.imageSource}`} />
              {
                !album.imageSource && <label for='cover-image' class={cc([styles['cover-image-upload'], 'button', 'white'])}>
                <UIIcon icon='image' />
                Upload<br />Image
                {outerProgress > 0 ? <span><br />{`${outerProgress}%`}</span> : ''}
              </label>
              }
            </div>
            <div class={styles['album-title']}>
              <label for='title'>Title</label>
              <input aria-label='Album Title' id='title' maxlength='50' oninput={handleInput} type='text' value={album.title} placeholder='Your album title...' />
            </div>
          </div>
          <input id='cover-image' maxlength='40' oninput={uploadCoverImage} class={styles['cover-image']} type='file' accept='*/image' value={album.coverImage} />
        </div>

        <div class={cc(['row', styles['row'], styles['input-row']])}>
          <label>Songs</label>
          <ol class={styles['song-list']}>
            <div>
              {
                album.songs && album.songs.length > 0 && album.songs.map((song, index) => {
                  console.log(activeEdit)
                  if (index === activeEdit) {
                    return <li key={song.songId}>
                    <div class={styles['aside']}>
                      <span class={styles['song-number']}>{index + 1}</span>
                      <UIIcon icon='check' onclick={
                        event => {
                          newActions.album.update({
                            isSavingActiveSong: true
                          })

                          saveSong(index)
                        }
                      } />
                    </div>
                    <div class={styles['song-data']}>
                      <input id={`song-${song.songId}`} class={styles['song-title']} type='text' oninput={(event) => handleInput(event, index)} value={song.title} placeholder='Type song title ...' />
                      <div>
                        <span>Audio: </span>
                        <label for={`audio-${song.songId}`} class={cc([styles['audio-input'], 'button', 'white'])}>
                        Upload File
                        </label>
                        <input oninput={uploadAudioFile} data-song-id={song.songId} id={`audio-${song.songId}`} class={styles['audio-input']} type='file' accept='*/audio' />
                      </div>
                    </div>
                  </li>
                  } else {
                    return <li key={song.songId} class={cc([styles['normal'], { [styles['inactive']]: activeEdit !== -1 }])}>
                    <div class={styles['aside']}>
                      <span class={styles['song-number']}>{index + 1}</span>
                      <UIIcon icon='edit-3' onclick={event => {
                        newActions.album.update({
                          activeEdit: index
                        })
                      }} />
                    </div>
                    <div class={styles['song-data']}>
                      <input disabled id={`song-${song.songId}`} class={styles['song-title']} type='text' oninput={(event) => handleInput(event, index)} value={song.title} placeholder='Type song title ...' />
                      <div>
                        <audio controls src={`${s3BasePath}/${song.audioSource}`}></audio>
                      </div>
                    </div>
                  </li>
                  }
                  
                })
              }
            </div>
            <div class={styles['dragndrop']}>
              <span>
                &larr; Drag to re-order &rarr;
              </span>
            </div>
          </ol>
          {
            album.songs.length === 0 && <p>
              <i>Start adding songs to the album by clicking on "Add Song"</i>
            </p>
          }
          <button onclick={addSong}><UIIcon icon='plus' />Add Song</button>
        </div>
      </section>

      <h3>Additional Info</h3>
      <section>
        <div class={cc(['row', styles['input-row']])}>
          <label for='release-as-single' class={styles['switch-row']}>
            <input id='release-as-single' type='checkbox' class={cc(['switch', styles['release-as-single']])} /> <label for='release-as-single'>Release as Single</label>
            <label for='release-as-single' class='switch'>
              <span class='knob' />
            </label>
          </label>
          <p style={{ color: 'rgba(0, 0, 0, 0.6)' }}>Release your album as a Single when you want to publish a single song, or multiple versions of the same song.<br /><br />For more info, have a look at our <a href='#'>Reference Guide</a></p>
        </div>
        <div class={cc(['row', styles['input-row']])}>
          <label for='story'>
            Story<br />
          </label>
          <p style={{ color: 'rgba(0, 0, 0, 0.6)' }}>Albums with stories maximize their chance to be featured on our social media channels. Your Story is also displayed on the public album page.</p>
          <textarea id='story' rows='4' oninput={handleInput} type='text' value={album.story} placeholder='What went into the album ...' />
        </div>
      </section>

      <h3 />
      <section>
        <div class={cc(['row', styles['input-row']])}>
          <div>
            <label for='release-your-album'>Release your album</label>
            <p style={{ color: 'rgba(0, 0, 0, 0.6)' }}>
              When you release your album, it is publicly visible and can be listened to.
              <br />
              <br />
              You can release your album now or choose a release date in the future.
            </p>
          </div>
          <div style={{ alignSelf: 'flex-end' }}>
            <button class='white' onclick={handleSubmit} type='submit'>Release Now</button>
            <button onclick={handleSubmit} type='submit'>Set Release Date</button>
          </div>
        </div>
      </section>
    </main>
  </div>
}

const NewAlbum = nestable(
  {
    ...state
  },
  {
    ...actions
  },
  view,
  'page-new-album'
)

export default (props) => { return <NewAlbum onremove={(elem, done) => { elem.actions.animation.slideOut({ done, elem }) }} {...props} /> }
