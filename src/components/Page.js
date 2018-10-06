import { h } from 'hyperapp'
import picostyle from 'picostyle'
import { styler, spring, value, listen, pointer, chain, everyFrame, schedule, calc, transform } from 'popmotion'
import { nestable } from 'hyperapp-context'

const { snap, smooth } = transform
const { getProgressFromValue, getValueFromProgress } = calc

const style = picostyle(h)

// function makeInteractive (element) {
//   let handleStyler
//   let handleX
//   element.style.transform = 'translateX(100%)'

//   const AXIS_LOCK_THRESHOLD = 15
//   let isAxisLocked = false
//   handleStyler = styler(element)
//   handleX = value('0%', handleStyler.set('x'))

//   element.handleX = handleX

//   const pointerX = (preventDefault = false, x = 0) => pointer({x: x, preventDefault: preventDefault}).pipe(val => val.x)

//   // Initial slide-in
//   spring({
//     from: '100%',
//     to: '0%',
//     damping: 20,
//     mass: 0.5
//   }).start(handleX)

//   // Swipe-back mechanism
//   listen(element, 'mousedown touchstart')
//     .start((e) => {
//       let currentPointer
//       currentPointer = chain(pointer({x: 0, y: 0, preventDefault: false})).start(({ x, y }) => {
//         if (Math.abs(y) >= AXIS_LOCK_THRESHOLD && !isAxisLocked) {
//           currentPointer.stop()
//           upListener.stop()
//           isAxisLocked = false
//           return
//         }
//         if (Math.abs(x) <= AXIS_LOCK_THRESHOLD) {
//           return
//         }

//         window.clickLock = true
//         isAxisLocked = true
//         currentPointer.stop()

//         currentPointer = schedule(
//           everyFrame(),
//           pointerX(true,
//             // Set pointer starting point to current position of handleX
//             getValueFromProgress(
//               0,
//               document.body.clientWidth,
//               Number(handleX.get().replace('%', '')) / 100
//             ))).pipe(smooth(25), (val) => {
//           // Convert pixel to percentage value
//           val = getProgressFromValue(0, document.body.clientWidth, val) * 100

//           return `${val > 0 ? val : 0}%`
//         }).start(handleX)
//       })

//       let upListener = listen(element, 'mouseup touchend')
//         .start((e) => {
//           if (!isAxisLocked) {
//             currentPointer.stop()
//             upListener.stop()
//             return
//           }

//           isAxisLocked = false
//           upListener.stop()
//           currentPointer.stop()

//           // Everyhthing in percent
//           let currentPos = Number(`${handleX.get().replace('%', '')}`)
//           // console.log(currentPos)
//           let velocity = Number(handleX.getVelocity() / document.body.clientWidth * 100)
//           let isGoingBack = Boolean(!snap([
//             0,
//             47.5
//           ])(currentPos + velocity))
//           // let pageWidth = document.body.clientWidth

//           // handleSub = handleX.subscribe(val => {
//           //   // console.log(val)
//           //   if (val >= pageWidth) {
//           //     // console.log('Way to often: ', val)
//           //     handleSub.unsubscribe()
//           //     window.clickLock = false
//           //     stopSpring()
//           //     window.flamous.location.go('/')
//           //     // window.flamous.killPage()
//           //   } else if (val === 0) {
//           //     handleSub.unsubscribe()
//           //     window.clickLock = false
//           //   }
//           // })
//           // console.log(isGoingBack)
//           if (!isGoingBack) {
//             window.clickLock = true
//             window.flamous.location.go(window.flamous.getState().location.previous)
//           } else {
//             spring({
//               from: handleX.get(),
//               to: 0,
//               damping: 20,
//               mass: 0.5,
//               velocity: handleX.getVelocity()
//             }).pipe(val => { val = Number(val.replace('%', '')); return `${val >= 0 ? val : 0}%` }).start(handleX)
//           }
//         })
//     })
// }
const StyledPage = style('article')({
  height: '100%',
  width: '100%',
  position: 'fixed',
  overflowY: 'auto',
  color: '#212121',
  backgroundColor: 'white',
  boxShadow: '0 0 10px 0 rgba(0, 0, 0, 0.2)'
})

const pointerX = (preventDefault = false, x = 0) => pointer({x: x, preventDefault: preventDefault}).pipe(val => val.x)

