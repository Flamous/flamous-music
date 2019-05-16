/** @jsx h */
import { h } from 'hyperapp'
import styles from './Countdown.css'
import logo from '~/assets/logo/brand_invert.png'

export default () => {
  return <div class={styles['countdown']}>
    <div class={styles['inner-wrapper']}>
      <img src={logo} loading='eager' />
      <h1>We're about to launch.</h1>
      <p>Listen to free, high-quality music (soon)</p>
    </div>
  </div>
}
