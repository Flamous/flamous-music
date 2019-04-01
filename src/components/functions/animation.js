import { styler, spring, value, listen, pointer, everyFrame, schedule, transform } from 'popmotion'
import { disableBodyScroll, enableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock'
import device from './../../modules/device'

const { snap, nonlinearSpring, clamp, conditional } = transform

const pointerX = (preventDefault = false, x = 0) => pointer({ x: x, preventDefault: preventDefault }).pipe(val => val.x)
let velocityClamp = clamp(-8000, 8000)
const DRAG_THRESHOLD = 12
let softClamp = nonlinearSpring(5, 0)

const slideIn = {
  state: {
    handleStyler: null,
    handleX: null,
    AXIS_LOCK_THRESHOLD: 15,
    isAxisLocked: false,
    started: false,
    currentPointer: null,
    upListener: null,
    back: null
  },
  actions: {
    init: (props) => {
      return {
        started: true
      }
    },
    start: ({ element, initialLoad, nonInteractive, isActivePage }) => (state, actions) => {
      if (!device.isStandalone) {
        if (isActivePage && initialLoad) {
          window.flamous.setInitialLoad(false)
        }
        if (nonInteractive) {
          element.style.transform = 'none'
          return
        }
        return
      }

      disableBodyScroll(element)

      let handleStyler = styler(element)
      let handleX

      if (isActivePage && initialLoad) {
        window.flamous.setInitialLoad(false)
      }
      if (nonInteractive) {
        element.style.transform = 'translateX(0)'
        return
      }

      let { startSwipeBack } = actions

      if (!initialLoad) {
        // Initial slide-in
        handleX = value(window.innerWidth, handleStyler.set('x'))
        spring({
          from: window.innerWidth,
          to: 0,
          damping: 20,
          mass: 0.3,
          stiffness: 120
        }).start(handleX)
      } else {
        handleX = value(0, handleStyler.set('x'))
      }

      listen(element, 'touchstart', { passive: true })
        .start(startSwipeBack)

      return {
        handleX: handleX
      }
    },
    startSwipeBack: (e) => (state, actions) => {
      let { endSwipeBack, setAxisLock } = actions
      let { isAxisLocked, AXIS_LOCK_THRESHOLD, handleX } = state
      let currentPointer

      currentPointer = pointer({ x: 0, y: 0, preventDefault: false }).start(({ x, y }) => {
        if (Math.abs(y) >= AXIS_LOCK_THRESHOLD && !isAxisLocked) {
          currentPointer.stop()
          upListener.stop()
          return {
            isAxisLocked: false
          }
        }
        if (Math.abs(x) <= AXIS_LOCK_THRESHOLD) return

        window.clickLock = true
        setAxisLock(true)
        currentPointer.stop()

        currentPointer = schedule(
          everyFrame(),
          pointerX(true, handleX.get())
        ).pipe((val) => {
          return val > 0 ? val : 0
        }).start(handleX)
      })

      let upListener = listen(document, 'touchend', { passive: true })
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
      let bodyWidth = window.innerWidth
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
        window.flamous.views.back()
        // back === '/' ? window.flamous.location.go('/') : window.flamous.pages.back()
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
    },
    slideOut: (options) => (state, actions) => {
      if (!device.isStandalone) {
        options.done()
        return
      }
      let { done, element } = options
      let { handleX } = state
      let bodyWidth = window.innerWidth
      let velocity = handleX.getVelocity()

      enableBodyScroll(element)

      handleX.subscribe((val) => {
        if (val >= bodyWidth) {
          handleX.stop()
          done()
          window.clickLock = false
        }
      })
      spring({
        from: handleX.get(),
        to: window.innerWidth,
        velocity: velocity,
        mass: 2,
        damping: 40,
        stiffness: 300
      }).start(handleX)
    }
  }
}

const slideUp = {
  state: {
    handleStyler: null,
    handleY: null,
    started: false,
    initialized: false
  },
  actions: {
    init: (props) => {
      return {
        started: true
      }
    },
    setState (changedState) {
      return changedState
    },
    start: (data) => (state, actions) => {
      let { element, initialLoad, initialInteractive, slideOutInteractive, back } = data
      let { initialized, handleStyler, handleY } = state

      let bodyHeight = window.innerHeight
      let springHandle

      handleStyler = handleStyler || styler(element)
      disableBodyScroll(element)

      function initSwipeBack () {
        if (slideOutInteractive) {
          let p1

          listen(element, 'touchstart')
            .start(event => {
              springHandle && springHandle.stop()
              let startY = handleY.get()
              let isDrag = false
              let appliedThreshold
              let delta

              p1 = pointer({ y: startY })
                .pipe(
                  data => data.y,
                  conditional(() => !isDrag, y => { delta = y - startY; return y }),
                  conditional(y => !isDrag && Math.abs(delta) >= 15, y => {
                    isDrag = true
                    appliedThreshold = delta > 0 ? -DRAG_THRESHOLD : DRAG_THRESHOLD
                    return y
                  }),
                  conditional(y => !isDrag && Math.abs(delta) < 15, () => startY),
                  conditional(y => isDrag, y => y + appliedThreshold),
                  conditional(y => isDrag && y < 0, y => softClamp(-y))
                )
                .start(handleY)

              listen(document, 'touchend', { once: true })
                .start(event => {
                  isDrag = false
                  p1 && p1.stop()

                  let velocity = handleY.getVelocity()
                  velocity = velocityClamp(velocity)
                  let y = handleY.get()
                  let deltaY = (y - startY) + velocity
                  let sub

                  if (deltaY > 80) { // Go Back (slide out)
                    sub = handleY.subscribe({ update: v => {
                      if (v >= bodyHeight) {
                        enableBodyScroll(element)
                        sub && sub.unsubscribe()
                        back()
                      }
                    } })
                    spring({
                      from: y,
                      to: bodyHeight,
                      velocity: velocity,
                      damping: 17,
                      mass: 1,
                      stiffness: 110
                    }).start(handleY)
                  } else { // User didn't swipe enough
                    springHandle = spring({
                      from: y,
                      to: 0,
                      velocity: velocity,
                      damping: 25,
                      mass: 1.1,
                      stiffness: 200
                    }).start(handleY)
                  }
                })
            })
        }
      }

      if (initialLoad) {
        window.flamous.setInitialLoad(false)
        handleY = handleY || value(0, handleStyler.set('y'))
        initSwipeBack()

        return {
          handleStyler,
          handleY,
          initialized: true
        }
      }

      handleY = handleY || value(bodyHeight, handleStyler.set('y'))

      !initialized && initSwipeBack()

      if (initialInteractive) {
        let p = pointer({ y: handleY.get() })
          .pipe(data => data.y)
          .start(handleY)

        let l1 = listen(document, 'touchend', { once: true })
          .start(event => {
            p.stop()
            let velocity = handleY.getVelocity() * 2
            velocity = velocityClamp(velocity)
            let y = handleY.get()
            let deltaY = bodyHeight - (y + velocity)

            if (deltaY < 0) {
              l1.stop()
              window.requestAnimationFrame(() => { window.requestAnimationFrame(() => back()) })
            } else {
              springHandle = spring({
                from: y,
                to: 0,
                velocity: velocity,
                damping: 25,
                mass: 1.1,
                stiffness: 200
              }).start(handleY)
            }
          })

        return {
          handleStyler,
          handleY,
          initialized: true
        }
      }

      spring({
        from: bodyHeight,
        to: 0,
        damping: 20,
        mass: 0.3,
        stiffness: 120
      }).start(handleY)

      return {
        handleStyler,
        handleY,
        initialized: true
      }
    },
    slideOut: (options = {}) => (state, actions) => {
      let { done } = options
      let { handleY, handleStyler } = state
      let targetHeight = handleStyler.get('height')
      let handleYHeight = handleY.get()
      let sub
      let s1

      function checkFinished (val) {
        if (val >= targetHeight) {
          handleY.stop()
          s1 && s1.stop()
          sub && sub.unsubscribe()
          handleStyler.set('y', '100%')
          try {
            done && done()
          } catch (error) {
            console.warn('Tried to call `done` for a non-existent element.', error)
          }

          return true
        }
        return false
      }

      clearAllBodyScrollLocks()
      if (checkFinished(handleYHeight)) return

      sub = handleY.subscribe((val) => {
        checkFinished(val)
      })

      s1 = spring({
        from: handleYHeight,
        to: targetHeight,
        damping: 13,
        mass: 1,
        stiffness: 110
      }).start(handleY)
    }
  }
}

export {
  slideIn,
  slideUp
}
