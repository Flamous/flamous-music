/** @jsx h */
import { h } from 'hyperapp'
import UIPage from '../UI/UIPage'
import UILink from '../UI/UILink'
import UIHeader from '../UI/UIHeader'
import Auth from '@aws-amplify/auth'
import { button } from '~/global.css'
import UISpinner from '../UI/UISpinner'
import profilePlaceholder from '~/assets/profile.svg'
import songPlaceholer from '~/assets/song_placeholder.svg'

const Library = (props) => (context, actions) => {
  let { auth, actions: { auth: { isAuthenticated } } } = context

  return <UIPage nonInteractive {...props}>
    <UIHeader title={['Library', <UILink style={{ display: 'inline-flex', alignItems: 'center' }} to='/profile'><img width='48' src={profilePlaceholder} /></UILink>]} />
    <main>

      <div style={{ textAlign: 'center' }}>
        {
          !auth.isAuthenticated && <main>
            <UILink class={button} to='/signup'>Create Account</UILink>
            <p>
              <UILink to='login'>Sign in instead</UILink>
            </p>
          </main>
        }
      </div>
      {
        auth.isAuthenticated && <section style={{ textAlign: 'center', marginTop: '3em' }}>
          <img width='128' src={songPlaceholer} />
          <p>
          See songs you Saved here.
          </p>
        </section>
      }
    </main>
  </UIPage>
}

export default Library
