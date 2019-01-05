/** @jsx h */
import { h } from 'hyperapp'
import styles from './UIView.css'
import cc from 'classcat'

const UIView = (props) => (state) => {
  let { displayView } = props
  let { views } = state
  let active = views.activeView === displayView
  let stack = views.stacks[displayView].stack

  let length = stack.length

  return (
    <div class={cc([styles['ui-view'], { [styles['active']]: active }])}>
      {stack
        .map((obj, index) => {
          let { Component, path } = obj
          let key = `${index} | ${path}`

          return <Component key={key} isActivePage={index === (length - 1) && active} />
        })}
    </div>
  )
}

export default UIView
