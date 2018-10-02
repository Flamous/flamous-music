import { h } from 'hyperapp'
import picostyle from 'picostyle'
import { Link } from '@hyperapp/router'
import leftArrow from '../public/blue_left.svg'
// import style from '../style'
import { nestable } from 'hyperapp-context'

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
    fontSize: '1.05em',
    position: 'sticky',
    top: '-1px',
    display: 'flex',
    width: '100%',
    transition: 'opacity 200ms  80ms linear',
    backgroundColor: 'rgba(253, 253, 253, 0.95)',
    zIndex: '100000',
    margin: '-1.5em 0'
  },
  ' .back:active': {
    opacity: '0.4'
  },
  ' .back > *': {
    padding: '0.8em 0.6em 0.9em',
    width: '33%'
  },
  '@supports (backdrop-filter: blur(30px))': {
    ' .back': {
      backgroundColor: 'rgba(253, 253, 253, 0.6)',
      backdropFilter: 'blur(30px)',
      WebkitBackdropFilter: 'blur(30px)'
    }
  },
  ' .show': {
    opacity: '1 !important'
  }
}))

const HeaderImageStyle = style('img')({
  borderRadius: '100%',
  width: '10rem',
  height: '9.9rem',
  border: '1px solid rgba(0, 0, 0, 0.14)',
  pointerEvents: 'auto'
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

const Header = nestable(
  {
    isHeaderHidden: false,
    observer: null,
    threshold: 0
  },
  {
    observerChange: (changes) => ({threshold}, {setHeaderHidden}) => {
      if (changes[0].intersectionRatio <= threshold) {
        setHeaderHidden(true)
      } else {
        setHeaderHidden(false)
      }
      console.log(changes[0].intersectionRatio)
    },
    initObserver: (elem) => ({threshold}, {observerChange}) => {
      let observer = null
      if ('IntersectionObserver' in window) {
        observer = new window.IntersectionObserver(observerChange, {
          threshold: [threshold, 0.01],
          rootMargin: '-75px 0px 0px 0px'
        })
        observer.observe(elem)
      }

      return {
        observer: observer
      }
    },
    setHeaderHidden: (isHidden) => {
      return {
        isHeaderHidden: isHidden
      }
    }
  },
  (state, actions) => (props, children) => (context) => {
    let {updateAvailable} = context
    return <HeaderStyles>
      {props.back
        ? <span class='back'>
          <Link style={{display: 'flex', alignItems: 'center'}} to={context.location.previous}>{[<img src={leftArrow} style={{height: '1.2em', marginRight: '0.2em'}} />, <span>{props.back.text}</span>]}</Link>
          <span style={{textAlign: 'center', fontWeight: 'bold', opacity: '0', transition: 'opacity 100ms linear 60ms'}} class={`${state.isHeaderHidden ? 'show' : ''}`}>{props.title}</span>
          {updateAvailable ? <props.updateButton /> : ''}
        </span>
        : ''}
      <header oncreate={actions.initObserver}>
        {children.length === 0 ? <HeaderBold class='title'>{props.title}</HeaderBold> : children}
      </header>
    </HeaderStyles>
  })

export default Header

export { HeaderBold, HeaderImage }
