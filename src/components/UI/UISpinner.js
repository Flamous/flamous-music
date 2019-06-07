/** @jsx h */
import { h } from 'hyperapp'
import styles from './UISpinner.css'

let bars = []

for (let i = 0; i < 12; i++) {
  let barStyle = {}
  barStyle.WebkitAnimationDelay = barStyle.animationDelay =
      (i - 12) / 12 + 's'

  barStyle.WebkitTransform = barStyle.transform =
      'rotate(' + (i * 30) + 'deg) translate(125%)'

  bars.push(
    <div style={barStyle} className={styles['ui-spinner_bar']} key={i} />
  )
}

const UISpinner = (props) => {
  function makeVisible (element) {
    window.requestAnimationFrame(function frame () { window.requestAnimationFrame(function frame2 () { element.style.opacity = '1' }) })
  }
  function hide (element, done) {
    element.addEventListener('transitionend', function end () {
      done()
    })
    element.style.opacity = '0'
  }
  return (
    <div
      oncreate={makeVisible}
      onremove={hide}
      {...props}
      className={`${(props.className || '')} ${styles['ui-spinner']}`}
    >
      {bars}
    </div>
  )
}

export default UISpinner
