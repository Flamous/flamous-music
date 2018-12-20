function registerServiceWorker () {
  if ('serviceWorker' in navigator) {
    // Use the window load event to keep the page load performant
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('../serviceWorker.js')
        .then(function (registration) { // Track updates to the Service Worker.
          if (!navigator.serviceWorker.controller) return

          // When the user asks to refresh the UI, we'll need to reload the window
          let refreshing
          navigator.serviceWorker.addEventListener('controllerchange', function (event) {
            if (refreshing) return
            refreshing = true
            window.location.reload()
          })

          function listenInstalledStateChange () {
            registration.installing.addEventListener('statechange', function (event) {
              if (event.target.state === 'installed') {
                // A new service worker is available, inform the user
                window.flamous.updateAvailable(registration)
              }
            })
          }
          if (registration.waiting) return window.flamous.updateAvailable(registration)

          if (registration.installing) return listenInstalledStateChange()

          registration.addEventListener('updatefound', listenInstalledStateChange)
        })
    })
  }
}

export default registerServiceWorker
