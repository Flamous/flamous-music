import { h } from 'hyperapp'
import picostyle from 'picostyle'
import placeholder from '../public/song_placeholder.svg'
// import Header from './Header.js'
// import songList from '../songs.js'

const style = picostyle(h)

const Heading = style('h2')({
  marginLeft: '1rem'
})

const Gallery = (props, children) => style('div')({
  width: '100%',
  padding: '1em',
  boxSizing: 'border-box',
  marginBottom: '6em'
})(
  {},
  <Wrapper>
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

export const GalleryItem = (props) => {
  console.log(props)
  return style('div')({
  color: '#212121',
  textAlign: 'center',
  fontWeight: 'bold',
  padding: '1rem',
  width: '50%',
  minWidth: '150px',
  // maxWidth: '250px',
  '@media (min-width: 1000px)': {
    width: '250px',
    fontSize: '1.2em',
    maxWidth: '33%'
  },
  position: 'relative',
  flexGrow: '1',
  boxSizing: 'border-box',
  ' .secondary': {
    marginTop: '-1em',
    color: '#848484'
  },
  '.playing': {
    transform: 'scale(1.2)'
  }
})(
  props,
  [
    <Cover src={props.image} />,
    <p>{props.title}</p>,
    <p class='secondary'>{props.sub ? `by ${props.sub}` : ''}</p>
  ]
)
}
const Cover = (props) => style('img')({
  width: '100%',
  pointerEvents: 'none'
})({
  src: props.src
})

export default Gallery
