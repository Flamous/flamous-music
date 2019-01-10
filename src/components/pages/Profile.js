/** @jsx h */
import { h } from 'hyperapp'
import UIPage from '../UI/UIPage'
import UILink from '../UI/UILink'
import UIHeader from '../UI/UIHeader'
import UISpinner from '../UI/UISpinner'
import UIBackButton from '../UI/UIBackButton'
import styles from './Profile.css'
import placeholderAlbum from '~/assets/song_placeholder.svg'

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
          <section>
            <h3>Your Albums</h3>
            {
              isAlbums && <div class={styles['album-list']}>
                {
                  auth.albums.map((album) => {
                    return <UILink class={styles['album']} to={`/albums/${album.albumId}`}>
                      <div class={styles['image-wrapper']}>
                        <img src={album.coverImagePath ? `${auth.s3BasePath}/albums/${album.albumId}/cover` : placeholderAlbum} />
                      </div>
                      <div class={styles['text-wrapper']}>
                        <div>
                          <h2>{album.title}</h2>
                          <p>{album.description || 'No description.'}</p>
                        </div>
                        <div class={styles['row-bottom']}>
                          <button class='white'>Edit</button>
                          <span>10 Songs</span>
                        </div>
                      </div>
                    </UILink>
                  })
                }
              </div>
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
            <div>
              <br />
              <UILink to='create-album' class='button'>Create New Album</UILink>
            </div>
          </section>

          <section style={{ borderTop: '1px solid rgba(0, 0, 0, 0.2)' }}>
            <div style={{ display: 'flex' }}>
              <div style={{ flexGrow: '1' }}>
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
