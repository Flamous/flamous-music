import { h } from 'hyperapp'
import picostyle from 'picostyle'
import { styler, value, listen, pointer, spring, chain } from 'popmotion'
import { nonlinearSpring } from 'popmotion/lib/transformers'
import { smooth } from 'popmotion/lib/calc'
import playImage from '../public/play.svg'

function makeInteractive (element) {
  const THRESHOLD = 10

  element.style.transform = 'translateY(150%)'

  const handleStyler = styler(element)
  const handle = {
    x: value(0, handleStyler.set('x')),
    y: value(200, handleStyler.set('y'))
  }

  window.setTimeout(() => spring({
    from: '100%',
    to: '0%',
    damping: 15
  }).start(handle.y), 1000)

  const oneDirectionalPointer = axis => pointer({[axis]: 0}).pipe(v => v[axis])

  let currentHandle
  let direction = 'none'
  let stopPointer
  let axis
  let springCurve

  listen(element, 'mousedown touchstart')
    .start((e) => {
      let {stop} = pointer({x: 0, y: 0})
        .start(({x, y}) => {
          if (Math.abs(x) > THRESHOLD) {
            axis = 'x'
            direction = (x < 0)
              ? 'left'
              : 'right'
            stop()
          } else if (Math.abs(y) > THRESHOLD) {
            axis = 'y'
            direction = (y < 0)
              ? 'top'
              : 'bottom'
            stop()
          }

          if (direction === 'none') return

          switch (direction) {
            case 'top':
              springCurve = nonlinearSpring(1, 0)
              break
            case 'bottom':
              springCurve = nonlinearSpring(0.2, 0)
              break
            case 'right':
            case 'left':
              springCurve = nonlinearSpring(3, 0)
          }

          currentHandle = handle[axis]

          stopPointer = chain(
            oneDirectionalPointer(axis),
            smooth(30))
            .pipe(springCurve)
            .start(currentHandle)
        })
    })

  listen(document, 'mouseup touchend')
    .start((e) => {
      stopPointer.stop()

      switch (direction) {
        case 'top':
          window.flamous.playPause()
          break
        case 'left':
          window.Amplitude.prev()
          break
        case 'right':
          window.Amplitude.next()
          break
        default:
          console.log('clicked!')
      }
      direction = 'none'
      axis = 'none'
      spring({
        from: currentHandle.get(),
        velocity: currentHandle.getVelocity()
      })
        .start(currentHandle)
    })
}

const style = picostyle(h)

const Bubble = style('div')((props) => ({
  backgroundColor: props.playingState ? '#fce9c7' : 'whitesmoke',
  transition: 'background-color 150ms',
  borderRadius: '20px',
  border: props.playingState ? '2px solid rgb(239, 197, 124)' : '2px solid #dedede',
  width: '100%',
  maxWidth: '400px',
  padding: '0.4em',
  display: 'flex',
  position: 'relative',
  height: '4.64em',
  cursor: 'default',
  boxShadow: '0 4px 20px -3px rgba(0,0,0, 0.16)'
}))

const Indicator = () => style('div')({
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
  position: 'absolute',
  left: '0px',
  top: '0px',
  marginTop: '0.4em'
})(
  {},
  style('div')({
    height: '4px',
    width: '30px',
    backgroundColor: '#848484',
    borderRadius: '100px'
  })
)
const SongCover = style('img')({
  height: '100%',
  borderRadius: '15px',
  boxSizing: 'border-box',
  pointerEvents: 'none'
})

const Song = style('div')({
  fontWeight: 'bold'
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
  padding: '1em',
  boxSizing: 'border-box',
  justifyContent: 'center'
})

const ScrubBar = (props) =>
  <Wrapper key={props.key}>
    <Bubble playingState={props.playingState} oncreate={makeInteractive}>
      <Indicator />
      <SongCover draggable='false' src={props.image} />
      <Info>
        <Song>
          {props.playingState ? <img src={playImage} style={{paddingRight: '0.35em'}} /> : ''}{props.name}
        </Song>
        <Artist>
          {props.artist}
        </Artist>
      </Info>
    </Bubble>
  </Wrapper>

export default ScrubBar
