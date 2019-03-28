/* Originally inspired by John Doherty's long-press-event: https://github.com/john-doherty/long-press-event */

let timer = null

function cancelLongPress (event) {
  clearTimeout(timer)
}

function fireLongPressEvent (event) {
  this.dispatchEvent(new window.CustomEvent('long-press', { bubbles: true, cancelable: true }))
  cancelLongPress()
}

// listen to mousedown event on any child element of the body
document.addEventListener('touchstart', function (event) {
  let el = event.target
  el.oncontextmenu = event => {
    event.preventDefault()
    return false
  }

  timer = setTimeout(fireLongPressEvent.bind(el), 500)
})

document.addEventListener('touchend', cancelLongPress)
document.addEventListener('touchcancel', cancelLongPress)
document.addEventListener('touchmove', cancelLongPress)
document.addEventListener('scroll', cancelLongPress)
document.addEventListener('wheel', cancelLongPress)
