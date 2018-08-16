import { h } from 'hyperapp'
import picostyle from 'picostyle'
import albums from '../albums.js'
import Page from './Page.js'
import Gallery from './Gallery.js'

const style = picostyle(h)

const Header = () => style('header')({
  fontSize: '2em',
  maxWidth: '1100px',
  margin: '1em',
  '@media (min-width: 1000px)': {
    fontSize: '3em'
  },
  '@media (min-width: 1250px)': {
    margin: '0 auto'
  },
  ' .sub': {
    fontSize: '0.6em',
    marginTop: '-2em'
  }
})(
  {},
  [
    <h1>Flamous</h1>,
    <p class='sub'>The best of Public Domain music.</p>
  ]
)

const Home = () => {
  return (
    <Page nonInteractive>
      <Header />
      <Gallery data={albums} />
    </Page>
  )
}

export default Home
