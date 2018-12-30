/** @jsx h */
import { h } from 'hyperapp'
import UIPage from './UI/UIPage.js'
import { button } from '~/global.css'
import UILink from './UI/UILink'
import styles from './Home.css'
import logo from '~/assets/flamous_logo_new_small.svg'

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
          <p>
            Some stuff here
          </p>
        </section>
        <hr />
        <section>
          <h2>
            Some topic
          </h2>
          <p>
            Some stuff here
          </p>
        </section>
        <hr />
        <p>

          Consectetur pariatur et sit quia omnis consectetur aut. Qui pariatur at et tenetur eos et odit. Iusto nam vero iusto non ut rem. Vero eos nihil non tempore repellat aut laborum quo.
        </p>
        <p>
          Provident similique repellendus error sunt. Cumque commodi autem nesciunt rerum et. Repellendus quia quos vel officia iure.
        </p>
        <p>
          Non repudiandae tempora ut et qui quia nemo. Odio labore sed nemo natus ipsam dolorum officiis quia. Voluptas nulla veritatis qui tenetur autem. Minus quia possimus et debitis.
        </p>
        <p>
          Ullam est deleniti architecto quis sapiente. Magnam aperiam non ut alias vel maxime quisquam earum. Esse velit enim sed eum. Aut minus numquam distinctio quo dolorem sunt debitis ex.
        </p>
        <p>
          Esse aut quam quas in in voluptas natus. Reprehenderit iusto aliquam voluptatibus. Officia debitis consectetur ea voluptatem.
        </p>
      </main>
    </UIPage>
  )
}

export default Home
