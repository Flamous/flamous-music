import { h } from 'hyperapp'
import picostyle from 'picostyle'
import LazyImage from './LazyImage'
import LazyLoad from 'vanilla-lazyload'

const style = picostyle(h)

function updateLazyLoad (elem) {
  elem.lazyLoader.update()
}
function removeLazyLoad (elem) {
  elem.lazyLoader.destroy()
}
function initLazyLoad (elem) {
  let config = {
    container: elem,
    element_selector: '.image',
    callback_load: (elem) => elem.classList.add('show')
  }
  if (!elem.lazyLoader) {
    elem.lazyLoader = new LazyLoad(config)
  }

  elem.lazyLoader.update()
}

const Heading = style('h2')({
  marginLeft: '1rem'
})

const Gallery = (props, children) => style('div')({
  width: '100%',
  padding: '1em',
  boxSizing: 'border-box',
  marginBottom: '6em'
})(
  {
    oncreate: initLazyLoad,
    // onupdate: updateLazyLoad,
    onremove: removeLazyLoad,
    class: 'gallery'
  },
  <Wrapper key={props.key}>
    {props.heading ? <Heading>{props.heading}</Heading> : ''}
    <FlexWrapper>
      {children}
      {/* {props.data.map((item) => {
        // console.log('isPlaying: ', props.playingState, ', playingId: ', props.playingId, ', itemId: ', item.id)
        // class={(props.playingState && props.playingId === item.id) ? 'playing' : ''}

        return <GalleryItem image={item.cover_art_url || placeholder} title={item.name} sub={item.artist} onclick={() => { if (props.onclick && item.artist) { props.onclick() } else { if (window.clickLock) return; console.log(item.id); window.Amplitude.playSongAtIndex(item.id) } }} />
      })} */}
    </FlexWrapper>
  </Wrapper>
)

const Wrapper = style('div')({
  maxWidth: '1250px',
  margin: '0 auto'
})

const FlexWrapper = style('div')({
  display: 'flex',
  flexWrap: 'wrap'
})

export const GalleryItem = (props) => style('div')({
  color: '#212121',
  textOverflow: 'ellipsis',
  textAlign: 'center',
  fontWeight: 'bold',
  padding: '0.7em',
  width: '33%',
  minWidth: '150px',
  transition: 'opacity 300ms',
  // maxWidth: '250px',
  '@media (min-width: 1000px)': {
    width: '200px',
    fontSize: '1.2em',
    maxWidth: '33%'
  },
  position: 'relative',
  flexGrow: '1',
  boxSizing: 'border-box',
  ' .secondary': {
    marginTop: '-1em',
    color: '#848484',
    fontWeight: 'normal'
  },
  '.playing .primary': {
    color: '#007AFF'
  },
  ':active': {
    transition: 'opacity 70ms',
    opacity: '0.6'
  }
})(
  props,
  [
    <Cover src={props.image} />,
    <p class='primary'>{props.title}</p>,
    // {props.class === 'playing' ? <img src={playImage} style={{paddingRight: '0.35em'}} /> : ''}
    <p class='secondary'>{props.sub ? `by ${props.sub}` : ''}</p>
  ]
)

const Cover = (props) => style('div')({
  width: '100%',
  position: 'relative',
  paddingBottom: '100%',
  ' .image': {
    width: '100%',
    position: 'absolute',
    left: '0',
    pointerEvents: 'none',
    transition: 'opacity 200ms 300ms',
    opacity: '1'
  },
  ' .image:not([src])': {
    opacity: '0'
  }
})({}, <LazyImage class='image' alt={props.alt} src={props.src} />
)

export default Gallery
