// import Home from '../components/Home.js'
import Home from '../components/pages/Countdown.js'
import Profile from '../components/pages/Profile'
import Library from '../components/pages/Library'

const state = {
  stacks: {
    home: {
      stack: [
        {
          viewName: 'home',
          path: '/',
          Component: Home
        }
      ],
      root: '/'
    },
    'profile': {
      stack: [
        {
          viewName: 'profile',
          path: '/profile',
          Component: Profile
        }
      ],
      root: '/profile'
    },
    library: {
      stack: [
        {
          viewName: 'library',
          path: '/library',
          Component: Library
        }
      ],
      root: '/library'
    }
  },
  activeView: 'home'
}

const actions = {
  setActive: (viewName) => (state) => {
    let { stacks } = state
    let stackInQuestion = stacks[viewName].stack

    let goTo = stacks[viewName].root

    if (stackInQuestion.length > 0) {
      goTo = stackInQuestion[stacks[viewName].stack.length - 1].path // Last item
    }

    window.history.pushState({}, '', goTo)
  },
  add: (options) => (state, views) => {
    let { viewName, path, Component, silent } = options
    let stacks = { ...state.stacks }
    let { activeView } = state
    let stackInQuestion = stacks[viewName].stack

    if (stackInQuestion.length > 0 && path === stackInQuestion[stackInQuestion.length - 1].path) {
      if (activeView !== viewName) {
        return { activeView: viewName }
      }
      return
    }

    if (stackInQuestion.length > 1 && path === stackInQuestion[stackInQuestion.length - 2].path) {
      stackInQuestion.pop()

      return {
        stacks,
        activeView: viewName
      }
    }

    if (silent) {
      stackInQuestion.unshift({
        viewName,
        path,
        Component
      })
    } else {
      stackInQuestion.push({
        viewName,
        path,
        Component
      })
    }

    return {
      stacks,
      activeView: viewName
    }
  },
  // The same logic as UIBackButton but as API
  back: (options = {}) => (state) => {
    let { to, replace, back } = options
    let { activeView, stacks } = state

    let parentViewStack = stacks[activeView].stack
    let previousViewStackPath = parentViewStack.length > 1 && parentViewStack[parentViewStack.length - 2].path

    let { location } = window.flamous.getState()
    let isBrowserHistoryBack = location.previous === previousViewStackPath

    to = to || (previousViewStackPath || `/${activeView}`)
    replace = replace || !isBrowserHistoryBack
    back = back || isBrowserHistoryBack

    if (!replace && !back) {
      window.history.pushState(location.pathname, '', to)
      return
    }
    if (replace) {
      window.history.replaceState(location.previous, '', to)
      return
    }
    if (back) window.history.back()
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
}

export default {
  state,
  actions
}
