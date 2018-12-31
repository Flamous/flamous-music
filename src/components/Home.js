/** @jsx h */
import { h } from 'hyperapp'
import UIPage from './UI/UIPage.js'
import { button } from '~/global.css'
import UILink from './UI/UILink'
import styles from './Home.css'
import logo from '~/assets/flamous_logo_new_small.svg'
import dummyPlaceholder from '~/assets/dummy_artists.jpg'
import musicKitIcon from '~/assets/icons/kit_blue.svg'

const Header = () => (state) => {
  let { auth: { isAuthenticated: isSignedIn } } = state
  return <header class={styles['header']}>
    <div class={styles['inner']}>
      <img src={logo} />
      <h1>
      Music for<br />Everyone
      </h1>
      <p>
      Free (<UILink to='/license'>listen-like-you-can</UILink>) music. You can use them for commercial and noncommercial purposes.
      </p>
      {
        !isSignedIn && <nav>
          <div>
            <UILink class={button} to='/signup'>Create Account</UILink>
          </div>
          <div>
            <UILink class={`${button} white`} to='/login'>or Sign In</UILink>
          </div>
        </nav>
      }
    </div>
  </header>
}

const Home = (props) => (context) => {
  return (
    <UIPage {...props} nonInteractive key='home'>
      {/* <UIHeader title={<div style={{ marginTop: '3em' }}>Music for<br />Everyone</div>} nav={{ start: 'Logo', end: <UILink class={button} to='/signup'>Create Account</UILink> }} /> */}
      <Header />
      <main class={styles['main']}>
        <section>
          <h2>
            Featured
          </h2>
          <img style={{ display: 'block', width: '100%', maxWidth: '500px' }} src={dummyPlaceholder} />
        </section>
        <br />
        <br />
        <hr />
        <section>
          <h2>
            Don't know how to make music?
          </h2>
          <p>
            Check out the <UILink to='/music-kit'>Music Kit <img style={{ verticalAlign: 'bottom' }} src={musicKitIcon} /></UILink>
          </p>
        </section>
      </main>
    </UIPage>
  )
}

export default Home
