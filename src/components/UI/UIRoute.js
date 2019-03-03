/** @jsx h */
import { h } from 'hyperapp'
import { Route } from '@hyperapp/router'

let UIRoute = (props) => (state) => {
  let { renderMode } = props
  let { location } = state

  if (renderMode === 'always') {
    let isMatch = location.pathname.startsWith(props.path)

    if (isMatch) {
      return <Route {...props} render={() => <props.render {...props} isMatch={isMatch} />} />
    }

    return <Route {...props} path={null} exact={false} render={() => <props.render {...props} isMatch={isMatch} />} />
  }

  return <Route {...props} />
}

export default UIRoute
