/** @jsx h */
import { h } from 'hyperapp'
import style from '../style'
import { spring, styler, value } from 'popmotion'
import closeImage from '../assets/close_white.svg'

const ImageViewerStyles = style('div')({
  height: '100%',
  width: '100%',
  backgroundColor: 'rgba(0, 0, 0, 0)',
  transition: 'background-color 150ms 150ms linear, opacity 100ms linear',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  position: 'fixed',
  zIndex: '1001',
  flexDirection: 'column'
})

const Image = style('img')({
  borderRadius: '5px',
  width: '500px',
  maxWidth: '100%'
})

// const multitouchPointer = ({x, y}) => {
//   const applyXOffset = applyOffset(x || 0)
//   const applyYOffset = applyOffset(y || 0)

//   return action(({update}) => {
//     let lastPoints = {}
//     let lastPoint = {}
//     let delta = {}

//     console.log('init!')

//     function pointsChange (touches) {
//       delta.x = 0
//       delta.y = 0

//       let newPoints = JSON.parse(JSON.stringify(touches))
//       let newPoint = {}
//       // console.log(lastPoints)
//       if (Object.getOwnPropertyNames(lastPoints).length === 0) {
//         lastPoint = {x: x, y: y}

//         console.log('newPoins right before lastPoints init: ', newPoints)
//         lastPoints = JSON.parse(JSON.stringify(newPoints))
//         update(lastPoint)
//         return
//       }

//       console.log(lastPoints.length === newPoints.length)
//       // newPoints.length = Math.min(lastPoints.length, newPoints.length)
//       // Calculate deltas
//       newPoints.forEach((touch, index) => {
//         delta.x += touch.x - lastPoints[index].x
//         delta.y += touch.y - lastPoints[index].y
//       })

//       lastPoints = JSON.parse(JSON.stringify(newPoints))
//       console.log('lastPoints at the end: ', lastPoints)
//       newPoint.x = lastPoint.x + delta.x
//       newPoint.y = lastPoint.y + delta.y

//       lastPoint = JSON.parse(JSON.stringify(newPoint))

//       update(newPoint)
//     }
//     let deltas
//     multitouch()
//       .pipe(({touches}) => { console.log('touches on init: ', touches); return touches }, (touches) => {
//         deltas = touches.map((touch) => {
//           let obj = {
//             x: applyXOffset(touch.x),
//             y: applyYOffset(touch.y)
//           }
//           return obj
//         })

//         return deltas
//       })
//       .start(pointsChange)
//   })
// }

function start (data) {
  // Using FLIP terminology: https://aerotwist.com/blog/flip-your-animations/
  let first = data.bounds
  let last = data.element.getBoundingClientRect()

  let scale = first.width / last.width
  let invertY = (first.top - last.top) + ((last.height * scale) / 2) - (last.height / 2)
  // On desktop the scrollbars skey the coordinates so we also have to do stuff to match the original image position
  let invertX = (first.left - last.left) + ((last.height * scale) / 2) - (last.height / 2)

  let handleStyler = styler(data.element)
  // INVERT
  let handleScale = value(scale, handleStyler.set('scale'))
  let handleXY = value({ x: invertX, y: invertY }, ({ x, y }) => handleStyler.set({ x, y }))

  data.element.style.transformOrigin = 'center'
  data.element.style.webkitTransformOrigin = 'center'
  data.element.style.borderRadius = '5px'

  // PLAY
  spring({
    from: handleScale.get(),
    to: 1,
    damping: 20,
    mass: 0.3,
    stiffness: 120
  }).start(handleScale)

  spring({
    from: handleXY.get(),
    to: 0,
    damping: 15,
    mass: 0.3,
    stiffness: 120
  }).start(handleXY)

  // let touchDragSub
  // listen(data.element, 'mousedown touchstart')
  //   .start((event) => {
  //     touchDragSub = multitouchPointer(handleXY.get())
  //       .start(handleXY)
  //   })

  // let touchScaleSub
  // listen(data.element, 'touchstart', {preventDefault: false})
  //   .filter(({touches}) => touches.length >= 2)
  //   .start((event) => {
  //     touchScaleSub = multitouch({scale: handleScale.get()})
  //       .pipe(({scale}) => scale)
  //       .start(handleScale)
  //   })

  // listen(document, 'mouseup touchend', {preventDefault: false})
  //   .start((event) => {
  //     let numTouches = event.touches.length

  //     if (touchScaleSub) {
  //       let scale = handleScale.get()

  //       // console.log('new number of touches: ', numTouches)
  //       numTouches <= 1 && touchScaleSub.stop()
  //       scale < 1 && spring({
  //         from: scale,
  //         to: 1,
  //         velocity: handleScale.getVelocity(),
  //         mass: 0.5
  //       }).start(handleScale)
  //     }
  //     console.log('touchend length', numTouches)

  //     if (event.touches.length === 0) {
  //       // console.log('stopping')
  //       touchDragSub.stop()

  //       spring({
  //         from: handleXY.get(),
  //         to: 0,
  //         velocity: handleXY.getVelocity(),
  //         mass: 0.5
  //       }).start(handleXY)
  //     } else {
  //       // Restart with updated touches
  //       // console.info('Removing finger')
  //       touchDragSub && touchDragSub.stop()
  //       window.setTimeout(() => {
  //         touchDragSub = multitouchPointer(handleXY.get())
  //           .start(handleXY)
  //       }, 0)
  //     }
  //   })
}

function fadeOut (element, done) {
  element.addEventListener('transitionend', () => {
    done()
  })
  element.style.opacity = '0'
}

const ImageViewer = (props) => {
  return <ImageViewerStyles onremove={fadeOut} oncreate={(elem) => { elem.style.backgroundColor = 'rgba(0, 0, 0, 0.88)' }}>
    <div style={{ width: '500px', maxWidth: '100%', textAlign: 'right' }}>
      <span title='Close' style={{ color: 'white', padding: '0.6em', transform: 'translateY(-1em)', display: 'inline-block', fontWeight: 'bold' }} onclick={window.flamous.imageViewer.hideImageViewer}><img style={{ height: '2.25em' }} src={closeImage} /></span>
    </div>
    <Image src={props.image} oncreate={(elem) => start({ element: elem, bounds: props.bounds })} />
  </ImageViewerStyles>
}

export default ImageViewer
