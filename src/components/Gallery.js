import { h } from 'hyperapp'
import picostyle from 'picostyle'
import placeholder from '../public/song_placeholder.svg'
import playImage from '../public/play.svg'
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

const Cover = (props) => style('img')({
  width: '100%',
  pointerEvents: 'none'
})({
  src: props.src
})

export default Gallery
