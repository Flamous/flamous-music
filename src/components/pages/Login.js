/** @jsx h */
import { h } from 'hyperapp'
import { nestable } from 'hyperapp-context'
import { slideUp } from '../functions/animation'
import styles from './Login.css'
import Auth from '@aws-amplify/auth'
import flamousLogo from '~/assets/flamous_logo_new_small.svg'
import UILink from '../UI/UILink'

const state = {
  animation: slideUp.state
}

const actions = {
  animation: slideUp.actions
}

const view = (state, actions) => (props, children) => (context) => {
  let { login, actions: { login: loginActions, auth: { isAuthenticated } } } = context
  let { animation: { start: startAnimation } } = actions
  let isLogin = props.match.path === '/login' // Is either /login or /signup
  let previousUrl = props.location.previous === '/login' || props.location.previous === '/login' ? '/' : props.location.previous

  function handleInput (event) {
    loginActions.update(
      {
        [event.target.id]: event.target.value
      })
  }

  async function handleSubmit (event) {
    event.preventDefault()

    if (!login.hasSubmittedEmail) {
      try {
        await Auth.signUp(
          login.email,
          login.password
        )

        loginActions.update({
          hasSubmittedEmail: true
        })
      } catch (error) {
        loginActions.update({
          errorMessage: error.message
        })
        console.error(error)
      }
    } else if (!login.hasSubmittedAuthCode) {
      try {
        await Auth.confirmSignUp(
          login.email,
          login.authCode
        )

        loginActions.update({
          hasSubmittedAuthCode: true
        })

        await Auth.signIn(
          login.email,
          login.password
        )
        let cognitoUser = await Auth.currentAuthenticatedUser()
        isAuthenticated(cognitoUser)
        loginActions.update({
          email: '',
          password: ''
        })

        window.history.replaceState(previousUrl, '', previousUrl)
      } catch (error) {
        loginActions.update({
          errorMessage: error.message
        })
        console.error(error)
      }
    }
  }

  async function handleLogin (event) {
    event.preventDefault()

    try {
      await Auth.signIn(
        login.email,
        login.password
      )
      let cognitoUser = await Auth.currentAuthenticatedUser()
      isAuthenticated(cognitoUser)
      loginActions.update({
        email: '',
        password: ''
      })

      window.history.replaceState(previousUrl, '', previousUrl)
    } catch (error) {
      loginActions.update({
        errorMessage: error.message
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
            ? 'Login'
            : 'Create Account'
        }
      </h1>
      {
        isLogin
          ? <p>Share your music with the world.<br />Listen to songs you love everywhere — even when you're offline.</p>
          : <p>The future of music will be open and inclusive.<br />Listen to, share and create your own.</p>
      }

    </header>

    <main class={styles['main']}>
      <section>
        {

          isLogin
            ? <form onsubmit={handleLogin}>
              {
                !login.hasSubmittedEmail && <div>
                  <input autocomplete='email' id='email' oninput={handleInput} value={login.email} class={styles['input']} type='email' placeholder='E-Mail Address' />

                  <input class={styles['input']} id='password' oninput={handleInput} value={login.password} type='password' placeholder='Password' />
                  <span class={styles['dots']}>••••••••</span>

                  <div style={{ textAlign: 'center' }}>
                    <button type='submit'>Login</button>
                    <br />
                    <UILink replace to='/signup'>Or create an account</UILink>
                  </div>
                  <p class={styles['info']}>
                    {login.hasSubmittedEmail && 'We have sent you an E-Mail with your confirmation code'}
                  </p>
                  <p class={styles['error']}>
                    {login.errorMessage && login.errorMessage}
                  </p>
                </div>
              }
              {
                login.hasSubmittedEmail && !login.hasSubmittedAuthCode && <div>
                  <input id='authCode' oninput={handleInput} value={login.authCode} class={styles['input']} type='text' placeholder='Verification Code' />
                  <div style={{ textAlign: 'center' }}>
                    <button type='submit'>Confirm</button>
                  </div>
                </div>
              }
            </form>
            : <form onsubmit={handleSubmit}>
              {
                !login.hasSubmittedEmail && <div>
                  <input autocomplete='email' id='email' oninput={handleInput} value={login.email} class={styles['input']} type='email' placeholder='E-Mail Address' />

                  <input class={styles['input']} id='password' oninput={handleInput} value={login.password} type='password' placeholder='Password' />
                  <span class={styles['dots']}>••••••••</span>

                  <div style={{ textAlign: 'center' }}>
                    <button type='submit'>Create Account</button>
                    <br />
                    <UILink replace to='/login'>Log In instead</UILink>
                  </div>
                  <p class={styles['info']}>
                    {login.hasSubmittedEmail && 'We have sent you an E-Mail with your confirmation code'}
                  </p>
                  <p class={styles['error']}>
                    {login.errorMessage && login.errorMessage}
                  </p>
                </div>
              }
              {
                login.hasSubmittedEmail && !login.hasSubmittedAuthCode && <div>
                  <input id='authCode' oninput={handleInput} value={login.authCode} class={styles['input']} type='text' placeholder='Verification Code' />
                  <div style={{ textAlign: 'center' }}>
                    <button type='submit'>Confirm</button>
                  </div>
                </div>
              }
            </form>
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
