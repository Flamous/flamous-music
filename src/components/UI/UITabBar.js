/** @jsx h */
import { h } from 'hyperapp'
import { Link } from '@hyperapp/router'
import styles from './UITabBar.css'
import placeholderImage from '~/assets/song_placeholder.svg'
import homeSVG from '~/assets/home.svg'
import profileSVG from '~/assets/profile.svg'
import bookSVG from '~/assets/book.svg'
import cc from 'classcat'

const UITabBar = (props, children) => (context) => {
  let { actions: { views: { setActive } }, views: { activeView } } = context

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

    <SetActive viewName='home' class={cc([styles['item'], { [styles['active']]: activeView === 'home' }])}>
      <img class={styles['icon']} alt='Home Icon' src={homeSVG} />
      <span>Home</span>
    </SetActive>

    <SetActive viewName='music-kit' class={cc([styles['item'], { [styles['active']]: activeView === 'music-kit' }])}>
      <img class={styles['icon']} alt='Music Kit Icon' src={bookSVG} />
      <span>Music Kit</span>
    </SetActive>

    <SetActive viewName='library' class={cc([styles['item'], { [styles['active']]: activeView === 'library' }])}>
      <img class={styles['icon']} alt='Library Icon' src={profileSVG} />
      <span>Library</span>
    </SetActive>
  </nav>
}

export default UITabBar
