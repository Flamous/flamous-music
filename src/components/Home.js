/** @jsx h */
import { h } from 'hyperapp'
import UIPage from './UI/UIPage.js'
import UIHeader from './UI/UIHeader.js'

const Home = (props) => (context) => {
  // if (props.match.url === '/' && context.initialLoad) window.flamous.setInitialLoad(false)
  return (
    <UIPage nonInteractive key='home'>
      <UIHeader title='Home' />
    </UIPage>
  )
}

export default Home
