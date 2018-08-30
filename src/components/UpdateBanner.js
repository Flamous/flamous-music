import { h } from 'hyperapp'
import picostyle from 'picostyle'

const style = picostyle(h)

const UpdateBanner = () => style('div')({
  // width: '100%',
  // color: 'lightgreen',
  // textShadow: '1px solid #848484',
  // textAlign: 'center',
  // position: 'absolute',
  // top: '0',
  // left: '0'
})(
  {},
  [
    <span>&#11014; Update available</span>,
    <br />,
    <Button onclick={window.flamous.update}>Update</Button>,
    ' (Interrupts any playing music)'
  ]
)

const Button = style('span')({
  fontWeight: 'bold',
  color: 'white',
  backgroundColor: '007AFF',
  display: 'inline-block',
  margin: '1em 0',
  padding: '0.5em 1em',
  borderRadius: '5px',
  fontStyle: 'normal'
})

export default UpdateBanner
