import { h } from 'hyperapp'
import picostyle from 'picostyle'
import { styler, spring, value, listen, pointer } from 'popmotion'

const style = picostyle(h)

function makeInteractive (element) {
  element.style.transform = 'translateX(100%)'

  const handleStyler = styler(element)
  const handleX = value(0, handleStyler.set('x'))

  const pointerX = () => pointer({x: 0}).pipe(val => val.x)

  // Initial slide-in
  spring({
    from: {x: '100%'},
    to: {x: 0},
    damping: 20,
    // stiffness: 200,
    mass: 0.5
  }).start(handleStyler.set)

  listen(element, 'mousedown touchstart')
    .start((e) => {
      let stopPointer = pointerX().start(handleX)

      listen(document, 'mouseup touchend')
        .start(() => {
          stopPointer.stop()
          console.log(handleX.get())

          spring({
            from: handleX.get(),
            to: document.body.clientWidth * 1.2,
            damping: 20,
            mass: 0.5,
            velocity: handleX.getVelocity()
          }).start(handleX)
        })
    })
}

const Page = (props, children) => style('article')({
  height: '100%',
  width: '100%',
  position: 'absolute',
  overflowY: 'auto',
  color: '#212121',
  backgroundColor: 'white'
})({
  oncreate: !props.hasOwnProperty('nonInteractive') && makeInteractive
},
children
)

export default Page
