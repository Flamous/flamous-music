/** @jsx h */
import { h } from 'hyperapp'
import UIPage from './UI/UIPage.js'
import UILink from './UI/UILink'
import styles from './Home.css'
import logo from '~/assets/logo/brand.svg'
import UIHeader from './UI/UIHeader.js'
import SongList from './SongList'
import AlbumList from './AlbumList'
import ArtistList from './ArtistList'
import OpenGraph from './OpenGraph'
import UISpinner from './UI/UISpinner.js'

import cc from 'classcat'

import profilePlaceholder from '~/assets/profile_placeholder.svg'

let songData = [
  {
    title: 'They Say',
    artist: 'Wowa & Pipo',
    album: 'Single'
  },
  {
    title: 'Contrapunctus 2',
    artist: 'Kimiko Ishizaka',
    album: 'The Art of the Fuge'
  },
  {
    title: 'Varianto 3 a 1 Clav. Canone all Unisuono',
    artist: 'Kimiko Ishizaka',
    album: 'Goldberg Variations'
  },
  {
    title: "I'll Do It All Over Again",
    artist: 'Billy Murray',
    album: 'Single'
  },
  {
    title: 'Easy [iPhone Production]',
    artist: 'Wowa',
    album: 'Single'
  }
]

let albumData = [
  {
    title: 'Goldberg Variations',
    artist: 'Kimiko Ishizaka',
    songCount: 25
  },
  {
    title: 'adfs',
    artist: 'sdfadsf',
    songCount: 5
  },
  {
    title: 'The Art of the Fuge',
    artist: 'Kimiko Ishizaka',
    songCount: 5
  },
  {
    title: 'adfs',
    artist: 'sdfadsf',
    songCount: 5
  },
  {
    title: 'adfs',
    artist: 'sdfadsf',
    songCount: 5
  }
]

let artistData = [
  {
    name: '18:20',
    monthlyListeners: 736
  },
  {
    name: 'Kimiko Ishizaka',
    monthlyListeners: 4385
  },
  {
    name: 'Wowa',
    monthlyListeners: 3837
  },
  {
    name: 'Billy Murray',
    monthlyListeners: 34
  },
  {
    name: 'Mozart',
    monthlyListeners: 3453
  },
  {
    name: 'J. S. Bach',
    monthlyListeners: 5425
  }
]

const Home = (props) => (context) => {
  let { auth: { isAuthenticated, cognitoUser }, isLoadingFeatured, featured } = context

  return (
    <UIPage {...props} class={styles['home']} nonInteractive key='home'>
      <OpenGraph
        title='Flamous Music'
        description='Free high-quality music by our amazing community.'
      />
      <UIHeader
        noDynamicTitle
        nav={{
          start: <img class={styles['logo']} src={logo} />,
          end: isAuthenticated
            ? <div>
              <UILink to='/profile' class={cc([styles['profile-image']])} style={{ color: 'black', fontWeight: 'bold' }}><img src={cognitoUser.attributes.picture || profilePlaceholder} /></UILink>
            </div>
            : <div>
              <UILink to='/login' class='button white' style={{ color: 'black', fontWeight: 'bold' }}>Login</UILink>
              <UILink to='/signup' class='button white' style={{ fontWeight: 'bold' }}>Sign Up</UILink>
            </div>
        }}
        title='Explore'
      />
      <main class={styles['main']}>
        <section class='centered'>
          <h2>
            Featured Songs
          </h2>
          {
            isLoadingFeatured
              ? <UISpinner />
              : <SongList songs={featured.songs} />
          }
        </section>

        <div class={styles['separator']} />
        <section>
          <h2 class='centered'>
            Artists
          </h2>
          <ArtistList artists={artistData} />
        </section>

        <div class={styles['separator']} />
        <section class='centered'>
          <h2>
            New Albums
          </h2>
          <AlbumList albums={albumData} />
        </section>
      </main>
      <footer>
        <span>Privacy Policy</span>
        &middot;
        <span>Terms of Use</span>
        &middot;
        <span><a href='mailto:hello@flamous.io'>hello@flamous.io</a></span>
      </footer>
    </UIPage>
  )
}

export default Home
