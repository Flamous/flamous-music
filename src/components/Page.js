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
  boxShadow: '0 0 10px 0 rgba(0, 0, 0, 0.2)',
  overscrollBehavior: 'contain'
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
      console.info('Making interactive')
      let {startSwipeBack} = actions

      let handleStyler = styler(element)
      let handleX = value(0, handleStyler.set('x'))

      // Initial slide-in
      spring({
        from: document.body.clientWidth,
        to: 0,
        damping: 20,
        mass: 0.5
      }).start(handleX)

      listen(element, 'mousedown touchstart', { passive: true })
        .start(startSwipeBack)

      return {
        handleX: handleX
      }
    },
    startSwipeBack: (e) => (state, actions) => {
      let { endSwipeBack, setAxisLock } = actions
      let { isAxisLocked, AXIS_LOCK_THRESHOLD, handleX } = state
      let currentPointer

      currentPointer = pointer({x: 0, y: 0, preventDefault: false}).start(({ x, y }) => {
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
          pointerX(true, handleX.get())
        ).pipe(smooth(25), (val) => {
          return val > 0 ? val : 0
        }).start(handleX)
      })

      let upListener = listen(document, 'mouseup touchend', { passive: true })
        .start(endSwipeBack)

      return {
        currentPointer: currentPointer,
        upListener: upListener
      }
    },
    endSwipeBack: (e) => (state, actions) => {
      let { isAxisLocked, currentPointer, upListener } = state
      let { setAxisLock } = actions

      currentPointer.stop()
      upListener.stop()

      if (!isAxisLocked) return

      setAxisLock(false)

      let { handleX } = state
      let bodyWidth = document.body.clientWidth
      let currentPosition = handleX.get()
      let currentVelocity = handleX.getVelocity()
      let snappy = snap([0, bodyWidth / 2])
      let getIsLeaving = (position) => {
        let snappedPosition = snappy(position)

        return snappedPosition || 0
      }
      let isLeaving = getIsLeaving(currentPosition + currentVelocity)

      if (isLeaving) {
        window.clickLock = true
        let location = window.flamous.getState().location
        let back = location.previous !== location.pathname ? location.previous : '/'

        // BUG: onremove events are not fired! That's why we finish the animation here and not in the onremove handler
        handleX.subscribe((val) => {
          if (val >= bodyWidth) {
            handleX.stop()
            back === '/' ? window.flamous.location.go('/') : window.flamous.pages.back()
            window.clickLock = false
          }
        })

        spring({
          from: currentPosition,
          to: bodyWidth,
          velocity: currentVelocity
        }).start(handleX)
      } else {
        spring({
          from: currentPosition,
          to: 0,
          damping: 20,
          mass: 0.5,
          velocity: currentVelocity
        }).pipe(val => { return val >= 0 ? val : 0 }).start(handleX)
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
      {...props}
      class='page'
      key={props.key}
      oncreate={!props.hasOwnProperty('nonInteractive') && actions.makeInteractive}
    >
      <div style={{paddingBottom: '6.5em'}}>
        {console.log(children)}
        {children}
      </div>
    </StyledPage>
  },
  'flamous-page')

export default (props, children) => <Page {...props} onremove={(event) => { console.log('test') }}>{children}</Page>
