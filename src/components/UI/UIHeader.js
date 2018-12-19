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
  let { nav = {}, title, isHeaderTitleHidden } = props
  let { start, middle, end } = nav

  return <div class={styles['header-nav']}>
    <div class={styles['content']}>

      <div class={styles['container']}>
        <span class={styles['item']}>
          {start && start}
        </span>
      </div>

      <div class={styles['container']}>
        <span class={cc([styles['item'], { [styles['header-title-hidden']]: isHeaderTitleHidden }])}>
          <span>{(middle && middle) || <pre> </pre>}</span>
          <span class={styles['dynamic-title']}>{title}</span>
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
        rootMargin: '-75px 0px 0px 0px'
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
  let { title, nav = {} } = props
  let { initObserver } = actions

  return <header>
    <HeaderNav isHeaderTitleHidden={state.isHeaderHidden} title={title} nav={nav}>
      {[
        nav.start,
        nav.middle,
        nav.end
      ]}
    </HeaderNav>
    <HeaderTitle oncreate={initObserver}>{title}</HeaderTitle>
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
