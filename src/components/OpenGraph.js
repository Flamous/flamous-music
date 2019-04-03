import { setOGData } from '../modules/openGraph'

let View = (props) => (context) => {
  let { page } = context

  if (page.state.isActivePage) {
    setOGData({
      url: window.location,
      ...props
    })
  }
}

export default View
