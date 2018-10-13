import { h } from 'hyperapp'
import picostyle from 'picostyle'
import Page from './Page'
import Header, { HeaderBold, HeaderImage } from './Header'
import { Route, Link } from '@hyperapp/router'
import kimikoSongs from '../songs/kimiko_ishizaka'
import SongList from './SongList'

const Album = (props) => {
  let title
  let songs
  let albumId = props.match.params.albumId
  switch (albumId) {
    case 'open_goldberg_variations':
      title = 'Goldberg Variations'
      songs = kimikoSongs.filter((song) => {
        return song.album === 'J​.​S. Bach: "Open" Goldberg Variations, BWV 988 (Piano)'
      })
      break
    case 'the_art_of_the_fugue':
      title = 'The Art of the Fugue'
      songs = kimikoSongs.filter((song) => {
        return song.album === 'The Art of the Fugue'
      })
      break
  }
  console.log('SONGS', songs)
  return <div>
    <Header title={title} back={{text: 'Back', to: '/'}}>
      <HeaderBold style={{textAlign: 'center'}}>
        <HeaderImage square onclick={(event) => {
          let bounds = event.target.getBoundingClientRect()
          window.flamous.imageViewer.showImageViewer({image: songs[0].cover_art_url, bounds: bounds})
        }} src={songs[0].cover_art_url} />
        <p style={{fontSize: '1rem', fontWeight: 'normal', margin: '0.5rem 0 0 -0.2rem', textTransform: 'uppercase'}}>ALBUM</p>
        {title}
      </HeaderBold>
    </Header>
    <SongList type='album' albumId={albumId} songs={songs} />
  </div>
}

export default (props) => {
  return <Page>
    <Route path={`/albums/:albumId`} render={(matchProps) => { return <Album {...matchProps} /> }} />
  </Page>
}
