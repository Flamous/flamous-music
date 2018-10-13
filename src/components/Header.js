import { h } from 'hyperapp'
import picostyle from 'picostyle'
import { Link } from '@hyperapp/router'
import leftArrow from '../public/blue_left.svg'
import { nestable } from 'hyperapp-context'

const style = picostyle(h)

const StyledHeaderWrapper = style('div')({
  minHeight: '10rem',
  // display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-end',
  display: 'contents'
})

const HeaderWrapper = StyledHeaderWrapper

const HeaderStyles = style('div')((props) => ({
  // maxWidth: '1100px',
  // margin: '0 auto',
  // padding: '3em 1em 0.7em',
  position: 'relative',
  display: 'contents',
  textAlign: props.alignment === 'center' ? 'center' : 'left'
  // ' .sub': {
  //   marginTop: '-2em',
  //   lineHeight: '2em'
  // },
  // ' .back': {
  //   fontSize: '1.05em',
  //   position: 'sticky',
  //   top: '-1px',
  //   display: 'flex',
  //   width: '100%',
  //   transition: 'opacity 200ms  80ms linear',
  //   backgroundColor: 'rgba(253, 253, 253, 0.95)',
  //   zIndex: '100000',
  //   margin: '-1.5em 0'
  // },
  // ' .back:active': {
  //   opacity: '0.4'
  // },
  // ' .back > *': {
  //   padding: '0.8em 0.6em 0.9em',
  //   width: '33%'
  // },
  // '@supports (backdrop-filter: blur(30px))': {
  //   ' .back': {
  //     backgroundColor: 'rgba(253, 253, 253, 0.6)',
  //     backdropFilter: 'blur(30px)',
  //     WebkitBackdropFilter: 'blur(30px)'
  //   }
  // },
  // ' .show': {
  //   opacity: '1 !important'
  // }
}))

const StyledHeaderNav = style('div')({
  display: 'flex',
  height: '3.5rem',
  position: 'sticky',
  top: '0px',
  backgroundColor: 'rgba(253, 253, 253, 0.95)',
  '@supports (-webkit-backdrop-filter: blur(30px)) or (backdrop-filter: blur(30px))': {
    backgroundColor: 'rgba(253, 253, 253, 0.75)',
    backdropFilter: 'blur(40px)',
    WebkitBackdropFilter: 'blur(30px)'
  },
  '& > *': {
    width: '33%',
    alignItems: 'center',
    display: 'flex'
  },
  '& > *:last-child': {
    justifyContent: 'flex-end'
  },
  '& > *:nth-child(2)': {
    justifyContent: 'center'
  },
  '& > *:nth-child(2) > *': {
    transition: 'opacity 120ms',
    opacity: '0'
  },
  '&.show > * > *': {
    opacity: '1'
  }
})

const HeaderNav = (props, children) => {
  console.log(children)
  return <StyledHeaderNav {...props} class={props.class + ' webkit-sticky'}>
    <div>
      {children[0] && children[0]}
    </div>
    <div>
      {children[1] && children[1]}
    </div>
    <div>
      {children[1] && children[2]}
    </div>
  </StyledHeaderNav>
}

const StyledHeaderLine = style('div')({
  position: 'sticky',
  top: '3.5rem',
  borderBottom: '1px solid rgba(0, 0, 0, 0.14)'
})

const HeaderLine = StyledHeaderLine

const HeaderImageStyle = style('img')((props) => ({
  borderRadius: props.square ? '0px' : '100%',
  width: props.square ? '15rem' : '10rem',
  height: props.square ? '15rem' : '9.9rem',
  border: '1px solid rgba(0, 0, 0, 0.14)',
  pointerEvents: 'auto'
}))

const HeaderImage = (props) => {
  return <div>
    <HeaderImageStyle {...props} />
  </div>
}

const HeaderBoldStyle = style('h1')({
  margin: '0px',
  height: 'auto',
  minHeight: '4rem',
  padding: '0em 0.45em 0.24em',
  // fontSize: '2.5em',
  // font-size: calc(16px + 2 * ((100vw - 360px) / 768px));
  fontSize: 'calc(2.65em + 12*(100vw - 400px)/(1250 - 400))',
  backgroundColor: 'rgba(253, 253, 253, 0.95)',
  boxShadow: '0 0 0 1px #fdfdfd',
  display: 'flex',
  alignItems: 'flex-end'
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
    let back = context.location.previous !== context.location.pathname ? context.location.previous : '/'
    return <HeaderStyles>
      <HeaderWrapper>
        <header style={{display: 'contents'}}>
          {props.back && <HeaderNav class={`${state.isHeaderHidden ? 'show' : ''}`}>
            <a style={{padding: '1em 1em 1em 0.85em', display: 'flex', alignItems: 'center'}} href={back} onclick={(event) => { event.preventDefault(); back === '/' ? window.flamous.location.go('/') : window.flamous.pages.back() }}to={back}>{[<img src={leftArrow} style={{height: '1.2em', marginRight: '0.2em'}} />, <span>{props.back.text}</span>]}</a>
            <span style={{textAlign: 'center', fontWeight: 'bold'}}>{props.title}</span>
            <span>{context.right && <props.right />}</span>
          </HeaderNav>
          }
          {children.length === 0 ? <HeaderBold class='title' oncreate={actions.initObserver}>{props.title}</HeaderBold> : (props) => { children[0].attributes.oncreate = actions.initObserver; return children }}
        </header>
        <HeaderLine />
      </HeaderWrapper>
    </HeaderStyles>
  },
  'flamous-header')

export default Header

export { HeaderBold, HeaderImage, HeaderWrapper, HeaderLine }
