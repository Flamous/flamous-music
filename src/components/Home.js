/** @jsx h */
import { h } from 'hyperapp'
import Page from './Page.js'
import UIHeader from './UI/UIHeader.js'

const Home = (props) => (context) => {
  // if (props.match.url === '/' && context.initialLoad) window.flamous.setInitialLoad(false)
  return (
    <Page nonInteractive key='home'>
      <UIHeader title='Home' />
    </Page>
  )
}

export default Home
