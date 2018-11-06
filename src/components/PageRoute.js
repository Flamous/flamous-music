/** @jsx h */
import { h } from 'hyperapp'
import { Route } from '@hyperapp/router'

const PageRoute = (props) => {
  const routeProps = {
    path: props.path,
    render: (matchProps) => {
      return <Container page={props.render} name={matchProps.location.pathname} {...matchProps} {...props} />
    },
    parent: props.hasOwnProperty('parent')
  }

  return <Route {...routeProps} />
}

const Container = (props, children) => (state) => {
  let stack = state.pages.stack

  if ((stack.length >= 2 && stack[stack.length - 2].name === props.name)) {
    state.actions.pages.back(false)
  } else
  if ((stack.length >= 1 && stack[stack.length - 1].name !== props.name)) {
    state.actions.pages.add({
      page: (_, children) => {
        return <props.page {...props}>{children}</props.page>
      },
      name: props.name
    })
  } else
  if (stack.length === 0) {
    state.actions.pages.add({
      page: (_, children) => {
        return <props.page {...props}>{children}</props.page>
      },
      name: props.name
    })
  }
}

export default PageRoute
