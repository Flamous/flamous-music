/** @jsx h */
import { h } from 'hyperapp'
import UIPage from '../UI/UIPage'
import UILink from '../UI/UILink'
import UIHeader from '../UI/UIHeader'
import UISpinner from '../UI/UISpinner'
import styles from './Profile.css'
import placeholderAlbum from '~/assets/song_placeholder.svg'
import placeholderUser from '~/assets/profile.svg'
import UIIcon from '../UI/UIIcon'

const Library = (props) => (state, actions) => {
  let { auth, actions: { auth: { logout } } } = state
  let isAlbums = auth.albums && Object.keys(auth.albums).length > 0

  let UserHeader = () => {
    return <div class={styles['user-info']}>
      <div class={styles['user-image']}>
        <img src={placeholderUser} />
      </div>
      <div>
        <span class={styles['display-name']}>Display Name</span><br />
        <span class={styles['username']}>@username</span>
      </div>
    </div>
  }

  return <UIPage {...props} nonInteractive>
    <UIHeader
      noDynamicTitle
      title={UserHeader}
      nav={{
        middle: 'Profile',
        end: <button class='white'>Edit <UIIcon style={{ marginLeft: '5px' }} width='20' height='20' icon='edit-2' /></button>
      }}
    />

    <div>
      {
        !auth.isAuthenticated && <main>
          <p style={{ textAlign: 'center' }}>
            Share your music with the world. <br />Sign Up to upload music.
            <br />
            <br />
            <UILink class='button' to='/signup'>Create Account</UILink>
            <UILink class='button white' to='login'>or Sign In</UILink>
          </p>
        </main>
      }

      {
        auth.isAuthenticated && <main class={styles['main']}>
          <h3>Your Albums</h3>
          <section>

            <ul class={styles['album-list']}>
              {
                !isAlbums && !auth.isLoadingAlbums && <div>
                  <p style={{ textAlign: 'center' }}>
            You have not created an album yet
                  </p>
                </div>
              }
              {
                isAlbums && auth.albums.map((album) => {
                  // let formattedLastUpdated
                  // if (album.lastUpdated) {
                  //   formattedLastUpdated = new Date(album.lastUpdated * 1000).toLocaleDateString(navigator.language, { year: '2-digit', month: 'short', day: 'numeric' })
                  // }
                  return <li><UILink class={styles['album']} to={`/albums/${album.albumId}`}>
                    <div class={styles['image-wrapper']}>
                      <div class={styles['image-inner']}>
                        <img src={album.coverImagePath ? `${auth.s3BasePath}/albums/${album.albumId}/cover${album.lastUpdated ? `?${album.lastUpdated}` : ''}` : placeholderAlbum} />
                      </div>
                    </div>
                    <div class={styles['text-wrapper']}>
                      <div>
                        <span class={styles['primary-text']}>{album.title}</span><br />
                        <span class={styles['secondary-text']}>{Math.ceil(Math.random(10) * 10)} Songs • {Math.ceil(Math.random() * 2500).toLocaleString()} Listeners</span>
                      </div>
                    </div>
                    <UIIcon width='32' icon='chevron-right' />
                  </UILink>
                  </li>
                })
              }
              <li>
                <UILink to='create-album' class='button white'><UIIcon icon='plus' /> New Album</UILink>
              </li>
            </ul>

            {
              (auth.isLoadingAlbums || auth.isLoadingUser) && <UISpinner />
            }
          </section>

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

          <h3>About</h3>
          <section class={styles['account']}>
            <UILink class='row' to='/flamous-license'>
              <span style={{ flexGrow: '1' }}>Flamous License</span>
              <UIIcon width='32' icon='chevron-right' />
            </UILink>
            <UILink class='row' to='/privacy-policy'>
              <span style={{ flexGrow: '1' }}>Privacy Policy</span>
              <UIIcon width='32' icon='chevron-right' />
            </UILink>
            <UILink class='row' to='/terms'>
              <span style={{ flexGrow: '1' }}>Terms of Use</span>
              <UIIcon width='32' icon='chevron-right' />
            </UILink>
            <hr />
            <div class='row'>
              <div class={styles['text']}>
                Flamous Version
              </div>
              <div>
                { process.env.npm_package_version }
              </div>
            </div>
            <div class='row'>
              <div class={styles['text']}>
                Contact
              </div>
              <div>
                <a href='mailto:hello@flamous.io'>hello@flamous.io</a>
              </div>
            </div>
          </section>
        </main>
      }
    </div>
  </UIPage>
}

export default Library
