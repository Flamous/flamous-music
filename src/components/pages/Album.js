/** @jsx h */
import { h } from 'hyperapp'
import styles from './Album.css'

import UIPage from '../UI/UIPage'
import UIHeader from '../UI/UIHeader'
import UIBackButton from '../UI/UIBackButton'

let state = {

}

let actions = {

}

let View = (state, actions) => () => () => {
  return (
    <div class={styles['album']}>
      <UIHeader
        title='Album'
        nav={{
          start: <UIBackButton />,
          middle: 'Album'
        }}
      />

      <main>
        Some stuff here
      </main>
    </div>
  )
}

export default (props) => (
  <UIPage {...props}>
    <View {...props} />
  </UIPage>
)
