import { h } from 'hyperapp'
import picostyle from 'picostyle'
import { Link } from '@hyperapp/router'

// const { Link } = import('@hyperapp/router')

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
  position: 'relative',
  textAlign: props.alignment === 'center' ? 'center' : 'left',
  '@media (min-width: 1000px)': {
    fontSize: '3em'
  },
  '@media (min-width: 1250px)': {
    margin: '1.4em auto 0em'
  },
  ' .title': {
    marginTop: '0px'
  },
  ' .sub': {
    fontSize: '0.6em',
    marginTop: '-2em'
  },
  ' .back': {
    position: 'absolute',
    fontSize: '0.6em',
    top: '-1em'
  }
})(
  {},
  [
    <span class='back'>{
      props.back
        ? <Link to={props.back.to}>{`< ${props.back.name}`}</Link>
        : ''}
    </span>,
    <h1 class='title'>{props.title}</h1>,
    <p class='sub'>{props.sub}
      {props.button
        ? [<br />, <Button text={props.button.text} to={props.button.to} />]
        : ''}
    </p>
  ]
)

export default Header
