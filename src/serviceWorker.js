/* eslint-env serviceworker */
/* global workbox */

self.importScripts('https://storage.googleapis.com/workbox-cdn/releases/4.0.0/workbox-sw.js')
workbox.precaching.precacheAndRoute([])
