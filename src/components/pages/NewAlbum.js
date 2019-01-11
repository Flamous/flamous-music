/** @jsx h */
import { h } from 'hyperapp'
import { nestable } from 'hyperapp-context'
import { slideUp } from '../functions/animation'
import styles from './NewAlbum.css'
import API, { graphqlOperation } from '@aws-amplify/api'
import { createAlbum } from '~/graphql/mutations'
import UILink from '../UI/UILink'

const state = {
  animation: slideUp.state
}

const actions = {
  animation: slideUp.actions
}

const view = (state, actions) => (props, children) => (context) => {
  let { auth: { artistId, albums }, new: { album }, actions: { new: newActions, auth: authActions } } = context
  let { animation: { start: startAnimation } } = actions
  // let isLogin = props.match.path === '/login' // Is either /login or /signup
  let previousUrl = props.location.previous === '/create-album' ? '/' : props.location.previous

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

  return <div
    class={styles['wrapper']}
    key='new-album'
    oncreate={(element) => { element.parentNode.actions = actions; startAnimation({ element, initialLoad: context.initialLoad }) }}
  >
    <header class={styles['header']}>
      <div class={styles['top-row']}>
        <UILink replace to={previousUrl} class='button white'>Cancel</UILink>
        <button onclick={handleSubmit} type='submit'>Create</button>
      </div>

      <h1>
        New Album
      </h1>
    </header>

    <main class={styles['main']}>
      <section>
        <form onsubmit={handleSubmit} id='new-album-form'>
          <input id='title' maxlength='40' oninput={handleInput} type='text' value={album.title} placeholder='Title' />
        </form>
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
