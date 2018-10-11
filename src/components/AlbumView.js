import { h } from 'hyperapp'
import picostyle from 'picostyle'
import Page from './Page'
import Header, { HeaderBold, HeaderImage } from './Header'
import { Route, Link } from '@hyperapp/router'
import kimikoSongs from '../songs/kimiko_ishizaka'
import SongList from './SongList'

const Album = (props) => {
  console.log(props.match.params)
  let title
  let songs
  switch (props.match.params.albumId) {
    case 'open_goldberg_variations':
      title = 'Goldberg Variations'
      songs = kimikoSongs.filter((song) => {
        return song.album === 'J​.​S. Bach: "Open" Goldberg Variations, BWV 988 (Piano)'
      })
  }
  return <div>
    <Header title={title} />
    <SongList songs={songs} />
  </div>
}

export default (props) => {
  console.log('PROPS: ', props)
  return <Page>
    <Route path={`/albums/:albumId`} render={(matchProps) => { return <Album {...matchProps} /> }} />
  </Page>
}
