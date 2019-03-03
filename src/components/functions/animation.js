import { styler, spring, value, listen, pointer, everyFrame, schedule, transform } from 'popmotion'
import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock'

const { snap } = transform

const pointerX = (preventDefault = false, x = 0) => pointer({ x: x, preventDefault: preventDefault }).pipe(val => val.x)

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
    started: false
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

      let handleStyler = styler(element)
      let bodyHeight = window.innerHeight
      let handleY

      disableBodyScroll(element)

      function initSwipeBack () {
        if (slideOutInteractive) {
          let p1
          let p2
          let l1 = listen(element, 'touchstart')
            .start(event => {
              let startY = handleY.get()
              p1 = pointer({ y: startY })
                .pipe(data => data.y)
                .start(y => {
                  let lel = (y - startY)
                  if (lel > 15) {
                    p1.stop()
                    p2 = pointer({ y: handleY.get() })
                      .pipe(data => data.y)
                      .start(handleY)
                  }
                })

              listen(document, 'touchend', { once: true })
                .start(event => {
                  p1 && p1.stop()
                  p2 && p2.stop()
                  let velocity = handleY.getVelocity()
                  let y = handleY.get()
                  let deltaY = (y - startY) + velocity * 2

                  if (deltaY > 80) { // Go Back (slide out)
                    let sub = handleY.subscribe({ update: v => {
                      if (v >= bodyHeight) {
                        sub.unsubscribe(); back()
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
                    l1.stop()
                  } else { // User didn't swipe enough
                    spring({
                      from: y,
                      to: 0,
                      damping: 20,
                      mass: 0.3,
                      stiffness: 120
                    }).start(handleY)
                  }
                })
            })
        }
      }

      if (initialLoad) {
        window.flamous.setInitialLoad(false)
        handleY = value(0, handleStyler.set('y'))
        initSwipeBack()

        return {
          handleStyler,
          handleY
        }
      }

      handleY = value(bodyHeight, handleStyler.set('y'))

      initSwipeBack()

      if (initialInteractive) {
        let p = pointer({ y: handleY.get() })
          .pipe(data => data.y)
          .start(handleY)

        let l1 = listen(document, 'touchend', { once: true })
          .start(event => {
            p.stop()
            let velocity = handleY.getVelocity() * 2
            let y = handleY.get()
            let deltaY = bodyHeight - (y + velocity)

            if (deltaY < 25) {
              window.requestAnimationFrame(() => { window.requestAnimationFrame(() => back()) })
              l1.stop()
            } else {
              spring({
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
          handleY
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
        handleY
      }
    },
    slideOut: (options) => (state) => {
      let { done, element } = options
      let { handleY, handleStyler } = state
      let targetHeight = handleStyler.get('height')

      enableBodyScroll(element)

      handleY.subscribe((val) => {
        if (val >= targetHeight) {
          handleY.stop()
          try {
            done()
          } catch {}
        }
      })

      spring({
        from: handleY.get(),
        to: targetHeight,
        damping: 17,
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
