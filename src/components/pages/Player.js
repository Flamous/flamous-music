/** @jsx h */
import { h } from 'hyperapp'
import { spring, value, styler, listen, pointer, transform } from 'popmotion'
import { nestable } from 'hyperapp-context'
import styles from './Player.css'

import playImage from '../assets/play.svg'
import pauseImage from '../assets/pause.svg'
import prevImage from '../assets/prev.svg'
import nextImage from '../assets/next.svg'
import downArrow from '../assets/down.svg'
import downloadImage from '../assets/download.svg'

let { snap } = transform

const state = {

}

const actions = {

}

const view = () => () => () => {
  return <div
    class={styles['player']}
  />
}

const Player = nestable(
  {
    ...state
  },
  {
    ...actions
  },
  view,
  'page-player'
)

export default (props) => { return <Player {...props} key='player' /> }
