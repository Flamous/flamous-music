/* eslint-env serviceworker */
/* global workbox */

self.importScripts('https://storage.googleapis.com/workbox-cdn/releases/4.0.0/workbox-sw.js')
workbox.precaching.precacheAndRoute([])

workbox.routing.registerRoute(
  new RegExp('https://cdn.polyfill.io/.*'),
  new workbox.strategies.StaleWhileRevalidate()
)
