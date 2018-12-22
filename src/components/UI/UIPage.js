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

    !back && setBackLocation((props.back && props.back.to) || location.previous)

    return <article
      {...props}
      class={cc([styles['page'], props.class])}
      key={props.key}
      oncreate={(element) => { element.parentNode.actions = actions; !props.hasOwnProperty('nonInteractive') ? animation.start({ element, initialLoad: context.initialLoad }) : window.flamous.setInitialLoad(false) }}
    >
      {children}
    </article>
  },
  'ui-page')

export default (props, children) => <UIPage key={props.path} {...props} onremove={(elem, done) => { elem.actions.animation.slideOut(done) }}>{children}</UIPage>
