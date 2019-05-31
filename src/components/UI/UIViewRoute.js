/** @jsx h */
import { h } from 'hyperapp'
import { Route } from '@hyperapp/router'

const UIViewRoute = (props, children) => (context) => {
  let { render: RenderComponent, viewName, path } = props
  let { actions, location, auth: { isLoadingUser } } = context

  delete props.render
  delete props.viewName
  delete props.path

  return (
    !isLoadingUser && <Route
      {...props}
      path={path}
      render={(matchProps) => {
        actions.views.add({
          viewName,
          path: location.pathname,
          Component: (props, children) => <RenderComponent {...matchProps} {...props} >{children}</RenderComponent>
        })
      }} />
  )
}

export default UIViewRoute
