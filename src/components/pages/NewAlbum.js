/** @jsx h */
import { h } from 'hyperapp'
import { nestable } from 'hyperapp-context'
import { slideUp } from '../functions/animation'
import styles from './NewAlbum.css'
import UILink from '../UI/UILink'
import { button } from '~/global.css'
import API, { graphqlOperation } from '@aws-amplify/api'
import { createAlbum } from '~/graphql/mutations'

const state = {
  animation: slideUp.state
}

const actions = {
  animation: slideUp.actions
}

const view = (state, actions) => (props, children) => (context) => {
  let { auth: { user }, new: { album }, actions: { new: newActions } } = context
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

    try {
      await API.graphql(graphqlOperation(createAlbum, { artistId: user.artistId, title: album.title }))
    } catch (error) {
      console.error(error)
    }
  }

  function goBack () {
    window.history.replaceState(previousUrl, '', previousUrl)
  }

  return <div
    class={styles['wrapper']}
    key='new-album'
    oncreate={(element) => { element.parentNode.actions = actions; startAnimation({ element, initialLoad: context.initialLoad }) }}
  >
    <header class={styles['header']}>
      <div class={styles['top-row']}>
        <span onclick={goBack} class={styles['back-button']}>Done</span>
        <button onclick={handleSubmit}>Save</button>
      </div>

      <h1>
        Create Album
      </h1>
    </header>

    <main class={styles['main']}>
      <section>
        <input id='title' oninput={handleInput} type='text' value={album.title} placeholder='Title' />
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