const Page = nestable(
  {
    handleStyler: null,
    handleX: null,
    AXIS_LOCK_THRESHOLD: 15,
    isAxisLocked: false,
    makeInteractive: false,
    currentPointer: null,
    upListener: null
  },
  {
    init: (props) => {
      return {
        makeInteractive: true
      }
    },
    makeInteractive: (element) => (state, actions) => {
      let {startSwipeBack} = actions
      // let handleStyler = !state.hasOwnProperty('nonInteractive') ? styler(element) : ''
      // let handleX = !state.hasOwnProperty('nonInteractive') ? value('0%', handleStyler.set('x')) : ''
      element.style.transform = 'translateX(100%)'

      let handleStyler = styler(element)
      let handleX = value('0%', handleStyler.set('x'))

      // Initial slide-in
      spring({
        from: '100%',
        to: '0%',
        damping: 20,
        mass: 0.5
      }).start(handleX)

      listen(element, 'mousedown touchstart')
        .start(startSwipeBack)

      return {
        handleX: handleX
      }
    },
    startSwipeBack: (e) => (state, actions) => {
      let { endSwipeBack, setAxisLock } = actions
      let { isAxisLocked, AXIS_LOCK_THRESHOLD, handleX } = state
      let currentPointer

      currentPointer = chain(pointer({x: 0, y: 0, preventDefault: false})).start(({ x, y }) => {
        if (Math.abs(y) >= AXIS_LOCK_THRESHOLD && !isAxisLocked) {
          currentPointer.stop()
          upListener.stop()
          return {
            isAxisLocked: false
          }
        }
        if (Math.abs(x) <= AXIS_LOCK_THRESHOLD) {
          return
        }

        window.clickLock = true
        setAxisLock(true)
        currentPointer.stop()

        currentPointer = schedule(
          everyFrame(),
          pointerX(true,
            // Set pointer starting point to current position of handleX
            getValueFromProgress(
              0,
              document.body.clientWidth,
              Number(handleX.get().replace('%', '')) / 100
            ))).pipe(smooth(25), (val) => {
          // Convert pixel to percentage value
          val = getProgressFromValue(0, document.body.clientWidth, val) * 100

          return `${val > 0 ? val : 0}%`
        }).start(handleX)
      })

      let upListener = listen(document, 'mouseup touchend')
        .start(endSwipeBack)

      return {
        currentPointer: currentPointer,
        upListener: upListener
      }
    },
    endSwipeBack: (e) => (state, actions) => {
      let { isAxisLocked, currentPointer, upListener, handleX } = state
      let { setAxisLock } = actions
      if (!isAxisLocked) {
        currentPointer.stop()
        upListener.stop()
        console.log('WEYO')
        return
      }
      console.log('WIUUU')
      setAxisLock(false)
      upListener.stop()
      currentPointer.stop()

      // Everyhthing in percent
      let currentPos = Number(`${handleX.get().replace('%', '')}`)
      // console.log(currentPos)
      let velocity = Number(handleX.getVelocity() / document.body.clientWidth * 100)
      let isGoingBack = Boolean(!snap([
        0,
        47.5
      ])(currentPos + velocity))

      if (!isGoingBack) {
        window.clickLock = true
        window.flamous.location.go(window.flamous.getState().location.previous)
      } else {
        spring({
          from: handleX.get(),
          to: 0,
          damping: 20,
          mass: 0.5,
          velocity: handleX.getVelocity()
        }).pipe(val => { val = Number(val.replace('%', '')); return `${val >= 0 ? val : 0}%` }).start(handleX)
      }
    },
    setAxisLock: (boolean) => {
      return {
        isAxisLocked: boolean
      }
    }
  },
  (state, actions) => (props, children) => {
    return <StyledPage
      class='page'
      key={props.key}
      oncreate={!props.hasOwnProperty('nonInteractive') && actions.makeInteractive}
      onremove={(element, done) => {
      // Prevent clicking links as this somehow screws up hyperapp (when switchign to a new url before the slide-out animation is finished)
      // still not ideal when user is navigating with browser back/forward buttons
        window.clickLock = true

        element.handleX.subscribe((val) => {
          if (val.replace('%', '') >= 100) {
            element.handleX.stop()
            done()
            window.clickLock = false
          }
        })

        spring({
          from: element.handleX.get(),
          to: '100%',
          velocity: element.handleX.getVelocity() * 3
        }).start(element.handleX)
      }}>
      <div style={{paddingBottom: '6.5em'}}>
        {console.log(children)}
        {children}
      </div>
    </StyledPage>
  })

export default Page
