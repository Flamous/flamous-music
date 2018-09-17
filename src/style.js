import picostyle from 'picostyle'
import postcssJs from 'postcss-js'
import autoprefixer from 'autoprefixer'
import { h } from 'hyperapp'

// Initialize Picostyle with the vDOM engine from Hyperapp
const picostyleHyperapp = picostyle(h)

// Specify what prefixer to use
const prefixer = postcssJs.sync([autoprefixer])

// `style` is a wrapper function for Picostyle that transforms the CSS object with Autoprefixer before passing it on
const style = (element) => {
  let createElement = picostyleHyperapp(element)
  return function prefixStyles (styles) {
    return function prefixedComponent (props, children) {
      while (typeof styles === 'function') {
        styles = styles(props)
      }

      // typeof styles === 'function' && styles(props)
      let transformedStyles = prefixer(styles)

      // Return prefixed element
      return createElement(transformedStyles)(props, children)
    }
  }
}

export default style
