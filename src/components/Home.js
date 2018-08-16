import { h } from 'hyperapp'
import picostyle from 'picostyle'
import albums from '../albums.js'
import Page from './Page.js'
import Gallery from './Gallery.js'
import Header from './Header.js'

const style = picostyle(h)

const Home = () => {
  return (
    <Page nonInteractive>
      <Header title='Flamous Music' sub='The best of Public Domain music.' />
      <Gallery data={albums} />
    </Page>
  )
}

export default Home
