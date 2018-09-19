import { h } from 'hyperapp'
import style from '../style'
import { spring, styler, value } from 'popmotion'

const ImageViewerStyles = style('div')({
  height: '100%',
  width: '100%',
  backgroundColor: 'rgba(0, 0, 0, 0)',
  transition: 'background-color 200ms',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  position: 'fixed',
  zIndex: '1001'
})

const Image = style('img')({
  borderRadius: '100%',
  transition: 'border-radius 350ms'
})

function start (data) {
  // Using FLIP terminology: https://aerotwist.com/blog/flip-your-animations/
  let first = data.bounds
  let last = data.element.getBoundingClientRect()

  // console.log('first top: ', first.top, 'last top: ', last.top)
  let invert = first.top - last.top
  let scale = first.width / last.width
  // console.log('first: ', first, 'last: ', last)

  let handleStyler = styler(data.element)

  let handleScale = value(scale, handleStyler.set('scale'))
  let handleY = value(invert, handleStyler.set('y'))

  data.element.style.transformOrigin = 'top'
  // data.element.style.border = '1px solid rgba(0, 0, 0, 0.14);'
  data.element.style.borderRadius = '0px'
  data.element.style.transform = `translateY(${invert}px) scale(${scale})`

  spring({
    from: handleScale.get(),
    to: 1,
    damping: 15
  }).start(handleScale)

  spring({
    from: handleY.get(),
    to: 0,
    damping: 15
  }).start(handleY)
}

const ImageViewer = (props) => {
  return <ImageViewerStyles onclick={window.flamous.imageViewer.hideImageViewer} oncreate={(elem) => { elem.style.backgroundColor = '#212121' }}>
    <Image src={props.image} oncreate={(elem) => start({element: elem, bounds: props.bounds})} />
  </ImageViewerStyles>
}

export default ImageViewer

// export default () => '<p>Test</p>'
