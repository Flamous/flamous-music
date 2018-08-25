import { h } from 'hyperapp'
import picostyle from 'picostyle'
import { styler, value, listen, pointer, spring, chain } from 'popmotion'
import { nonlinearSpring } from 'popmotion/lib/transformers'
import { smooth } from 'popmotion/lib/calc'
import playImage from '../public/play.svg'

function makeInteractive (element) {
  const AXIS_LOCK_THRESHOLD = 13 // Pixel
  const ACTIONABLE_THRESHOLD = 25 // Pixel

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
          if (Math.abs(x) > AXIS_LOCK_THRESHOLD) {
            axis = 'x'
            direction = (x < 0)
              ? 'left'
              : 'right'
            stop()
          } else if (Math.abs(y) > AXIS_LOCK_THRESHOLD) {
            axis = 'y'
            direction = (y < 0)
              ? 'top'
              : 'bottom'
            stop()
          }

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

          currentHandle = handle[axis]

          stopPointer = chain(
            oneDirectionalPointer(axis),
            smooth(30))
            .pipe(springCurve, (val) => { if (Math.abs(val) > ACTIONABLE_THRESHOLD) { element.classList.add('active') } else { element.classList.remove('active') }; return val })
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

          element.classList.remove('active')

          if (Math.abs(currentHandle.get() + currentHandle.getVelocity()) >= ACTIONABLE_THRESHOLD) {
            switch (direction) {
              case 'top':
                playPause()
                break
              case 'left':
                window.Amplitude.prev()
                break
              case 'right':
                window.Amplitude.next()
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

const Bubble = style('div')((props) => ({
  backgroundColor: 'whitesmoke',
  transition: 'border-color 150ms',
  borderRadius: '20px',
  border: props.playingState ? '1px solid #007AFF' : '1px solid #dedede',
  width: '100%',
  maxWidth: '400px',
  padding: '0.4em',
  display: 'flex',
  position: 'relative',
  height: '4.64em',
  cursor: 'default',
  boxShadow: '0 4px 20px -3px rgba(0,0,0, 0.16)',
  '.active .indicator div': {
    backgroundColor: '#007AFF',
    width: '2.6em'
  }
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
  {class: 'indicator'},
  style('div')({
    height: '4px',
    width: '2.1em',
    backgroundColor: '#CCC',
    borderRadius: '100px',
    transition: 'width 100ms'
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
      <Indicator class='indicator' />
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
