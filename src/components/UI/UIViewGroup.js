/** @jsx h */
import { h } from 'hyperapp'
import { nestable } from 'hyperapp-context'
import { Route } from '@hyperapp/router'

const state = {
  root: null,
  pages: {
    stack: []
  }
}

const actions = {
  init (props) {
    let { root, scope } = props

    console.log(scope)

    return {
      scope,
      root,
      pages: {
        rootScope: scope,
        stack: [root]
      }
    }
  },
  pages: {
    add: (page) => (state) => {
      let { route, instance, path } = page
      let newStack = [...state.stack]

      console.log(`Adding new page to stack ${state.rootScope} | page: ${route}`)

      newStack.push({
        route,
        instance,
        path
      })

      return {
        stack: newStack
      }
    },
    remove: () => (state) => {
      let { stack } = state
      let newStack = [...stack]

      console.log(`Removing page from stack ${state.scope} | page: ${stack[stack.length - 1].path}`)

      newStack.pop()

      return {
        stack: newStack
      }
    }
  },
  handleViewChange: (change) => (state) => {
    let { scope } = state
    console.log(`Changing view to ${change} | ${scope}`)

    return state
  }
}

const UIViewGroup = nestable(
  { ...state },
  { ...actions },

  (state, actions) => (props, children) => (context, setContext) => {
    let { pages: pagesActions, handleViewChange } = actions
    let { registerView } = context
    let { pages, scope } = state

    setContext({
      ...context,
      pages: { ...pagesActions, ...pages },
      scope
    })

    return <div oncreate={registerView}>
      <Route path={scope} render={() => {
        return <span key={scope} onremove={() => handleViewChange('blur')} oncreate={() => handleViewChange('focus')} />
      }} />
    { children }
    { pages.stack.map((page) => { return <page.instance context={context} /> }) }
    </div>
  },
  'ui-view')

export default (props, children) => {
  return <UIViewGroup key={props.scope} {...props}>{children}</UIViewGroup>
}
