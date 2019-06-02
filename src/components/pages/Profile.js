/** @jsx h */
import { h } from 'hyperapp'
import UIPage from '../UI/UIPage'
import UILink from '../UI/UILink'
import UIHeader from '../UI/UIHeader'
import UISpinner from '../UI/UISpinner'
import styles from './Profile.css'
import placeholderAlbum from '~/assets/song_placeholder.svg'
// import placeholderUser from '~/assets/profile.svg'
import UIIcon from '../UI/UIIcon'
import Storage from '@aws-amplify/storage'
import Auth from '@aws-amplify/auth'

const Library = (props) => (state, actions) => (context) => {
  let { auth, actions: { auth: { logout, update: refreshUserAttributes } } } = state
  let { page: { put, state: pageState }, auth: { artistId } } = context
  let isAlbums = auth.albums && Object.keys(auth.albums).length > 0

  let preferredUsername = auth.user && auth.user.attributes && auth.user.attributes.preferred_username
  let name = auth.user && auth.user.attributes && auth.user.attributes.nickname

  function handleInput (event) {
    put({
      [event.target.id]: event.target.value
    })
  }

  async function saveProfile () {
    let user = await Auth.currentAuthenticatedUser()
    try {
      await Auth.updateUserAttributes(user, {
        preferred_username: pageState.preferredUsername,
        nickname: pageState.name
      })

      refreshUserAttributes({
        user: await Auth.currentUserInfo()
      })
      put({
        inEditMode: false
      })
    } catch (error) {
      console.error(error)
    }

    await uploadProfileImage()
  }

  async function uploadProfileImage () {
    let imagePath = `artists/${artistId}/profile-picture`
    let file = pageState.profilePicture

    return

    try {
      await Storage.put(imagePath, file, {
        level: 'protected',
        contentType: file.type,
        progressCallback (progress) {
          console.info(progress)
          console.info(`Uploaded ${(progress.loaded / progress.total) * 100}%`)
        }
      })
    } catch (error) {
      console.error(error)
    }
  }

  let UserHeader = () => {
    let inEditMode = pageState.inEditMode
    let DisplayName = inEditMode
      ? <input type='text' id='name' placeholder='Type your name...' value={pageState.name} oninput={handleInput} />
      : <div class={styles['display-name']}>{name || <i>No name set</i>}</div>

    let UserName = inEditMode
      ? <input type='text' id='preferredUsername' placeholder='Set a username...' value={pageState.preferredUsername} oninput={handleInput} />
      : <span class={styles['username']}>{preferredUsername ? `@${preferredUsername}` : <i>No username set</i>}</span>

    let UserImage = inEditMode
      ? (<div class={styles['user-image']}>
        <UIIcon icon='user' />
        <label for='profile-picture'>
          <button class='white'>Change <UIIcon height='20' width='20' icon='image' /></button>
        </label>
        <input id='profile-picture' oninput={event => { put({ profilePicture: event.target.files[0] }) }} accept='image/*' type='file' />
      </div>)
      : <div class={styles['user-image']}>
        <UIIcon icon='user' />
      </div>

    return <div class={styles['user-info']}>
      { UserImage }
      <div>
        { DisplayName }
        { UserName }
      </div>
    </div>
  }

  function toggleEditMode () {
    let inEditMode = !pageState.inEditMode
    put({
      inEditMode,
      name,
      preferredUsername
    })
  }

  let Header = () => {
    let nav

    if (pageState.inEditMode) {
      nav = {
        start: <button onclick={toggleEditMode} class='white'>Cancel</button>,
        middle: 'Edit Profile',
        end: <button onclick={saveProfile}>Save</button>
      }
    } else {
      nav = {
        middle: 'Profile',
        end: <button onclick={toggleEditMode} class='white'>
            Edit
        </button>
      }
    }

    return <UIHeader
      noDynamicTitle
      title={UserHeader}
      nav={nav}
    />
  }

  let Content = () => {
    return <div>
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
                    You have not created an album yet.
                  </p>
                </div>
              }
              {
              (auth.isLoadingAlbums || auth.isLoadingUser) && <UISpinner />
            }
              {
                isAlbums && auth.albums.map((album) => {
                // let formattedLastUpdated
                // if (album.lastUpdated) {
                //   formattedLastUpdated = new Date(album.lastUpdated * 1000).toLocaleDateString(navigator.language, { year: '2-digit', month: 'short', day: 'numeric' })
                // }
                  return <li><UILink class={styles['album']} to={`/album-editor/${album.albumId}`}>
                    <div class={styles['image-wrapper']}>
                      <img src={album.imageSource ? `${auth.s3BasePath}/${album.imageSource}${album.lastUpdated ? `?${album.lastUpdated}` : ''}` : placeholderAlbum} />
                    </div>
                    <div class={styles['text-wrapper']}>
                      <div>
                        <span class={styles['primary-text']}>{album.title}</span><br />
                        <span class={styles['secondary-text']}><i>DRAFT</i></span>
                      </div>
                    </div>
                    <UIIcon width='32' icon='chevron-right' />
                  </UILink>
                  </li>
                })
              }
              <li>
                {/* <UILink to='create-album' class='button white'><UIIcon icon='plus' /> New Album</UILink> */}
                <p style={{ textAlign: 'center' }}>
                  <UILink to='/album-editor/new' class='button white'><UIIcon icon='plus' /> Create New Album</UILink>
                </p>
              </li>
            </ul>

            
          </section>

          <h3>Account</h3>
          <section class={styles['account']}>
            <div class='row'>
              <div class={styles['text']}>
          Logged in as<br /><b>{auth.cognitoUser.attributes.email}</b>
              </div>
              <div>
                <button style={{ color: 'rgb(255,59,48)' }} class='white' onclick={logout}>Logout</button>
              </div>
            </div>
            <UILink class='row' to='/settings/change-password'>
              <span style={{ flexGrow: '1' }}>Change Password</span>
              <UIIcon icon='chevron-right' />
            </UILink>
          </section>

          <h3>About</h3>
          <section class={styles['account']}>
            <UILink class='row' to='/flamous-license'>
              <span style={{ flexGrow: '1' }}>Flamous License</span>
              <UIIcon icon='chevron-right' />
            </UILink>
            <UILink class='row' to='/privacy-policy'>
              <span style={{ flexGrow: '1' }}>Privacy Policy</span>
              <UIIcon icon='chevron-right' />
            </UILink>
            <UILink class='row' to='/terms'>
              <span style={{ flexGrow: '1' }}>Terms of Use</span>
              <UIIcon icon='chevron-right' />
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
  }

  return <div>
    <Header />
    {
      !pageState.inEditMode && <Content />
    }
  </div>
}

export default (props) => <UIPage {...props} nonInteractive>
  <Library {...props} />
</UIPage>
