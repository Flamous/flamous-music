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

// const Header = (props, children) => style('header')({
//   maxWidth: '1100px',
//   margin: '0 auto',
//   padding: '3em 1em 0.7em',
//   position: 'relative',
//   textAlign: props.alignment === 'center' ? 'center' : 'left',
//   '@media (min-width: 1000px)': {
//     fontSize: '1.2rem'
//   },
//   // '@media (min-width: 1250px)': {
//   //   margin: '4.4em auto 0em'
//   // },
//   ' .title': {
//     margin: '0px',
//     fontSize: '2.5em'
//   },
//   ' .title::before': {
//     // content: '""',
//     verticalAlign: 'bottom',
//     display: 'inline-block'
//   },
//   ' .sub': {
//     marginTop: '-2em',
//     lineHeight: '2em'
//   },
//   ' .back': {
//     fontSize: '1em',
//     position: 'absolute',
//     top: '0.9em',
//     display: 'block',
//     width: '100%',
//     transition: 'opacity 200ms  80ms linear'
//   },
//   ' .back:active': {
//     opacity: '0.4'
//   }
// })(
//   {},
//   [
    // <span class='back'>{
    //   props.back
    //     ? <Link style={{display: 'flex', alignItems: 'center'}} to={props.back.to}>{[<img src={leftArrow} style={{height: '0.9em', marginRight: '0.2em', marginTop: '0.01em'}} />, <span>{props.back.name}</span>]}</Link>
    //     : ''}
    // </span>,
    
    // <p class='sub'>{props.sub}
    //   {props.button
    //     ? [<br />, <Button text={props.button.text} to={props.button.to} />]
    //     : ''}
    // </p>
//   ]
// )

// export default (props) =><Header>
//   {}
//   <h1 class='title'>{props.title}</h1>
// </Header>


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
  // '@media (min-width: 1250px)': {
  //   margin: '4.4em auto 0em'
  // },
  ' .title': {
    margin: '0px',
    padding: '1em 0.34em 0.2em',
    fontSize: '2.5em'
  },
  ' .title::before': {
    // content: '""',
    verticalAlign: 'bottom',
    display: 'inline-block'
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
    transition: 'opacity 200ms  80ms linear',
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
        <Link style={{display: 'flex', alignItems: 'center'}} to={props.back.to}>{[<img src={leftArrow} style={{height: '0.9em', marginRight: '0.2em', marginTop: '0.01em'}} />, <span>{props.back.text}</span>]}</Link>
      </span>
      : ''}
    <header>
      <h1 class='title'>{props.title}</h1>
    </header>
  </HeaderStyles>
