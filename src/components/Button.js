import { h } from 'hyperapp'
import picostyle from 'picostyle'

const style = picostyle(h)

const StyledButton = style('span')((props) => ({
  padding: '0em 1em',
  borderRadius: '11px',
  border: props.white ? '1px solid rgba(0, 0, 0, 0.6)' : '1px solid rgb(0, 105, 221)',
  display: 'inline-flex',
  minHeight: '2.1em',
  alignItems: 'center',
  fontSize: props.big ? '1.2em' : '1em',
  color: props.white ? 'black' : 'white',
  backgroundColor: props.white ? 'white' : '#007aff'
}))

const Button = StyledButton

export default Button
