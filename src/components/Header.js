import { h } from 'hyperapp'
import picostyle from 'picostyle'
import { Link } from '@hyperapp/router'

const style = picostyle(h)

const Button = (props) => style('span')({
  fontWeight: 'bold',
  color: '#007AFF'
})(
  {
    
  },
  <Link to={props.to}>
    {props.text}
  </Link>
)

const Header = (props, children) => style('header')({
  fontSize: '2em',
  maxWidth: '1100px',
  margin: '1em',
  textAlign: props.alignment === 'center' ? 'center' : 'left',
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
        ? [<br />, <Button text={props.button.text} to={props.button.to} />]
        : ''}
    </p>
  ]
)

export default Header
