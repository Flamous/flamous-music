import { h } from 'hyperapp' // @jsx h
import styles from './ShareButton.css'
import UIIcon from './UI/UIIcon'

export function ShareButton (props, children) {
  return (state, actions) => {
    let { shareAPI } = state
    return shareAPI ? <button onclick={(event) => {
      if (shareAPI) {
        navigator.share({
          title: 'Free high-quality music - Flamous',
          url: window.location.href,
          text: 'Some descriptive text...'
        })
      }
    }} class={styles['share-button']}>
      <UIIcon icon='share-2' />
    </button> : null
  }
}
