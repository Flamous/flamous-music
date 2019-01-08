/** @jsx h */
import { h } from 'hyperapp'
import { nestable } from 'hyperapp-context'
import { slideUp } from '../functions/animation'
import styles from './Login.css'
import Auth from '@aws-amplify/auth'
import flamousLogo from '~/assets/flamous_logo_new_small.svg'
import UILink from '../UI/UILink'
import UISpinner from '../UI/UISpinner'
import { button } from '~/global.css'

const state = {
  animation: slideUp.state
}

const actions = {
  animation: slideUp.actions
}

const view = (state, actions) => (props, children) => (context) => {
  let { login, actions: { login: loginActions, auth: { setAuthenticated } } } = context
  let { animation: { start: startAnimation } } = actions
  let isLogin = props.match.path === '/login' // Is either /login or /signup
  let previousUrl = props.location.previous === '/login' || props.location.previous === '/signup' ? '/' : props.location.previous

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
        await Auth.signUp(
          login.email,
          login.password
        )

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
          hasSubmittedAuthCode: true,
          isLoading: false
        })
        let cognitoUser = await Auth.currentAuthenticatedUser()
        setAuthenticated(cognitoUser)
        loginActions.update({
          email: null,
          password: null,
          errorMessage: null
        })

        window.history.replaceState(previousUrl, '', previousUrl)
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
      let cognitoUser = await Auth.currentAuthenticatedUser()
      setAuthenticated(cognitoUser)
      loginActions.update({
        email: null,
        password: null,
        errorMessage: null,
        isLoading: false
      })

      window.history.replaceState(previousUrl, '', previousUrl)
    } catch (error) {
      loginActions.update({
        errorMessage: error.message,
        isLoading: false
      })
      console.error(error)
    }
  }

  function goBack () {
    window.history.replaceState(previousUrl, '', previousUrl)
  }

  return <div
    class={styles['wrapper']}
    key='login'
    oncreate={(element) => { element.parentNode.actions = actions; startAnimation({ element, initialLoad: context.initialLoad }) }}
  >
    <header class={styles['header']}>
      <div class={styles['top-row']}>
        <span><img src={flamousLogo} /></span>
        <span class={styles['back-button']} onclick={goBack}>Cancel</span>
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
                        : <div><input autocomplete='email' id='email' oninput={handleInput} value={login.email} class={styles['input']} type='email' placeholder='E-Mail Address' />

                          <input class={styles['input']} id='password' oninput={handleInput} value={login.password} type='password' placeholder='Password' />
                          <span class={styles['dots']}>••••••••</span>

                          <div style={{ textAlign: 'center' }}>
                            <button type='submit'>Login</button>
                            <br />
                            <UILink class={`${button} white`} replace to='/signup'>or Create Account</UILink>
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
                    <p>Join the future of music.<br />Listen, create, share.</p>
                    {
                      login.isLoading
                        ? <div><UISpinner /></div>
                        : <div><input autocomplete='email' id='email' oninput={handleInput} value={login.email} class={styles['input']} type='email' placeholder='E-Mail Address' />

                          <input class={styles['input']} id='password' oninput={handleInput} value={login.password} type='password' placeholder='Password' />
                          <span class={styles['dots']}>••••••••</span>

                          <div style={{ textAlign: 'center' }}>
                            <button type='submit'>Create Account</button>
                            <br />
                            <UILink class={`${button} white`} replace to='/login'>or Log In</UILink>
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

export default (props) => { return <Login onremove={(elem, done) => { elem.actions.animation.slideOut(done) }} {...props} /> }
