import { h } from 'hyperapp'
import picostyle from 'picostyle'
import { styler, spring, value, listen, pointer } from 'popmotion'
import { snap } from 'popmotion/lib/transformers'

const style = picostyle(h)

function makeInteractive (element) {
  element.style.transform = 'translateX(100%)'

  const AXIS_LOCK_THRESHOLD = 15
  const handleStyler = styler(element)
  const handleX = value(0, handleStyler.set('x'))

  const pointerX = () => pointer({x: 0, preventDefault: false}).pipe(val => val.x).filter(x => x > 0)

  // Initial slide-in
  spring({
    from: {x: '100%'},
    to: {x: 0},
    damping: 20,
    mass: 0.5
  }).start(handleStyler.set)
  let stopP2
  // Swipe-mechanism
  listen(element, 'mousedown touchstart')
    .start((e) => {
      let stopPointer = pointerX().start((x) => {
        if (Math.abs(x) <= AXIS_LOCK_THRESHOLD) return

        window.clickLock = true
        stopPointer.stop()
        stopP2 = pointerX().start(handleX)
      })

      let upListener = listen(document, 'mouseup touchend')
        .start((e) => {
          upListener.stop()
          stopPointer.stop()
          stopP2.stop && stopP2.stop()
          let snapper = snap([
            0,
            (document.body.clientWidth * 1.1)
          ])
          let pos = handleX.get()
          let velocity = handleX.getVelocity()

          spring({
            from: pos,
            to: snapper(pos + velocity),
            damping: 20,
            mass: 0.5,
            velocity: velocity
          }).start({
            update: val => handleStyler.set('x', val),
            complete: () => {
              window.clickLock = false
            }
          })
        })
    })
}

const Page = (props, children) => style('article')({
  height: '100%',
  width: '100%',
  position: 'absolute',
  overflowY: 'auto',
  color: '#212121',
  backgroundColor: 'white',
  boxShadow: '0 0 2px 0 #848484'
})({
  oncreate: !props.hasOwnProperty('nonInteractive') && makeInteractive
},
<div>
  {children}
</div>
)

export default Page
