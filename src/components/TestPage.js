/** @jsx h */
import { h } from 'hyperapp'
import UIPage from './UI/UIPage'
import { Link } from './Link'

const TestPage = (props, children) => (context) => {
  return <UIPage class='page'>
    <h1>Test Page</h1>
    <Link to='/artists'>Test 1</Link>
    <Link to='/albums'>Test 2</Link>
    <Link to='/player/654321'>Test 3</Link>
    <Link to='/library'>Test 4</Link>
    <Link to='/music-kit'>Test 5</Link>

  </UIPage>
}

export default TestPage
