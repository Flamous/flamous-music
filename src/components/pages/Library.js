/** @jsx h */
import { h } from 'hyperapp'
import UIPage from '../UI/UIPage'
import UILink from '../UI/UILink'
import UIHeader from '../UI/UIHeader'
import profilePlaceholder from '~/assets/profile.svg'
import songPlaceholer from '~/assets/song_placeholder.svg'

const Library = (props) => (context, actions) => {
  let { auth } = context

  return <UIPage nonInteractive {...props}>
    <UIHeader title={['Library', <UILink style={{ display: 'inline-flex', alignItems: 'center', border: '1px solid rgba(0, 0, 0, 0.5)', borderRadius: '100%' }} to='/profile'><img width='48' src={profilePlaceholder} /></UILink>]} />
    <main>

      <div style={{ textAlign: 'center' }}>
        {
          !auth.isAuthenticated && <main>
            <br />
            <UILink class='button' to='/signup'>Create Account</UILink>
            <UILink class='button white' to='login'>or Sign In</UILink>
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
