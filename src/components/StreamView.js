import { h } from 'hyperapp'
import picostyle from 'picostyle'
import { spring, value, styler, listen, pointer, transform } from 'popmotion'

import playImage from '../assets/play.svg'
import pauseImage from '../assets/pause.svg'
import prevImage from '../assets/prev.svg'
import nextImage from '../assets/next.svg'
import downArrow from '../assets/down.svg'

let {snap} = transform

const style = picostyle(h)

const oneDPointer = (initY) => pointer({x: 0, y: 0, preventDefault: false}).pipe(({y}) => y)

function init (element) {
  const THRESHOLD = 10 // Pixel
  let handleStyler = styler(element)
  let handleY = value(0, handleStyler.set('y'))
  element.handleY = handleY

  // Initial slide-in
  spring({
    from: document.body.clientHeight,
    to: 0,
    damping: 20,
    mass: 0.5
  }).start(handleY)

  let sub
  listen(element, 'mousedown touchstart')
    .start((event) => {
      sub = oneDPointer(0)
        .start((y) => {
          if (y >= THRESHOLD) {
            sub.stop()
            sub = oneDPointer(handleY.get())
              .start(handleY)
          }
        })

      let upSub = listen(document, 'mouseup touchend')
        .start((event) => {
          sub && sub.stop()
          upSub.stop()

          let velocity = handleY.getVelocity()
          let pos = handleY.get()

          let isGoingBack = Boolean(!snap([
            0,
            document.body.clientHeight / 2
          ])(pos + velocity))

          if (isGoingBack) {
            let config = {
              from: pos,
              to: 0,
              velocity: velocity,
              mass: 0.5,
              damping: 20
            }

            spring(config)
              .start(handleY)
          } else {
            window.flamous.streamView.hide()
          }
        })
    })
}

function exit (element, done) {
  let handleY = element.handleY
  let velocity = handleY.getVelocity()
  let pos = handleY.get()
  let height = document.body.clientHeight

  handleY.subscribe((val) => {
    if (val >= height) {
      handleY.stop()
      done()
    }
  })

  let config = {
    from: pos,
    to: height,
    velocity: velocity,
    mass: 0.5
  }
  spring(config)
    .start(handleY)
}

const StreamViewStyles = style('div')({
  height: '100%',
  width: '100%',
  backgroundColor: 'white',
  zIndex: '2000',
  boxShadow: '0 0 10px 0 rgba(0, 0, 0, 0.2)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  position: 'relative',
  backgroundImage: `url(${downArrow})`,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center top',
  backgroundSize: '3em'
})

const OtherButton = style('span')({
  display: 'inline-block',
  height: '3em',
  width: '3em'
})
const PlayButton = style('span')({
  backgroundColor: '#fafafa',
  borderRadius: '100%',
  border: '1px solid #f0f0f0',
  display: 'inline-block',
  height: '4em',
  width: '4em',
  padding: '4px',
  marginRight: '5px'
})

const Wrapper = style('div')({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  width: '100%',
  maxWidth: '400px'
})
const Progress = style('progress')({
  WebkitAppearance: 'none',
  MozAppearance: 'none',
  appearance: 'none',
  width: '70%',
  height: '0.7em',
  borderRadius: '100px',
  border: '1px solid #e0e0e0',
  marginTop: '1em',
  overflow: 'hidden',
  backgroundColor: '#f0f0f0'
})

const StreamView = (props) => {
  return <StreamViewStyles key='stream-view' oncreate={init} onremove={exit}>
    <Wrapper>
      <img src={props.playingContext.cover_art_url} />
      <h3>{props.playingContext.name}</h3>
      <br />
      <span>
        {props.playingContext.artist}
      </span>
      <Progress max={props.playingContext.duration || '300'} value={props.playbackTime}>{props.playbackTime}/{props.playingContext.duration}</Progress>
      <div style={{display: 'flex', justifyContent: 'space-around', alignItems: 'center', width: '100%', padding: '1em 3em'}}>
        <OtherButton onclick={() => window.Amplitude.prev()}>
          <img style={{height: '100%'}} src={prevImage} />
        </OtherButton>
        <PlayButton onclick={window.flamous.playPause}>
          { !props.playingState
            ? <img style={{height: '100%'}} src={playImage} />
            : <img style={{height: '100%'}} src={pauseImage} />
          }
        </PlayButton>
        <OtherButton onclick={() => window.Amplitude.next()}>
          <img style={{height: '100%'}} src={nextImage} />
        </OtherButton>
      </div>
    </Wrapper>
  </StreamViewStyles>
}

export default StreamView
