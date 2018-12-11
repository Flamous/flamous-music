/** @jsx h */
import { h } from 'hyperapp'
import { Link } from '@hyperapp/router'
import UIPage from './UI/UIPage'

const MusicKit = () => {
  return <div class='page'>
    <h1>Music Kit</h1>
    <Link to='/artists/123456'>Test 1</Link>
    <Link to='/albums/654321'>Test 2</Link>
  </div>
}

export default MusicKit
