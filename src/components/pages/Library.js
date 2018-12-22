/** @jsx h */
import { h } from 'hyperapp'
import UIPage from '../UI/UIPage'
import UILink from '../UI/UILink'
import UIHeader from '../UI/UIHeader'
import Auth from '@aws-amplify/auth'
import { button } from '~/global.css'

const Library = (props) => (context, actions) => {
  let { auth, actions: { auth: { isAuthenticated } } } = context

  return <UIPage nonInteractive {...props}>
    <UIHeader title='Library' />

    <div style={{ textAlign: 'center' }}>
      <p>
        {
          !auth.isAuthenticated
            ? <main>
              <UILink class={button} to='/signup'>Create Account</UILink>
              <p>
                <UILink to='login'>Sign in instead</UILink>
              </p>
            </main>
            : <div>
              Signed in as<br />{auth.cognitoUser.attributes.email}
              <p>
                <button onclick={() => Auth.signOut().then(() => { isAuthenticated(false) })}>Log out</button>
              </p>
            </div>
        }
      </p>
      <section>
        <p>
          <UILink to='create-album' class={button}>Create New Album</UILink>
        </p>
      </section>
    </div>
  </UIPage>
}

export default Library
