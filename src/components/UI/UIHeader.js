/** @jsx h */
import { h } from 'hyperapp'
import { nestable } from 'hyperapp-context'
import styles from './UIHeader.css'
import cc from 'classcat'

const HeaderTitle = (props, children) => {
  return <div class={styles['header-title']} {...props}>
    <h1>
      {children}
    </h1>
  </div>
}

const HeaderNav = (props) => {
  let { nav = {}, title, isHeaderTitleHidden, noDynamicTitle } = props
  let { start, middle, end } = nav

  return <div style={cc({ [styles['header-title-hidden']]: isHeaderTitleHidden })} class={cc([styles['header-nav'], { [styles['header-title-hidden']]: isHeaderTitleHidden }])}>
    <div class={styles['content']}>

      <div class={styles['container']}>
        <span class={styles['item']}>
          {start && start}
        </span>
      </div>

      <div class={styles['container']}>
        <span class={cc([styles['item']])}>
          {
            noDynamicTitle && <span>{middle && middle}</span>
          }
          {
            !noDynamicTitle && [
              <span class={styles['middle']}>
                {/* eslint-disable-next-line */}
                {(middle && middle) || <pre> </pre>}
              </span>,
              <span class={styles['dynamic-title']}>{title}</span>
            ]
          }
        </span>
      </div>

      <div class={styles['container']}>
        <span class={styles['item']}>
          {end && end}
        </span>
      </div>
    </div>
  </div>
}

const state = {
  isHeaderHidden: false,
  observer: null,
  threshold: 0,
  back: null
}
const actions = {
  observerChange: (changes) => ({ threshold }, { setHeaderHidden }) => {
    if (changes[0].intersectionRatio <= threshold) {
      setHeaderHidden(true)
    } else {
      setHeaderHidden(false)
    }
  },
  initObserver: (elem) => ({ threshold }, { observerChange }) => {
    let observer = null
    if ('IntersectionObserver' in window) {
      observer = new window.IntersectionObserver(observerChange, {
        threshold: [threshold, 0.01],
        rootMargin: '-40px 0px 0px 0px'
      })
      observer.observe(elem)
    }

    return {
      observer: observer
    }
  },
  setHeaderHidden: (isHidden) => {
    return {
      isHeaderHidden: isHidden
    }
  }
}
const view = (state, actions) => (props, children) => (context) => {
  let { title, nav = {}, noSticky } = props
  let { initObserver } = actions
  let noDynamicTitle = props.hasOwnProperty('noDynamicTitle')

  return <header class={cc(['header', props.class, { [styles['no-sticky']]: noSticky }])}>
    <HeaderNav noDynamicTitle={noDynamicTitle} isHeaderTitleHidden={state.isHeaderHidden} title={title} nav={nav}>
      {[
        nav.start,
        nav.middle,
        nav.end
      ]}
    </HeaderNav>
    {
      title && <HeaderTitle oncreate={initObserver}>{title}</HeaderTitle>
    }
    <hr class={styles['header-line']} />
  </header>
}
const Header = nestable(
  {
    ...state
  },
  {
    ...actions
  },
  view,
  'flamous-header'
)

export default (props, children) => <Header class={styles['header']} {...props}>{children}</Header>
