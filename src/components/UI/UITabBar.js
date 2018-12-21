/** @jsx h */
import { h } from 'hyperapp'
import { Link } from '@hyperapp/router'
import styles from './UITabBar.css'
import placeholderImage from '~/assets/song_placeholder.svg'
import homeSVG from '~/assets/icons/home.svg'
import homeBlueSVG from '~/assets/icons/home_blue.svg'
import librarySVG from '~/assets/icons/library.svg'
import libraryBlueSVG from '~/assets/icons/library_blue.svg'
import kitBlueSVG from '~/assets/icons/kit_blue.svg'
import kitSVG from '~/assets/icons/kit.svg'
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
      <img class={styles['icon']} alt='Home Icon' src={activeView === 'home' ? homeBlueSVG : homeSVG} />
      <span>Home</span>
    </SetActive>

    <SetActive viewName='music-kit' class={cc([styles['item'], { [styles['active']]: activeView === 'music-kit' }])}>
      <img class={styles['icon']} alt='Music Kit Icon' src={activeView === 'music-kit' ? kitBlueSVG : kitSVG} />
      <span>Music Kit</span>
    </SetActive>

    <SetActive viewName='library' class={cc([styles['item'], { [styles['active']]: activeView === 'library' }])}>
      <img class={styles['icon']} alt='Library Icon' src={activeView === 'library' ? libraryBlueSVG : librarySVG} />
      <span>Library</span>
    </SetActive>
  </nav>
}

export default UITabBar
