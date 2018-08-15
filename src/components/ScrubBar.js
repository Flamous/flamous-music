import { h } from 'hyperapp'
import picostyle from 'picostyle'
import { styler, value, listen, pointer, spring, chain } from 'popmotion'
import { nonlinearSpring } from 'popmotion/lib/transformers'
import { smooth } from 'popmotion/lib/calc'

function makeInteractive (element, {playPause, nextSong, previousSong}) {
  const THRESHOLD = 10

  const handleStyler = styler(element)
  const handle = {
    x: value(0, handleStyler.set('x')),
    y: value(0, handleStyler.set('y'))
  }

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
          playPause()
          break
        case 'left':
          previousSong()
          break
        case 'right':
          nextSong()
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
  backgroundColor: props.playingState ? '#fce9c7' : '#fcfcff',
  transition: 'background-color 100ms',
  borderRadius: '20px',
  border: '1px solid rgba(0, 0, 0, 0.1)',
  width: '100%',
  maxWidth: '400px',
  padding: '0.4em',
  display: 'flex',
  position: 'relative',
  height: '4em',
  cursor: 'default',
  boxShadow: '0 1px 17px -3px rgba(0,0,0, 0.1)'
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
  border: '1px solid rgba(0, 0, 0, 0.16)',
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
  width: '100%',
  display: 'flex',
  position: 'absolute',
  bottom: '0px',
  padding: '1em',
  boxSizing: 'border-box',
  justifyContent: 'center'
})

const ScrubBar = (props) =>
  <Wrapper>
    <Bubble playingState={props.playingState} oncreate={((props) => (element) => makeInteractive(element, props))(props)}>
      <Indicator />
      <SongCover draggable='false' src={props.image} />
      <Info>
        <Song>
          {props.playingState ? '► ' : ''}{props.name}
        </Song>
        <Artist>
          {props.artist}
        </Artist>
      </Info>
    </Bubble>
  </Wrapper>

export default ScrubBar
