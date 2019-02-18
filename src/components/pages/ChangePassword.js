/** @jsx h */
import { h } from 'hyperapp'
import UIPage from '../UI/UIPage'
import UIHeader from '../UI/UIHeader'
import UIBackButton from '../UI/UIBackButton'
import styles from './ChangePassword.css'
import Auth from '@aws-amplify/auth'

const Page = (props) => (state, actions) => (context) => {
  function handleSubmit (event) {
    event.preventDefault()

    Auth.currentAuthenticatedUser()
      .then((user) => {
        return Auth.changePassword(user, state['current-password'], state['new-password'])
      })
      .then((val) => {
        console.log(val)
      })
      .catch((error) => {
        console.error(error)
      })
  }
  function handleChange (event) {
    put({
      [event.target.id]: event.target.value
    })
  }

  let { UIPage: { put, state = {} } } = context

  return <div>
    <UIHeader nav={{ start: <UIBackButton />, middle: 'Change Password' }} />
    <main class={styles['main']}>
      {/* <h3>Account</h3> */}
      <section class={styles['account']}>
        <form onsubmit={handleSubmit}>
          <div class='row'>
            <div class={styles['input-container']}>
              <label for='current-password'>Current</label>
            </div>
          </div>
          <div class='row'>
            <div class={styles['input-container']}>
              <label for='new-password'>New</label>
            </div>
          </div>
          <div class='row'>
            <button>Change Password</button>
          </div>
        </form>
      </section>
    </main>
  </div>
}

export default (props) => <UIPage {...props}>
  <Page />
</UIPage>
