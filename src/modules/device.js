export default {
  isStandalone: (window.matchMedia('(display-mode: standalone)').matches) || (window.navigator.standalone)
}
