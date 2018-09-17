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
  // '@media (min-width: 1000px)': {
  //   fontSize: '1.2rem'
  // },
  // ' .title': {
  //   margin: '0px',
  //   padding: '1.2em 0.4em 0.24em',
  //   fontSize: '2.5em',
  //   backgroundColor: '#fdfdfd',
  //   borderBottom: '1px solid rgba(0, 0, 0, 0.04)'
  // },
  ' .sub': {
    marginTop: '-2em',
    lineHeight: '2em'
  },
  ' .back': {
    fontSize: '1em',
    position: 'sticky',
    // position: '-webkit-sticky',
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
    padding: '1em 0.6em 0.9em',
    backgroundColor: 'rgba(253, 253, 253, 0.95)',
    zIndex: '100000'
  },
  '@supports (backdrop-filter: blur(10px))': {
    ' .back > *': {
      backgroundColor: 'rgba(253, 253, 253, 0.7)',
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)'
    }
  }
}))

const HeaderImageStyle = style('img')({
  borderRadius: '100%',
  width: '10rem',
  height: '9.9rem',
  border: '1px solid rgba(0, 0, 0, 0.14)'
})

const HeaderImage = (props) => {
  return <div>
    <HeaderImageStyle {...props} />
  </div>
}

const HeaderBoldStyle = style('h1')({
  margin: '0px',
  padding: '1.35em 0.4em 0.24em',
  // fontSize: '2.5em',
  // font-size: calc(16px + 2 * ((100vw - 360px) / 768px));
  fontSize: 'calc(2.65em + 12*(100vw - 400px)/(1250 - 400))',
  backgroundColor: '#fdfdfd',
  borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
  boxShadow: '0 0 0 1px #fdfdfd'
})
const HeaderBold = HeaderBoldStyle

export default (props, children) => {
  console.log(children)
  return <HeaderStyles>
    {props.back
      ? <span class='back'>
        <Link style={{display: 'flex', alignItems: 'center'}} to={props.back.to}>{[<img src={leftArrow} style={{height: '1.2em', marginRight: '0.2em'}} />, <span>{props.back.text}</span>]}</Link>
      </span>
      : ''}
    <header>
      {children.length === 0 ? <HeaderBold class='title'>{props.title}</HeaderBold> : children}
    </header>
  </HeaderStyles>
}

export { HeaderBold, HeaderImage }
