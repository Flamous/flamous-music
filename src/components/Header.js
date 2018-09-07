import { h } from 'hyperapp'
import picostyle from 'picostyle'
import { Link } from '@hyperapp/router'
import leftArrow from '../public/blue_left.svg'

const style = picostyle(h)

const HeaderStyles = style('div')((props) => ({
  maxWidth: '1100px',
  margin: '0 auto',
  padding: '3em 1em 0.7em',
  position: 'relative',
  display: 'contents',
  textAlign: props.alignment === 'center' ? 'center' : 'left',
  '@media (min-width: 1000px)': {
    fontSize: '1.2rem'
  },
  ' .title': {
    margin: '0px',
    padding: '1em 0.34em 0.2em',
    fontSize: '2.5em'
  },
  ' .sub': {
    marginTop: '-2em',
    lineHeight: '2em'
  },
  ' .back': {
    fontSize: '1em',
    position: 'sticky',
    top: '0',
    display: 'block',
    width: '100%',
    height: '0',
    transition: 'opacity 200ms  80ms linear'
  },
  ' .back:active': {
    opacity: '0.4'
  },
  ' .back > *': {
    padding: '0.7em 0.4em 0.58em',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    zIndex: '100000'
  }
}))

export default (props, children) =>
  <HeaderStyles>
    {props.back
      ? <span class='back'>
        <Link style={{display: 'flex', alignItems: 'center'}} to={props.back.to}>{[<img src={leftArrow} style={{height: '1em', marginRight: '0.2em', marginTop: '0.05em'}} />, <span>{props.back.text}</span>]}</Link>
      </span>
      : ''}
    <header>
      <h1 class='title'>{props.title}</h1>
    </header>
  </HeaderStyles>
