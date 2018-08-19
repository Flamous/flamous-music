import { h } from 'hyperapp'
// import picostyle from 'picostyle'
import albums from '../albums.js'
import Page from './Page.js'
import Gallery from './Gallery.js'
import Header from './Header.js'
import About from '../elements/About.js'
import songList from '../songs'

// const style = picostyle(h)

const Home = () => {
  return (
    <Page nonInteractive>
      <Header title='Flamous Music' sub='The best of Public Domain music.' button={{text: 'About Flamous >', link: <About />}} />
      <Gallery data={albums} onclick={() => { if (window.clickLock) return; window.flamous.addPage([<Header title='Wowa' sub='Free music by Wowa (www.wowa.me)' />, <Gallery data={songList} />]) }} />
    </Page>
  )
}

export default Home
