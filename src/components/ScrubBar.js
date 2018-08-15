import { h } from 'hyperapp'
import picostyle from 'picostyle'
import { styler, value, listen, pointer, spring, chain } from 'popmotion'
import { nonlinearSpring } from 'popmotion/lib/transformers'
import { smooth } from 'popmotion/lib/calc'

function makeInteractive (element, {playPause, nextSong, previousSong}) {
  const THRESHOLD = 10

  const handleStyler = styler(element)
  const handleX = value(0, handleStyler.set('x'))
  const handleY = value(0, handleStyler.set('y'))

  const pointerXY = (val) => pointer(val)
  const pointerX = (x) => pointer({x}).pipe(v => v.x)
  const pointerY = y => pointer({y}).pipe(v => v.y)

  let currentHandle
  let direction = 'none'
  let stopPointer

  listen(element, 'mousedown touchstart')
    .start((e) => {
      let {stop} = pointerXY({x: 0, y: 0})
        .start(({x, y}) => {
          if (Math.abs(x) > THRESHOLD) {
            direction = x > 0 ? 'right' : 'left'
            stopPointer = chain(pointerX(0).pipe(v => nonlinearSpring(3, 0)(v)), smooth(25))
              .start(handleX)
            currentHandle = handleX
            stop()
          } else if (Math.abs(y) > THRESHOLD) {
            direction = (y > 0) ? 'bottom' : 'top'
            stopPointer = chain(pointerY(0).pipe((v) => nonlinearSpring(1, 0)(v)), smooth(25))
              .start(handleY)
            // direction = 'top'
            currentHandle = handleY
            stop()
          }
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
      spring({
        from: currentHandle.get(),
        velocity: currentHandle.getVelocity()
      })
        .start(currentHandle)
    })
}

const style = picostyle(h)

const Bubble = style('div')({
  backgroundColor: '#fcfcff',
  borderRadius: '20px',
  border: '1px solid rgba(0, 0, 0, 0.1)',
  width: '100%',
  maxWidth: '400px',
  padding: '0.4em',
  position: 'relative',
  display: 'flex',
  height: '4em',
  cursor: 'default',
  boxShadow: '0 1px 17px -3px rgba(0,0,0, 0.1)'
})

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

const ScrubBar = (props) =>
  <Bubble oncreate={((props) => (element) => makeInteractive(element, props))(props)}>
    <Indicator />
    <SongCover draggable='false' src={props.image} />
    <Info>
      <Song>
        {props.name}
      </Song>
      <Artist>
        {props.artist}
      </Artist>
    </Info>
  </Bubble>

export default ScrubBar
