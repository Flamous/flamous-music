/** @jsx h */
import { h } from 'hyperapp'
import UIPage from '../UI/UIPage'
import UILink from '../UI/UILink'
import UIHeader from '../UI/UIHeader'
import UISpinner from '../UI/UISpinner'
import UIBackButton from '../UI/UIBackButton'
import styles from './Profile.css'
import placeholderAlbum from '~/assets/song_placeholder.svg'
import UIIcon from '../UI/UIIcon'

const Library = (props) => (context, actions) => {
  let { auth, actions: { auth: { logout } } } = context
  let isAlbums = auth.albums && Object.keys(auth.albums).length

  return <UIPage {...props}>
    <UIHeader
      title='Profile'
      nav={{ start: <UIBackButton /> }}
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
            {
              isAlbums && <ul class={styles['album-list']}>
                {
                  auth.albums.map((album) => {
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
            }
            {
              !auth.albums && !auth.isLoadingAlbums && <div>
                <p>
            You have not created an album yet
                </p>
              </div>
            }
            {
              (auth.isLoadingAlbums || auth.isLoadingUser) && <UISpinner />
            }
          </section>
          <Divider />

          <section class={styles['account']}>
            <div class={styles['row']}>
              <div class={styles['text']}>
            Logged in as<br /><b>{auth.cognitoUser.attributes.email}</b>
              </div>
              <div>
                <button onclick={logout}>Logout</button>
              </div>
            </div>
          </section>
        </main>
      }
    </div>
  </UIPage>
}

export default Library

const Divider = () => <div class={styles['divider']} />
