/** @jsx h */
import { h } from 'hyperapp'
import { Route } from '@hyperapp/router'

const UIViewRoute = (props, children) => (context) => {
  let { render: RenderComponent, viewName, path } = props
  let { actions } = context

  delete props.render
  delete props.viewName
  delete props.path
  // console.log('here2')

  return (
    <Route
      {...props}
      path={path}
      render={(matchProps) => {
        actions.views.add({
          viewName,
          path,
          Component: (props, children) => <RenderComponent {...matchProps} {...props} >{children}</RenderComponent>
        })
      }} />
  )
}

export default UIViewRoute
