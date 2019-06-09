/* Originally inspired by John Doherty's long-press-event: https://github.com/john-doherty/long-press-event */

let timer = null
let touchDown = null

function cancelLongPress (event) {
  clearTimeout(timer)
}

function fireLongPressEvent (data) {
  this.dispatchEvent(new window.CustomEvent('long-press', { bubbles: true, cancelable: true, detail: data }))
  cancelLongPress()
}

// listen to mousedown event on any child element of the body
document.addEventListener('touchstart', function (event) {
  let el = event.target
  touchDown = true
  el.oncontextmenu = event => {
    event.preventDefault()
    return false
  }

  timer = setTimeout(() => {
    fireLongPressEvent.bind(el)({ initiator: 'touch' })
  }, 500)
})
document.oncontextmenu = function onContextMenu (event) {
  event.preventDefault()
  if (touchDown) return
  touchDown = false
  fireLongPressEvent.bind(event.target)({ pos: { x: event.clientX, y: event.clientY }, initiator: 'cursor' })
}

document.addEventListener('touchend', cancelLongPress)
document.addEventListener('touchcancel', cancelLongPress)
document.addEventListener('touchmove', cancelLongPress)
document.addEventListener('scroll', cancelLongPress)
document.addEventListener('wheel', cancelLongPress)
