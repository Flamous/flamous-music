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
  textAlign: 'right'
})(
  {},
  [
    <Button onclick={window.flamous.update}>Update</Button>
  ]
)

const Button = style('span')({
  fontWeight: 'bold',
  color: 'white',
  backgroundColor: '#007AFF',
  display: 'inline-block',
  // margin: '1em 0',
  padding: '0.3em 0.7em',
  borderRadius: '5px',
  fontStyle: 'normal'
})

export default UpdateBanner
