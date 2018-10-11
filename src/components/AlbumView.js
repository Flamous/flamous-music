import { h } from 'hyperapp'
import picostyle from 'picostyle'
import Page from './Page'
import Header, { HeaderBold, HeaderImage } from './Header'
import { Route, Link } from '@hyperapp/router'

const Album = (props) => {
  return <Header title='So Awesome' />
}

export default (props) => {
  console.log('PROPS: ', props)
  return <Page>
    <Route path={`/albums/:albumId`} render={(matchProps) => { return <Album {...matchProps} /> }} />
  </Page>
}
