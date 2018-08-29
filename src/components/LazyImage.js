import { h } from 'hyperapp'

const LazyImage = ({alt, src, class: className}) =>
  <img
    alt={alt}
    class={[`lazy`, className || ''].join(' ')}
    data-src={src}
  />

export default LazyImage
