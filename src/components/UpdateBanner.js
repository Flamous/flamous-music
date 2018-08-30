import { h } from 'hyperapp'
import picostyle from 'picostyle'

const style = picostyle(h)

const UpdateBanner = () => style('div')({
  width: '100%',
  textAlign: 'center',
  position: 'absolute',
  top: '0',
  left: '0'
})(
  {},
  [
    'Update available - ',
    <Button onclick={window.flamous.update}>Refresh</Button>
  ]
)

const Button = style('span')({
  fontWeight: 'bold',
  color: '#007AFF'
})

export default UpdateBanner
