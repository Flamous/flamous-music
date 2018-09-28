import { h } from 'hyperapp'
import picostyle from 'picostyle'
import { styler, value, listen, pointer, spring, chain, schedule, everyFrame } from 'popmotion'
import { nonlinearSpring, smooth } from 'popmotion/lib/transformers'
import playImage from '../assets/play.svg'
import pauseImage from '../assets/pause.svg'

function makeInteractive (element) {
  const AXIS_LOCK_THRESHOLD = 13 // Pixel
  const ACTIONABLE_THRESHOLD = {
    'top': 13,
    'left': 25,
    'right': 25
  } // Pixel
  // const indicator = element.querySelector('#indicator div')

  // element.style.transform = 'translateY(150%)'

  const handleStyler = styler(element)
  const handle = {
    x: value(0, handleStyler.set('x')),
    y: value(0, handleStyler.set('y'))
  }

  // window.setTimeout(() => spring({
  //   from: '100%',
  //   to: '0%',
  //   damping: 15
  // }).start(handle.y), 1000)

  const oneDirectionalPointer = axis => pointer({[axis]: 0}).pipe(v => v[axis])

  let currentHandle
  let direction = 'none'
  let stopPointer
  let axis
  let springCurve

  listen(element, 'mousedown touchstart')
    .start((e) => {
      let currentThreshold
      let {stop} = pointer({x: 0, y: 0})
        .pipe(({x}) => x)
        .start((x) => {
          if (Math.abs(x) > AXIS_LOCK_THRESHOLD) {
            axis = 'x'
            direction = (x < 0)
              ? 'left'
              : 'right'
            stop()
          }
          // else if (Math.abs(y) > AXIS_LOCK_THRESHOLD) {
          //   axis = 'y'
          //   direction = (y < 0)
          //     ? 'top'
          //     : 'bottom'
          //   stop()
          // }

          if (direction === 'none') return

          switch (direction) {
            case 'top':
              springCurve = nonlinearSpring(2.2, 0)
              break
            case 'bottom':
              springCurve = nonlinearSpring(0.8, 0)
              break
            case 'right':
            case 'left':
              springCurve = nonlinearSpring(3, 0)
          }

          currentThreshold = ACTIONABLE_THRESHOLD[direction]
          currentHandle = handle[axis]

          // currentHandle.subscribe((val) => {
          //   indicator.style.width = `${2.1 + (0.6 * (Math.abs(val) / currentThreshold))}em`
          //   if (Math.abs(val) > currentThreshold) {
          //     element.classList.add('active')
          //   } else {
          //     element.classList.remove('active')
          //   }
          // })

          stopPointer = schedule(
            everyFrame(),
            oneDirectionalPointer(axis))
            .pipe(springCurve, smooth(25))
            .start(currentHandle)
        })

      function playPause () {
        if (!window.Amplitude.audio().paused) {
          window.Amplitude.pause()
        } else {
          window.Amplitude.play()
        }
      }

      let upListener = listen(document, 'mouseup touchend')
        .start((e) => {
          upListener.stop()
          stopPointer && stopPointer.stop()
          stop()

          if (!currentHandle) return

          // element.classList.remove('active')

          if (Math.abs(currentHandle.get()) >= currentThreshold) {
            switch (direction) {
              case 'top':
                playPause()
                break
              case 'left':
                window.Amplitude.next()
                break
              case 'right':
                window.Amplitude.prev()
                break
              default:
                console.info('Clicked ScrubBar')
            }
          }
          direction = 'none'
          axis = 'none'
          spring({
            from: currentHandle.get(),
            velocity: currentHandle.getVelocity()
          })
            .start(currentHandle)
        })
    })
}

const style = picostyle(h)

const BubbleStyles = style('div')((props) => ({
  width: '100%',
  padding: '0.4em',
  display: 'flex',
  position: 'relative',
  height: '4.2em',
  cursor: 'default',
  justifyContent: 'space-between',
  alignItems: 'center',
  '@media (min-width: 768px)': {
    '&': {
      maxWidth: '440px',
      borderRight: '1px solid #f0f0f0'
    }
  }
}))

const Bubble = BubbleStyles

const SongCover = style('img')({
  height: '100%',
  borderRadius: '16%',
  boxSizing: 'border-box',
  pointerEvents: 'none'
})

const Song = style('div')({
  fontWeight: 'bold'
})

const PlayButton = style('span')({
  backgroundColor: '#fafafa',
  borderRadius: '100%',
  border: '1px solid #f0f0f0',
  display: 'inline-block',
  height: '3em',
  width: '3em',
  padding: '4px',
  marginRight: '5px'
})

const Artist = style('div')({
  fontWeight: 'normal'
})

const Info = style('div')({
  paddingLeft: '1em',
  alignSelf: 'center'
})

const Wrapper = style('div')({
  zIndex: '1000',
  width: '100%',
  display: 'flex',
  position: 'absolute',
  bottom: '0px',
  boxSizing: 'border-box',
  justifyContent: 'space-between',
  border: '1px solid #f0f0f0',
  borderRadius: '5px 5px 0px 0px',
  backgroundColor: '#fdfdfd',
  boxShadow: 'rgba(0, 0, 0, 0.16) 0px 0px 23px -7px',
  overflow: 'hidden'
})
const Progress = style('progress')({
  WebkitAppearance: 'none',
  MozAppearance: 'none',
  appearance: 'none',
  width: '100%',
  height: '0.2em',
  border: 'none',
  backgroundColor: '#e0e0e0',
  position: 'absolute',
  top: '0px',
  left: '0px',
  transform: 'translateY(-1px)'
})

const ScrubBar = (props) =>
  <Wrapper key={props.key}>
    <Bubble playingState={props.playingState} oncreate={makeInteractive} onclick={() => window.flamous.location.go('/stream-view')}>
      <Progress max={props.duration || '300'} value={props.playbackTime}>{props.playbackTime}/{props.duration}</Progress>
      <div style={{display: 'flex', height: '100%'}}>
        <SongCover draggable='false' src={props.image} />
        <Info>
          <Song>
            {props.name}
          </Song>
          <Artist>
            {props.artist}
          </Artist>
        </Info>
      </div>
      <div>
        <PlayButton onclick={(e) => { e.preventDefault(); e.stopImmediatePropagation(); window.flamous.playPause() }}>
          { !props.playingState
            ? <img style={{height: '100%'}} src={playImage} />
            : <img style={{height: '100%'}} src={pauseImage} />
          }
        </PlayButton>
      </div>
    </Bubble>
  </Wrapper>

export default ScrubBar
