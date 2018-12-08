/** @jsx h */
import { h } from 'hyperapp'
import { Route } from '@hyperapp/router'
import { nestable } from 'hyperapp-context'

const state = {
  route: null,
  path: null
}

const actions = {
  init (props) {
    let { route } = props

    return {
      route
    }
  },
  setPath (path) {
    return {
      path
    }
  }
}

const UIPageView = nestable(
  { ...state },
  { ...actions },

  (state, actions) => (props, children) => (context, setContext) => {
    let { route, path } = state
    let { setPath } = actions
    let { pages, scope, location } = context

    if (!path) setPath(location.pathname)

    path = path || location.pathname

    let Child = props.render

    return <Route path={`${scope}/${route}`} render={() => {
      return <span key={route} oncreate={() => {
        let stack = context.pages.stack
        let lastElemIndex = stack.length - 1 // Starts at 0

        if ((lastElemIndex >= 1 && stack[lastElemIndex - 1].path === path)) {
          pages.remove()
        } else
        if ((lastElemIndex >= 1) || lastElemIndex === 0) {
          pages.add({
            instance: Child,
            scope,
            path
          })
        }
      }} />
    }} />
  },
  'ui-page-view'
)

export default (props, children) => { return <UIPageView key={props.path} {...props}>{children}</UIPageView> }
