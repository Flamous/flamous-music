import { h } from 'hyperapp'
import picostyle from 'picostyle'
import { Link } from '@hyperapp/router'
import leftArrow from '../public/blue_left.svg'
import rightArrow from '../public/blue_right.svg'

// const { Link } = import('@hyperapp/router')

const style = picostyle(h)

const Button = (props) => style('span')({
  fontWeight: 'bold',
  color: '#007AFF'
})(
  {

  },
  <Link to={props.to}>
    {[props.text, <img src={rightArrow} style={{height: '0.6em', marginLeft: '0.4em', marginTop: '0.1em'}} />]}
  </Link>
)

const Header = (props, children) => style('header')({
  maxWidth: '1100px',
  margin: '3em 1.7em 1em',
  position: 'relative',
  textAlign: props.alignment === 'center' ? 'center' : 'left',
  '@media (min-width: 1000px)': {
    fontSize: '1.2rem'
  },
  '@media (min-width: 1250px)': {
    margin: '3em auto 0em'
  },
  ' .title': {
    marginTop: '0px',
    fontSize: '2.5em'
  },
  ' .sub': {
    marginTop: '-2em',
    lineHeight: '2em'
  },
  ' .back': {
    fontSize: '1.2em',
    position: 'absolute',
    top: '-1.8em',
    display: 'block',
    width: '100%',
    transition: 'opacity 120ms'
  },
  ' .back:active': {
    opacity: '0.55'
  }
})(
  {},
  [
    <span class='back'>{
      props.back
        ? <Link style={{display: 'flex', alignItems: 'center'}} to={props.back.to}>{[<img src={leftArrow} style={{height: '0.6em', marginRight: '0.4em', marginTop: '0.1em'}} />, <span>{props.back.name}</span>]}</Link>
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
