/** @jsx h */
import { h } from 'hyperapp'
import { Link } from '@hyperapp/router'
import UIPage from './UI/UIPage'
import styles from './MusicKit.css'

const MusicKit = () => {
  return <UIPage nonInteractive>
    <header class={styles.header}>
      <span>Curated for startes</span>
      <h1>Music Kit</h1>
      <p>Learn how to make music from start to finish.<br />The Music Starter Kit covers a wide variety of topics such as singing, recording and mastering.</p>
    </header>
  </UIPage>
}

export default MusicKit
