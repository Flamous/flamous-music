/** @jsx h */
import { h } from 'hyperapp'
import { nestable } from 'hyperapp-context'
import { slideUp } from '../functions/animation'
import styles from './AlbumEditor.css'
import API, { graphqlOperation } from '@aws-amplify/api'
import { createAlbum } from '~/graphql/mutations'
import UILink from '../UI/UILink'
import UIIcon from '../UI/UIIcon'
import cc from 'classcat'
import albumPlaceholder from '../../assets/song_placeholder.svg'

const state = {
  animation: slideUp.state
}

const actions = {
  animation: slideUp.actions
}

const view = (state, actions) => (props, children) => (context) => {
  let { auth: { artistId, albums }, new: { album }, actions: { new: newActions, auth: authActions } } = context
  let { animation: { start: startAnimation } } = actions
  let previousUrl = props.location.previous === '/album-editor' ? '/' : props.location.previous

  function handleInput (event) {
    newActions.album.update(
      {
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

  function addSong () {
    album.songs.push({
      title: null,
      audio: null,
      id: Math.random()
    })
    newActions.album.update({
      songs: album.songs
    })
  }

  return <div
    class={styles['wrapper']}
    key='new-album'
    oncreate={(element) => { element.parentNode.actions = actions; startAnimation({ element, initialLoad: context.initialLoad }) }}
  >
    <header class={styles['header']}>
      <div class={styles['top-row']}>
        <UILink back class='button white'>Cancel</UILink>
        <div>
          <button class='white' style={{ fontWeight: 'bold' }}>Save &amp; Exit</button>
        </div>
      </div>

      <h1>
        Album Editor
      </h1>
    </header>

    <main class={styles['main']}>
      <h3>Details</h3>
      <section class={styles['account']}>
        <div class={cc(['row', styles['input-row']])}>
          {/* <label for='title'>Title</label> */}
          <input aria-label='Title' id='title' maxlength='40' oninput={handleInput} type='text' value={album.title} placeholder='Album Title ...' />
        </div>
        <div class={cc(['row', styles['input-row']])}>
          <label for='cover-image'>Cover Image</label>
          <div style={{ display: 'flex', width: '100%' }}>
            <div class={styles['cover-image']}>
              {/* <label for='cover-image'> */}
              <img src={albumPlaceholder} />
              {/* <label for='cover-image'> */}
              <label for='cover-image' class={cc([styles['cover-image-upload'], 'button'])}>
                <UIIcon icon='upload-cloud' />
                <br />
                Upload
              </label>
              {/* </label> */}
            </div>
            <div>
              .
            </div>
          </div>
          <input id='cover-image' maxlength='40' oninput={handleInput} class={styles['cover-image']} type='file' accept='*/image' value={album.coverImage} />
        </div>

        <div class={cc(['row', styles['row'], styles['input-row']])}>
          <label>Songs</label>
          <ol class={styles['song-list']}>
            {
              album.songs && album.songs.length > 0 && album.songs.map((song, index) => {
                return <li key={song.id}>
                  <div class={styles['aside']}>
                    <span class={styles['song-number']}>{index + 1}</span>
                    <UIIcon icon='more-horizontal' />
                  </div>
                  <div class={styles['song-data']}>
                    <input class={styles['song-title']} type='text' value={song.title} placeholder='Song title' />
                    <div>
                      <span>Audio: </span>
                      <label for={`song-${song.id}`} class={cc([styles['audio-input'], 'button', 'white'])}>
                        Upload File
                      </label>
                      <input id={`song-${song.id}`} class={styles['audio-input']} type='file' accept='*/audio' />
                    </div>
                  </div>
                </li>
              })
            }
            <div class={styles['dragndrop']}>
              <span>
                &larr; Drag to re-order &rarr;
              </span>
            </div>
          </ol>
          <button onclick={addSong}><UIIcon icon='plus' />Add Song</button>
        </div>
      </section>

      <h3>Additional Info</h3>
      <section class={styles['account']}>
        <div class={cc(['row', styles['input-row']])}>
          <div>
            <input type='checkbox' /> <label for='title'>Release as Single</label>
          </div>
          <p>Release your album as a Single when you want to publish a single song, or multiple versions of the same song.<br />For more info, have a look at our <a href='#'>Geference Guide</a></p>
          {/* <input id='title' maxlength='40' oninput={handleInput} type='text' value={album.coverImage} /> */}
          {/* <span>[switch]</span> */}
        </div>
        <div class={cc(['row', styles['input-row']])}>
          <label for='story'>Story</label>
          <span>Albums with sotries are more likely to be featured and shared on social media. </span>
          <textarea id='story' oninput={handleInput} type='text' value={album.story} placeholder='What went into the album ...' />
        </div>
        <div class={cc(['row', styles['input-row']])}>
          <label for='title'>Involved Artists</label>
          <input id='title' maxlength='40' oninput={handleInput} type='text' value={album.coverImage} />
        </div>
        <div class={cc(['row', styles['input-row']])}>
          <label for='title'>Produced By</label>
          <input id='title' maxlength='40' oninput={handleInput} type='text' value={album.coverImage} />
        </div>
        <div class={cc(['row', styles['input-row']])}>
          <label for='title'>Written By</label>
          <input id='title' maxlength='40' oninput={handleInput} type='text' value={album.coverImage} />
        </div>
        <div class={cc(['row', styles['input-row']])}>
          <label for='title'>Performed By</label>
          <input id='title' maxlength='40' oninput={handleInput} type='text' value={album.coverImage} />
        </div>
      </section>

      <h3>Release</h3>
      <section class={styles['account']}>
        <div class={cc(['row'])}>

          <p>
          When you release your album, it is publicly visible and can be listened to.
            <br />
            <br />
            You can release your album now or choose a release date in the future.
          </p>
        </div>
        <button class='white' onclick={handleSubmit} type='submit'>Release Now</button>
        <button onclick={handleSubmit} type='submit'>Set Release Date</button>
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

export default (props) => { return <NewAlbum onremove={(elem, done) => { elem.actions.animation.slideOut(done) }} {...props} /> }
