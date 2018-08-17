import { h } from 'hyperapp'
import picostyle from 'picostyle'

const style = picostyle(h)

const FlexWrapper = style('div')({
  display: 'flex',
  flexWrap: 'wrap',
  maxWidth: '1250px',
  margin: '0 auto'
})

export default FlexWrapper
