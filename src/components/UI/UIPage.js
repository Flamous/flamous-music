import { h } from 'hyperapp'
import picostyle from 'picostyle'
import { nestable } from 'hyperapp-context'
import { slideIn } from '../functions/animation'
import cc from 'classcat'

const style = picostyle(h)

const StyledPage = style('article')({
  height: '100%',
  width: '100%',
  position: 'fixed',
  overflowY: 'auto',
  // color: '#212121',
  // backgroundColor: 'white',
  boxShadow: '0 0 10px 0 rgba(0, 0, 0, 0.2)',
  overscrollBehavior: 'contain'
})

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

    return <StyledPage
      {...props}
      class={cc(['page', props.class])}
      key={props.key}
      oncreate={(element) => { element.parentNode.actions = actions; !props.hasOwnProperty('nonInteractive') ? animation.start({ element, initialLoad: context.initialLoad }) : window.flamous.setInitialLoad(false) }}
    >
      {children}
    </StyledPage>
  },
  'ui-page')

export default (props, children) => <UIPage key={props.path} {...props} onremove={(elem, done) => { elem.actions.animation.slideOut(done) }}>{children}</UIPage>
