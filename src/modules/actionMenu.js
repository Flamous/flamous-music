const state = {
  isOpen: false,
  event: null,
  items: []
}

const actions = {
  open (options) {
    let { items = [], event } = options
    if (items.length === 0) console.warn('actionMenu Module: No items provided')

    return {
      isOpen: true,
      items,
      event
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
