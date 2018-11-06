import { h } from 'hyperapp'
import picostyle from 'picostyle'
import playImage from '../public/play_white.svg'

const style = picostyle(h)

const ShuffleButtonStyle = style('span')({
  borderRadius: '10px',
  backgroundColor: '#007AFF',
  backgroundImage: 'linear-gradient(to top, rgb(0, 122, 255), rgb(59, 153, 255))',
  color: 'white',
  padding: '0.6em 1em',
  marginRight: '1em',
  fontWeight: 'bold',
  transition: 'opacity 70ms 70ms',
  border: '1px solid rgba(0, 0, 0, 0.1)',
  ':active': {
    backgroundColor: 'rgb(59, 153, 255)',
    backgroundImage: 'linear-gradient(to top, rgb(0, 122, 255), rgb(32, 139, 255))'
  }
})

const PlayAllButton = (props) => {
  return <ShuffleButtonStyle onclick={() => {
    !window.Amplitude.getShuffle() && window.Amplitude.setShuffle()
    window.Amplitude.next()
    window.Amplitude.play()
    window.flamous.scrubBar.show()
  }}>
    <img src={playImage} style={{paddingRight: '0.35em'}} />
    {props.title}
  </ShuffleButtonStyle>
}
// export default PlayAllButton

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
