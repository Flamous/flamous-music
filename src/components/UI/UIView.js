/** @jsx h */
import { h } from 'hyperapp'
import styles from './UIView.css'
import cc from 'classcat'

const UIView = (props) => (context, setContext) => {
  let { displayView } = props
  let { views } = context
  let active = views.activeView === displayView

  let length = views.stacks[displayView].stack.length

  return (
    <div class={cc([styles['ui-view'], { [styles['active']]: active }])}>
      {views.stacks[displayView].stack
        .map((obj, index) => {
          let { Component, path } = obj
          let key = `${index} | ${path}`

          return <Component key={key} isActivePage={index === (length - 1) && active} />
        })}
    </div>
  )
}

export default UIView
