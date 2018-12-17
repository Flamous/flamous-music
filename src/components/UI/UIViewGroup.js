/** @jsx h */
import { h } from 'hyperapp'
import { nestable } from 'hyperapp-context'
import { Route } from '@hyperapp/router'
import cc from 'classcat'
import styles from './UIViewGroup.css'

const state = {
  active: false,
  scopeId: null,
  scope: null,
  root: null,
  pages: {
    rootScope: null,
    rootScopeId: null,
    stack: []
  }
}

const actions = {
  init (props) {
    let { root, scope, active } = props

    if (!Array.isArray(scope)) console.warn('The scope attribute has to be an Array')

    let scopeId = scope.join('|')

    return {
      active,
      scopeId,
      scope: scope,
      root,
      pages: {
        rootScope: scope,
        rootScopeId: scopeId,
        stack: [{
          instance: root,
          path: scope,
          route: scope,
          props
        }]
      }
    }
  },
  pages: {
    add: (page) => (state) => {
      let { route, instance, path, props } = page
      let newStack = [...state.stack]

      // console.log(props)

      // console.log(`Adding new page to stack ${state.rootScopeId} | page: ${route}`)

      newStack.push({
        route,
        instance,
        path,
        props
      })

      return {
        stack: newStack
      }
    },
    remove: () => (state) => {
      let { stack } = state
      let newStack = [...stack]

      console.log(`Removing page from stack ${state.scopeId} | page: ${stack[stack.length - 1].path}`)

      newStack.pop()

      return {
        stack: newStack
      }
    }
  },
  handleViewChange: (change) => (state) => {
    let { scope, pages } = state
    let { setActive, path } = change
    // console.log(`Changing view to ${change} | ${scope}`)
    console.log(path)

    if (setActive) {
      setActive()
      // console.log(pages.stack[pages.stack.length - 1])
      // window.history.pushState({}, '', pages.stack[pages.stack.length - 1].path)
    }

    return state
  }
}

const UIViewGroup = nestable(
  { ...state },
  { ...actions },

  (state, actions) => (props, children) => (context, setContext) => {
    let { pages: pagesActions, handleViewChange } = actions
    let { actions: { views }, location } = context
    let { pages, scope, scopeId } = state

    setContext({
      ...context,
      pages: { ...pagesActions, ...pages },
      scope,
      scopeId
    })

    return <div oncreate={() => views.register({ scopeId })}>
      { // UIViewGroup route
        scope.map((scope) => {
          return <Route path={scope} render={(props) => {
            return <span key={scope} onremove={() => console.log('lost focus', scope)} oncreate={() => handleViewChange({ path: props, setActive: () => views.setActive(location.pathname) })} />
          }} />
        })

      }

      {/* { children } */}
      { // UIView rotues
        children.map((Child, index) => {
          return Child
        })
      }
      {console.log(pages.stack)}
      { // Stack
        pages.stack.map((page) => { return <page.instance {...page.props} /> })
      }
    </div>
  },
  'ui-view')

export default (props, children) => (context) => {
  let { views: { active: activeScope } } = context
  let active = props.scope.find((scope) => {
    return scope === activeScope
  })
  // console.log(active)
  return <UIViewGroup class={cc([styles['view-group'], { [styles['active']]: active }])} key={props.scope.join('|')} active={active} {...props}>{children}</UIViewGroup>
}
