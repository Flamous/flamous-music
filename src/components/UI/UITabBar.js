/** @jsx h */
import { h } from 'hyperapp'
import { Link } from '@hyperapp/router'
import styles from './UITabBar.css'
import placeholderImage from '~/assets/song_placeholder.svg'
import homeSVG from '~/assets/home.svg'
import profileSVG from '~/assets/profile.svg'
import bookSVG from '~/assets/book.svg'

const UITabBar = (props, children) => (context) => {
  let { actions: { views: { setActive } } } = context

  const SetActive = (props, children) => {
    let { viewName } = props

    delete props.viewName

    return <div onclick={() => setActive(viewName)} {...props}>
      {children}
    </div>
  }

  return <nav class={styles['tab-bar']}>
    <Link to='/player' class={styles['item']}>
      <img alt='Cover Image' src={placeholderImage} />
    </Link>

    <SetActive viewName='home' class={styles['item']}>
      <img alt='Home Icon' src={homeSVG} />
      <span>Home</span>
    </SetActive>

    <SetActive viewName='music-kit' class={styles['item']}>
      <img alt='Music Kit Icon' src={bookSVG} />
      <span>Music Kit</span>
    </SetActive>

    <SetActive viewName='library' class={styles['item']}>
      <img alt='Library Icon' src={profileSVG} />
      <span>Library</span>
    </SetActive>
  </nav>
}

export default UITabBar
