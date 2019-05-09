const state = {
  isOpen: false,
  event: null,
  items: []
}

const actions = {
  open (options) {
    let { items = [], event, details } = options
    if (items.length === 0) console.warn('[actionMenu]: No items provided')

    return {
      isOpen: true,
      items,
      event,
      details
    }
  },
  close: () => {
    return {
      isOpen: false,
      items: [],
      event: null,
      details: null
    }
  }
}

export default {
  state,
  actions
}
