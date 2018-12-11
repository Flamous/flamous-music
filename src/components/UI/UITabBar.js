/** @jsx h */
import { h } from 'hyperapp'
import { Link } from '@hyperapp/router'
import styles from './UITabBar.css'
import placeholderImage from '~/assets/song_placeholder.svg'

const UITabBar = (props, children) => {
  return <nav class={styles['tab-bar']}>
    <Link to='/stream-view' class={styles['item']}>
      <img alt='Cover Image' src={placeholderImage} />
    </Link>

    <Link to='/' class={styles['item']}>
      {/* <img alt='Cover Image' src={placeholderImage} /> */}
      <span>Home</span>
    </Link>

    <Link to='/music-kit' class={styles['item']}>
      {/* <img alt='Cover Image' src={placeholderImage} /> */}
      <span>Music Kit</span>
    </Link>

    <Link to='/library' class={styles['item']}>
      {/* <img alt='Cover Image' src={placeholderImage} /> */}
      <span>Library</span>
    </Link>
  </nav>
}

export default UITabBar
