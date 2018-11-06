/** @jsx h */
import { h } from 'hyperapp'

const LazyImage = (props) => {
  let { alt, class: className, src } = props
  return <img
    {...props}
    alt={alt}
    class={[`lazy`, className || ''].join(' ')}
    data-src={src}
  />
}

export default LazyImage
