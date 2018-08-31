/* eslint-env serviceworker */

self.importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.4.1/workbox-sw.js')
workbox.precaching.precacheAndRoute([])

self.addEventListener('message', messageEvent => {
  if (messageEvent.data === 'skipWaiting') return skipWaiting()
})
