import { h } from 'hyperapp'
import picostyle from 'picostyle'
import { styler, spring, value, listen, pointer, everyFrame, schedule, transform } from 'popmotion'
import { nestable } from 'hyperapp-context'

const { snap } = transform

const style = picostyle(h)

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

const pointerX = (preventDefault = false, x = 0) => pointer({ x: x, preventDefault: preventDefault }).pipe(val => val.x)

const Page = nestable(
  {
    handleStyler: null,
    handleX: null,
    AXIS_LOCK_THRESHOLD: 15,
    isAxisLocked: false,
    makeInteractive: false,
    currentPointer: null,
    upListener: null,
    back: null
  },
  {
    init: (props) => {
      return {
        makeInteractive: true
      }
    },
    makeInteractive: ({ element, initialLoad }) => (state, actions) => {
      console.info('Making interactive')
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
        back === '/' ? window.flamous.location.go('/') : window.flamous.pages.back()
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
    slideOut: (done) => (state, actions) => {
      let { handleX } = state
      let bodyWidth = window.innerWidth

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
    },
    setBackLocation: (backUrl) => {
      return {
        back: backUrl || '/'
      }
    }
  },
  (state, actions) => (props, children) => (context) => {
    let { setBackLocation } = actions
    let { back } = state
    let { location } = context

    !back && setBackLocation((props.back && props.back.to) || location.previous)
    return <StyledPage
      {...props}
      class='page'
      key={props.key}
      oncreate={(element) => { element.parentNode.actions = actions; !props.hasOwnProperty('nonInteractive') && actions.makeInteractive({ element, initialLoad: context.initialLoad }) }}
    >
      <div style={{ paddingBottom: '6.5em' }}>
        {children}
      </div>
    </StyledPage>
  },
  'flamous-page')

export default (props, children) => <Page {...props} onremove={(elem, done) => { elem.actions.slideOut(done) }}>{children}</Page>
