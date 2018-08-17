import { h } from 'hyperapp'
import picostyle from 'picostyle'

const style = picostyle(h)

const Button = (props) => style('span')({
  fontWeight: 'bold',
  color: '#007AFF'
})(
  {
    onclick: () => window.flamous.addPage(props.link)
  },
  props.text
)

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
    <p class='sub'>{props.sub}
      {props.button
        ? [<br />, <Button text={props.button.text} link={props.button.link} />]
        : ''}
    </p>
  ]
)

export default Header
