/** @jsx h */
import { h } from 'hyperapp'
import { nestable } from 'hyperapp-context'
import { slideUp } from '../functions/animation'
import styles from './AlbumEditor.css'
import API, { graphqlOperation } from '@aws-amplify/api'
import { createAlbum } from '~/graphql/mutations'
import UILink from '../UI/UILink'
import UIIcon from '../UI/UIIcon'
import UIHeader from '../UI/UIHeader'
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
    <UIHeader
      title='Album Editor'
      nav={{
        start: <UILink back class='button white'>Cancel</UILink>,
        end: <button class='white' style={{ fontWeight: 'bold' }}>Save &amp; Exit</button>
      }}
    />

    <main class={styles['main']}>
      <section class={styles['account']}>
        <div class={cc(['row', styles['input-row']])}>
          <div style={{ display: 'flex', width: '100%' }}>
            <div class={styles['cover-image']}>
              <img src={albumPlaceholder} />
              <label for='cover-image' class={cc([styles['cover-image-upload'], 'button', 'white'])}>
                <UIIcon icon='image' />
                Upload<br />Image
              </label>
            </div>
            <div class={styles['album-title']}>
              {/* <label for='title'>Title</label> */}
              <input aria-label='Album Title' id='title' maxlength='50' oninput={handleInput} type='text' value={album.title} placeholder='Your album title...' />
            </div>
          </div>
          <input id='cover-image' maxlength='40' oninput={handleInput} class={styles['cover-image']} type='file' accept='*/image' value={album.coverImage} />
        </div>

        <div class={cc(['row', styles['row'], styles['input-row']])}>
          <label>Songs</label>
          <ol class={styles['song-list']}>
            <div>
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
            </div>
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

export default (props) => { return <NewAlbum onremove={(elem, done) => { elem.actions.animation.slideOut(done) }} {...props} /> }
