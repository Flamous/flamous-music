/** @jsx h */
import { h } from 'hyperapp'
import { nestable } from 'hyperapp-context'
import { slideUp } from '../functions/animation'
import styles from './Login.css'
import Auth from '@aws-amplify/auth'
import flamousLogo from '~/assets/logo/brand_invert.png'
import UILink from '../UI/UILink'
import UISpinner from '../UI/UISpinner'

const state = {
  animation: slideUp.state,
  heroImage: null
}

const actions = {
  animation: slideUp.actions,
  fetchHeroImage: () => (_, actions) => {
    // let url = `https://api.unsplash.com/photos/random?query=musical instrument&featured&orientation=landscape`
    let url = `https://api.unsplash.com/photos/random?collections=4322548`

    let headers = new window.Headers()
    headers.append('Authorization', `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`)

    window.fetch(url, {
      headers
    })
      .then(response => response.json())
      .then(result => {
        actions.setHeroImage(result.urls.regular)
      })
      .catch(console.warn)
  },
  setHeroImage (url) {
    return {
      heroImage: url
    }
  }
}

const view = (state, actions) => (props, children) => (context) => {
  let { auth: { isAuthenticated }, login, actions: { login: loginActions, auth } } = context
  let { animation: { start: startAnimation }, fetchHeroImage } = actions
  let { heroImage } = state
  let isLogin = props.match.path === '/login' // Is either /login or /signup
  let previousUrl = props.location.previous === '/login' || props.location.previous === '/signup' ? '/' : props.location.previous

  if (isAuthenticated) {
    window.history.replaceState(previousUrl, '', '/profile')
  }
  function handleInput (event) {
    loginActions.update(
      {
        [event.target.id]: event.target.value
      })
  }

  async function handleSubmit (event) {
    event.preventDefault()

    if (!login.hasSubmittedEmail) {
      loginActions.update({
        isLoading: true
      })
      try {
        await Auth.signUp({
          username: login.email,
          password: login.password,
          attributes: {
            nickname: login.name
          }
        })

        loginActions.update({
          hasSubmittedEmail: true,
          isLoading: false
        })
      } catch (error) {
        loginActions.update({
          errorMessage: error.message,
          isLoading: false
        })
        console.error(error)
      }
    } else if (!login.hasSubmittedAuthCode) {
      loginActions.update({
        isLoading: true
      })
      try {
        await Auth.confirmSignUp(
          login.email,
          login.authCode
        )
        await Auth.signIn(
          login.email,
          login.password
        )

        loginActions.update({
          hasSubmittedEmail: false,
          isLoading: false,
          email: null,
          password: null,
          errorMessage: null
        })

        auth.init()
        // window.history.replaceState(previousUrl, '', previousUrl)
        window.history.replaceState(previousUrl, '', '/profile')
      } catch (error) {
        loginActions.update({
          errorMessage: error.message,
          isLoading: false
        })
        console.error(error)
      }
    }
  }

  async function handleLogin (event) {
    event.preventDefault()

    try {
      loginActions.update({
        isLoading: true
      })
      await Auth.signIn(
        login.email,
        login.password
      )

      auth.init()
      loginActions.update({
        email: null,
        password: null,
        errorMessage: null,
        isLoading: false
      })

      // window.history.replaceState(previousUrl, '', previousUrl)
      window.history.replaceState(previousUrl, '', '/profile')
    } catch (error) {
      if (error.code === 'UserNotConfirmedException') {
        loginActions.update({
          isLoading: true
        })
        console.info('User is not confirmed. Sending confirm code again.')

        await Auth.resendSignUp(
          login.email
        )
        loginActions.update({
          isLoading: false,
          hasSubmittedEmail: true
        })
        window.history.replaceState({}, '', '/signup')
        return
      }
      loginActions.update({
        errorMessage: error.message,
        isLoading: false
      })
      console.error(error)
    }
  }

  return <div
    class={styles['wrapper']}
    key='login'
    oncreate={(element) => { fetchHeroImage(); element.parentNode.actions = actions; startAnimation({ element, initialLoad: context.initialLoad }) }}
  >
    <div class={styles['hero-image']}>
      <img
        onload={event => {
          let heroImageWrapper = event.target.parentNode
          window.requestAnimationFrame(() => {
            window.requestAnimationFrame(() => {
              heroImageWrapper.classList.add('loaded')
            })
          })
        }}
        src={heroImage || ''}
      />
    </div>
    <header class={styles['header']}>
      <div class={styles['top-row']}>
        <span><img src={flamousLogo} /></span>
        <UILink replace to={previousUrl} class='button white'>Close</UILink>
      </div>

      <h1>
        {
          isLogin
            ? 'Sign In'
            : 'Create Account'
        }
      </h1>
    </header>

    <main class={styles['main']}>
      <section>
        {

          isLogin
            ? <div>
              <p>Share your music with the world.</p>
              <form onsubmit={handleLogin}>
                {
                  !login.hasSubmittedEmail && <div>
                    {
                      login.isLoading
                        ? <div><UISpinner /><p>Logging in...</p></div>
                        : <div>
                          <input aria-label='Email' autocomplete='email' id='email' oninput={handleInput} value={login.email} class={styles['input']} type='email' placeholder='E-Mail Address' />

                          <input aria-label='Password' autocomplete='current-password' class={styles['input']} id='password' oninput={handleInput} value={login.password} type='password' placeholder='Password' />
                          {/* <span class={styles['dots']}>••••••••</span> */}

                          <div style={{ textAlign: 'center' }}>
                            <button type='submit'>Login</button>
                            <br />
                            <UILink class='button white' replace to='/signup'>or Create Account</UILink>
                          </div>

                          <p class={styles['error']}>
                            {login.errorMessage && login.errorMessage}
                          </p></div>
                    }

                  </div>
                }
              </form>
            </div>
            : <div>
              <form onsubmit={handleSubmit}>
                {
                  !login.hasSubmittedEmail && <div>
                    <p>Join our community  of music lovers and musicians.</p>
                    {
                      login.isLoading
                        ? <div><UISpinner /></div>
                        : <div>
                          <label for='name'>Display name</label>
                          <input required autocomplete='username email' id='name' oninput={handleInput} value={login.name} class={styles['input']} type='text' placeholder='E.g. John Baginbu' />

                          {/* <label for='name'>Username</label>
                          <input id='username' oninput={handleInput} value={login.username} class={styles['input']} type='text' /> */}

                          <label for='name'>E-Mail</label>
                          <input required autocomplete='email' id='email' oninput={handleInput} value={login.email} class={styles['input']} placeholder='E.g. your-email@example.com' type='email' />

                          {/* <label for='name'>Password</label> */}
                          <input aria-label='Password' required autocomplete='current-password' class={styles['input']} id='password' oninput={handleInput} value={login.password} placeholder='Password' type='password' />

                          <div style={{ textAlign: 'center' }}>
                            <button type='submit'>Next</button>
                            <br />
                            <UILink class='button white' replace to='/login'>or Log In</UILink>
                          </div>

                          <p class={styles['error']}>
                            {login.errorMessage && login.errorMessage}
                          </p></div>
                    }
                  </div>
                }
                {
                  login.hasSubmittedEmail && !login.hasSubmittedAuthCode && <div>
                    {
                      login.isLoading
                        ? <div><UISpinner /><p>Checking code...</p></div>
                        : <div>
                          <p class={styles['info']}>
                            We sent a verification code to<br /><i>{login.email}</i>
                          </p>
                          <input id='authCode' oninput={handleInput} value={login.authCode} class={styles['input']} type='text' placeholder='Verification Code' />
                          <div style={{ textAlign: 'center' }}>
                            <button type='submit'>Confirm</button>
                          </div></div>
                    }
                  </div>
                }
              </form>

            </div>
        }

      </section>
    </main>
    <footer>
      <span>Privacy Policy</span>
      &middot;
      <span>Terms of Use</span>
      &middot;
      <span>Support: <a href='mailto:hello@flamous.io'>hello@flamous.io</a></span>

    </footer>
  </div>
}

const Login = nestable(
  {
    ...state
  },
  {
    ...actions
  },
  view,
  'login-page'
)

export default (props) => { return <Login onremove={(elem, done) => { elem.actions.animation.slideOut({ done, elem }) }} {...props} /> }
