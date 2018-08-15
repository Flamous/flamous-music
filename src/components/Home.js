import { h } from 'hyperapp'
import picostyle from 'picostyle'

const style = picostyle(h)

const Header = () => {
  return (
    <header>
      <h1>Flamous</h1>
    </header>
  )
}

const Page = style('article')({
  height: '100%',
  width: '100%',
  overflowY: 'auto'
})

const Home = () => {
  return (
    <Page>
      <Header />
    </Page>
  )
}

export default Home
