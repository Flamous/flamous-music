import { styler, spring, value, listen, pointer, everyFrame, schedule, transform } from 'popmotion'
import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock'

// function preventBubbling (event) {
//   event.stopPropagation()
// }

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
      console.info('Making interactive')
      // element.addEventListener('touchmove', preventBubbling, { passive: true }) // Safari doesn't support CSS's scroll-behaviour: contain and has a huge UX bug with the default. When scrolling to the top (or bottom) and waiting for the scroll-bounce to finish , if you then scroll again in the same direction, it completely freezed the scroll (because it scroll bubbles to the parent). But the parent is fixed and non-scrollable, Thus **nothing** happens at all! this should fix it.
      // element.addEventListener('touchstart', preventBubbling, { passive: true })

      disableBodyScroll(element)

      if (isActivePage && initialLoad) window.flamous.setInitialLoad(false)
      if (nonInteractive) return

      let { startSwipeBack } = actions

      let handleStyler = styler(element)
      let handleX = value(0, handleStyler.set('x'))

      if (!initialLoad) {
        // Initial slide-in
        spring({
          from: window.innerWidth,
          to: 0,
          damping: 20,
          mass: 0.3,
          stiffness: 120
        }).start(handleX)
      } else {
        window.flamous.setInitialLoad(false)
      }

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

      let upListener = listen(document, 'mouseup touchend', { passive: true })
        .start(endSwipeBack)

      return {
        currentPointer: currentPointer,
        upListener: upListener
      }
    },
    endSwipeBack: (e) => (state, actions) => {
      let { isAxisLocked, currentPointer, upListener, back } = state
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
        window.history.back()
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

      enableBodyScroll(element)

      // element.removeEventListener('touchmove', preventBubbling)
      // element.removeEventListener('touchstart', preventBubbling)

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
        velocity: handleX.get(),
        mass: 1,
        damping: 20,
        stiffness: 160
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
    start: (data) => () => {
      let { element, initialLoad } = data

      let handleStyler = styler(element)
      let bodyHeight = window.innerHeight
      let handleY

      if (initialLoad) {
        window.flamous.setInitialLoad(false)
        handleY = value(0, handleStyler.set('y'))

        return {
          handleStyler,
          handleY
        }
      }

      handleY = value(bodyHeight, handleStyler.set('y'))

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
    slideOut: (done) => (state) => {
      let { handleY } = state

      let bodyHeight = window.innerHeight

      handleY.subscribe((val) => {
        if (val >= bodyHeight) {
          handleY.stop()
          done()
        }
      })

      spring({
        from: handleY.get(),
        to: window.innerHeight,
        mass: 1,
        damping: 20,
        stiffness: 160
      }).start(handleY)
    }
  }
}

export {
  slideIn,
  slideUp
}
