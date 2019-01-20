/** @jsx h */
import { h } from 'hyperapp'
import UIPage from '../UI/UIPage'
import UIHeader from '../UI/UIHeader'
import UIBackButton from '../UI/UIBackButton'
import UILink from '../UI/UILink'
import styles from './Settings.css'
import UIIcon from '../UI/UIIcon'

const Settings = () => (state) => {
  let { auth, actions: { auth: { logout } } } = state
  return <UIPage>
    <UIHeader
      title='Settings'
      nav={{ start: <UIBackButton /> }}
    />
    <main class={styles['main']}>
      <h3>Account</h3>
      <section class={styles['account']}>
        <div class='row'>
          <div class={styles['text']}>
            Logged in as<br /><b>{auth.cognitoUser.attributes.email}</b>
          </div>
          <div>
            <button onclick={logout}>Logout</button>
          </div>
        </div>
        <UILink class='row' to='/settings/change-password'>
          <span style={{ flexGrow: '1' }}>Change Password</span>
          <UIIcon width='32' icon='chevron-right' />
        </UILink>
      </section>
    </main>
  </UIPage>
}

export default Settings
