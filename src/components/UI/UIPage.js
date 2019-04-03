/** @jsx h */
import { h } from 'hyperapp'
import { nestable } from 'hyperapp-context'
import { slideIn } from '../functions/animation'
import cc from 'classcat'
import styles from './UIPage.css'

const state = {
  animation: slideIn.state,
  hasLoaded: false,
  back: null,
  child: {}
}

const actions = {
  setHasLoaded: () => ({ hasLoaded: true }),
  setState: (state) => ({ ...state }),
  animation: slideIn.actions,
  setBackLocation: (backUrl) => {
    return {
      back: backUrl || '/'
    }
  },
  childPut (obj) {
    return {
      ...obj
    }
  }
}

const UIPage = nestable(
  { ...state },
  { ...actions },

  (state, actions) => (props, children) => (context, setContext) => {
    let { setBackLocation, animation, childPut, setHasLoaded } = actions
    let { back, hasLoaded } = state
    let { location } = context
    let { isActivePage } = props

    setContext({
      ...context,
      page: {
        put: childPut,
        state: state
      }
    })

    !back && setBackLocation((props.back && props.back.to) || location.previous)

    return <article
      {...props}
      class={cc([styles['page'], { [styles['loaded']]: hasLoaded }, props.class])}
      key={props.key}
      oncreate={(element) => {
        element.parentNode.actions = actions
        animation.start({ element, isActivePage, initialLoad: context.initialLoad, nonInteractive: props.hasOwnProperty('nonInteractive') })

        setHasLoaded()
      }}
    >
      {children}
    </article>
  },
  'ui-page')

export default (props, children) => <UIPage key={props.path} {...props} class={cc([props.class, { active: props.isActivePage }])} onremove={(element, done) => { element.actions.animation.slideOut({ done, element }) }}>{children}</UIPage>
