/** @jsx h */
import { h } from 'hyperapp'
import UIPage from '../UI/UIPage'
import UILink from '../UI/UILink'
import UIHeader from '../UI/UIHeader'
import Auth from '@aws-amplify/auth'
import { button } from '~/global.css'
import UISpinner from '../UI/UISpinner'

const AlbumDetails = (props) => (state, actions) => (context) => {
  let { auth, actions: { auth: { isAuthenticated } } } = state
  let { UIPage } = context
  let albumId = props.match.params.albumId

  !UIPage.state.albumId && UIPage.put({ key: 'albumId', value: albumId })

  return <div>
    <UIHeader title='Album' />

    <main>
      {UIPage.state.albumId}
    </main>
  </div>
}

export default (props) => <UIPage {...props}>
  <AlbumDetails {...props} />
</UIPage>
