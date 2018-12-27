/** @jsx h */
import { h } from 'hyperapp'
import { nestable } from 'hyperapp-context'
import { slideIn } from '../functions/animation'
import cc from 'classcat'
import styles from './UIPage.css'

const state = {
  animation: slideIn.state,
  back: null
}

const actions = {
  init (props) {
    // do Something...
  },
  mount () {

  },
  animation: slideIn.actions,
  setBackLocation: (backUrl) => {
    return {
      back: backUrl || '/'
    }
  }
}

const UIPage = nestable(
  { ...state },
  { ...actions },

  (state, actions) => (props, children) => (context) => {
    let { setBackLocation, animation } = actions
    let { back } = state
    let { location } = context
    let { isActivePage } = props

    !back && setBackLocation((props.back && props.back.to) || location.previous)

    return <article
      {...props}
      class={cc([styles['page'], props.class])}
      key={props.key}
      oncreate={(element) => { element.parentNode.actions = actions; animation.start({ element, isActivePage, initialLoad: context.initialLoad, nonInteractive: props.hasOwnProperty('nonInteractive') }) }}
    >
      {children}
    </article>
  },
  'ui-page')

export default (props, children) => <UIPage key={props.path} {...props} onremove={(element, done) => { element.actions.animation.slideOut({ done, element }) }}>{children}</UIPage>
