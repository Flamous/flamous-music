import { h } from 'hyperapp'
import picostyle from 'picostyle'

const style = picostyle(h)

const Wrapper = style('div')({
  margin: '0 auto',
  maxWidth: '40em',
  padding: '1.4rem'
})

export default Wrapper
