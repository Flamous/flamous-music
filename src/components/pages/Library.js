/** @jsx h */
import { h } from 'hyperapp'
import UIPage from '../UI/UIPage'
import UILink from '../UI/UILink'
import UIHeader from '../UI/UIHeader'
import UIIcon from '../UI/UIIcon'
import styles from './Library.css'

const Library = (props) => (context, actions) => {
  let { auth } = context

  return <UIPage nonInteractive {...props}>
    <UIHeader title='Library' />
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
          <UIIcon class={styles['headphones']} height='48' width='48' icon='headphones' />
          <UIIcon class={styles['heart']} height='80' width='80' icon='heart' />
          <UIIcon class={styles['play']} height='48' width='48' icon='play-circle' />

          <p class={styles['empty-text']}>
            Listen to saved songs here<br />Works even when you're offline
          </p>
        </section>
      }
    </main>
  </UIPage>
}

export default Library
