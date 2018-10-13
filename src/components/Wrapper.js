import { h } from 'hyperapp'
import picostyle from 'picostyle'
import Header from '../components/Header.js'
import Page from '../components/Page'

const style = picostyle(h)

const Wrapper = style('div')({
  margin: '0 auto',
  maxWidth: '40em',
  padding: '0',
  '& p.first': {
    fontSize: '1.3em',
    textAlign: 'center'
  },
  '> *': {
    margin: '1.3em 1.2em',
    fontSize: '1.1rem',
    lineHeight: '1.3em',
    '-moz-user-select': 'all',
    '-webkit-user-select': 'all',
    userSelect: 'all'
  },
  '@media (min-width: 1250px)': {
    '> *': {
      margin: '1.2em auto'
    }
  }
})

export default Wrapper
