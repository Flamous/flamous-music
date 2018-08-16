import { h } from 'hyperapp'
import picostyle from 'picostyle'

const style = picostyle(h)

const Header = (props, children) => style('header')({
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
    // { children ? children :
    <h1>{props.title}</h1>,
    <p class='sub'>{props.sub}</p>
  ]
)

export default Header
