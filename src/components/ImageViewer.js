import { h } from 'hyperapp'
import style from '../style'
import { spring, styler, value, listen, multitouch } from 'popmotion'

const ImageViewerStyles = style('div')({
  height: '100%',
  width: '100%',
  backgroundColor: 'rgba(0, 0, 0, 0)',
  transition: 'background-color 100ms linear',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  position: 'fixed',
  zIndex: '1001'
})

const Image = style('img')({
  borderRadius: '100%',
  transition: 'border-radius 150ms linear',
  width: '500px',
  maxWidth: '100%'
})

function start (data) {
  // Using FLIP terminology: https://aerotwist.com/blog/flip-your-animations/
  let first = data.bounds
  let last = data.element.getBoundingClientRect()

  let scale = first.width / last.width
  let invert = (first.top - last.top) + ((last.height * scale) / 2) - (last.height / 2)

  let handleStyler = styler(data.element)

  // INVERT
  let handleScale = value({scale: scale}, handleStyler.set)
  let handleY = value(invert, handleStyler.set('y'))

  data.element.style.transformOrigin = 'center'
  data.element.style.borderRadius = '3px'

  // PLAY
  spring({
    from: handleScale.get(),
    to: 1,
    damping: 10,
    mass: 0.5
  }).start(handleScale)

  spring({
    from: handleY.get(),
    to: 0,
    damping: 10,
    mass: 0.5
  }).start(handleY)

  listen(data.element, 'touchstart')
    .filter(({touches}) => touches.length >= 2)
    .start((event) => {
      event.preventDefault()

      multitouch({scale: handleScale.get()})
        .pipe(({scale}) => scale)
        .start({
          update: (e) => { console.log(e); handleScale.set(e) },
          complete: () => {
            let scale = handleScale.get()
            if (scale >= 1) return

            spring({
              from: scale,
              to: 1,
              velocity: handleScale.getVelocity(),
              mass: 0.5
            }).start(handleScale)
          }})
    })

  listen(document, 'touchend')
    .start(() => {
      handleScale.stop()
    })
}

const ImageViewer = (props) => {
  return <ImageViewerStyles onclick={window.flamous.imageViewer.hideImageViewer} oncreate={(elem) => { elem.style.backgroundColor = '#212121' }}>
    <Image src={props.image} oncreate={(elem) => start({element: elem, bounds: props.bounds})} />
  </ImageViewerStyles>
}

export default ImageViewer

// export default () => '<p>Test</p>'
