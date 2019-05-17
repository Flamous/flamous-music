/** @jsx h */
import { h } from 'hyperapp'
import styles from './Countdown.css'
import logo from '~/assets/logo/brand.svg'

export default () => {
  return <div class={styles['countdown']}>
    <div class={styles['inner-wrapper']}>
      <img src={logo} loading='eager' />
      <p>Listen to free, high-quality music</p>
      <div class={styles['divider']} />
      <div>
        <p>We're about to launch. Check back on May 31st to listen to awesome free music.</p>
        <p>If you are in Vienna, <b>visit us at Schraubenfabrik</b>, 1020 Vienna, for the launch-event. There will be a talk, food and drinks 🥓. The event will be from 18:00 o'clock onwards, so check by!</p>
        <p><a href='https://goo.gl/maps/ht7Ddy53ePQyQyr69' target='_blank' rel='nofollow'>See it on a map</a></p>
      </div>
    </div>
  </div>
}
