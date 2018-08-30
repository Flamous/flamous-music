/* eslint-env serviceworker */

self.importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.4.1/workbox-sw.js')

if (workbox) {
  console.log('yay!')
} else {
  console.log('nay :(')
}
workbox.precaching.precacheAndRoute([])
// self.addEventListener('install', (e) => {

// })

self.addEventListener('message', messageEvent => {
  if (messageEvent.data === 'skipWaiting') return skipWaiting()
})
