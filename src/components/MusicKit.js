/** @jsx h */
import { h } from 'hyperapp'
import { Link } from '@hyperapp/router'
import UIPage from './UI/UIPage'
import styles from './MusicKit.css'
import UIHeader from './UI/UIHeader'

const MusicKit = () => {
  return <UIPage class={styles['music-kit']} nonInteractive>
    <UIHeader title='Music Kit' />

    <main class={styles['main']}>
      <div class={styles['wrapper']}>
        <section>
          <p>Learn how to make music from start to finish. The Music Kit covers a wide variety of topics such as singing, recording and mastering.</p>
          <p>
      Making and sharing your own music is something that has fascinated cultures all over the world with its magic.
          </p>
        </section>

        <section>
          <h2>
          Topics
          </h2>
          <Card
            title='Explore Your Voice'
          />
          <Card
            title='Record'
          />
          <Card
            title='Publish'
          />
        </section>
      </div>
    </main>
  </UIPage>
}

export default MusicKit

const Card = (props) => {
  let { bgImage, title } = props

  return <div class={styles['card']}>
    <h2>{title}</h2>
    <img src={bgImage} />
  </div>
}
