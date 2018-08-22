import { h } from 'hyperapp'
import picostyle from 'picostyle'
import { styler, spring, value, listen, pointer, chain } from 'popmotion'
import { snap } from 'popmotion/lib/transformers'
import { smooth, getProgressFromValue } from 'popmotion/lib/calc'

const style = picostyle(h)
let handleStyler
let handleX
function makeInteractive (element) {
  element.style.transform = 'translateX(100%)'

  const AXIS_LOCK_THRESHOLD = 15
  let isAxisLocked = false
  handleStyler = styler(element)
  handleX = value('0%', handleStyler.set('x'))

  const pointerX = (preventDefault = false) => pointer({x: 0, preventDefault: preventDefault}).pipe(val => val.x)

  // Initial slide-in
  spring({
    from: '100%',
    to: '0%',
    damping: 20,
    mass: 0.5
  }).start(handleX)

  let handleSub
  // Swipe-mechanism
  listen(element, 'mousedown touchstart')
    .start((e) => {
      if (handleX.get() > 0) {
        handleSub.unsubscribe()
      }
      let currentPointer
      currentPointer = chain(pointer({x: 0, y: 0, preventDefault: false}), smooth(30)).start(({ x, y }) => {
        if (Math.abs(y) >= AXIS_LOCK_THRESHOLD && !isAxisLocked) {
          currentPointer.stop()
          upListener.stop()
          isAxisLocked = false
          return
        }
        if (Math.abs(x) <= AXIS_LOCK_THRESHOLD) {
          return
        }

        window.clickLock = true
        isAxisLocked = true
        currentPointer.stop()
        // let sub = handleX.subscribe((v) => console.log(v))

        currentPointer = chain(pointerX(true), smooth(30)).pipe((val) => `${getProgressFromValue(0, document.body.clientWidth, val)*100}%`).start(handleX)
      })

      let upListener = listen(element, 'mouseup touchend')
        .start((e) => {
          if (!isAxisLocked) {
            currentPointer.stop()
            upListener.stop()
            return
          }

          isAxisLocked = false
          upListener.stop()
          currentPointer.stop()

          // Everyhthing in percent
          let currentPos = Number(`${handleX.get().replace('%', '')}`)
          // console.log(currentPos)
          let velocity = Number(handleX.getVelocity() / document.body.clientWidth * 100)
          // console.log(velocity)
          // console.log(currentPos + velocity)

          let isGoingBack = Boolean(!snap([
            0,
            60
          ])(currentPos + velocity))
          // let pageWidth = document.body.clientWidth

          // handleSub = handleX.subscribe(val => {
          //   // console.log(val)
          //   if (val >= pageWidth) {
          //     // console.log('Way to often: ', val)
          //     handleSub.unsubscribe()
          //     window.clickLock = false
          //     stopSpring()
          //     window.flamous.location.go('/')
          //     // window.flamous.killPage()
          //   } else if (val === 0) {
          //     handleSub.unsubscribe()
          //     window.clickLock = false
          //   }
          // })
          // console.log(isGoingBack)
          if (!isGoingBack) {
            window.flamous.location.go('/')
          } else {
            spring({
              from: handleX.get(),
              to: 0,
              damping: 20,
              mass: 0.5,
              velocity: handleX.getVelocity()
            }).start(handleX)
          }
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
  oncreate: !props.hasOwnProperty('nonInteractive') && makeInteractive,
  onremove: (element, done) => {
    // console.log(handleX.getVelocity())
    handleX.subscribe((val) => { if (val.replace('%', '') >= 100) { done() } })
    // let handleStyler = styler(element)
    // let setter = handleStyler.set('x')
    // let handleX = value(handleStyler.get('x'), {update: (val) => { if (val.replace('%', '') >= 100) { done(); return }; setter(val) }})
    // console.log(handleX.getVelocity())
    // // let from = handleX.get() == 

    spring({
      from: handleX.get(),
      to: '100%',
      velocity: handleX.getVelocity(),
      damping: 20,
      stiffness: 100,
      mass: 0.5
    }).start(handleX)
  }
}, <div>
  {children}
</div>
)

export default Page
