const state = {
  isOpen: false,
  event: null,
  items: []
}

const actions = {
  open (options) {
    return {
      isOpen: true,
      items: options.items,
      event: options.event
    }
  },
  close: () => {
    return {
      isOpen: false,
      items: [],
      event: null
    }
  }
}

export default {
  state,
  actions
}
