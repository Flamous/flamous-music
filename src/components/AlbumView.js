import { h } from 'hyperapp'
import picostyle from 'picostyle'
import Page from './Page'
import Header, { HeaderBold, HeaderImage } from './Header'
import { Route, Link } from '@hyperapp/router'
import kimikoSongs from '../songs/kimiko_ishizaka'
import SongList from './SongList'
import { nestable } from 'hyperapp-context'

const style = picostyle(h)

const Img = style('img')({
  width: '10rem',
  borderRadius: '2px 1px 1px 2px',
  borderRight: '2px solid rgba(0, 0, 0, 0.3)',
  boxShadow: 'rgba(0, 0, 0, 0.3) 0px 4px 25px 1px',
  transition: 'box-shadow 500ms'
})

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

  return <div>
    <Header title={title} defaultText='Album' back={{text: 'Back', to: props.location.previous}}>
      {/* <HeaderBold style={{textAlign: 'center'}}> */}
      <div style={{display: 'flex', margin: '1em'}}>
        <Img src={songs[0].cover_art_url} onclick={(event) => {
          let bounds = event.target.getBoundingClientRect()
          window.flamous.imageViewer.showImageViewer({image: songs[0].cover_art_url, bounds: bounds})
        }} />

        <div style={{marginLeft: '2em'}}>

          <h1>{title}</h1>
          <p style={{fontSize: '1rem', fontWeight: 'normal', margin: '0.5rem 0 0 -0.2rem'}}>by {songs[0].artist}</p>
        </div>
      </div>

      {/* </HeaderBold> */}
    </Header>
    <SongList type='album' albumId={albumId} songs={songs} />
  </div>
}

export default nestable({
  stuff: {
    name: null,
    content: null
  }
},
{
  stuff: {
    addContent: (prop) => (state) => {
      if (state.name) return

      return {
        content: prop.content,
        name: prop.name
      }
    }
  }
},
(state, actions) => (props, children) => {
  return <Page>
    {state.stuff.content && <state.stuff.content />}
    <Route path={`/albums/:albumId`} render={(matchProps) => {
      actions.stuff.addContent({content: () => { return <Album {...matchProps} /> }, name: 'Album'})
    }} />
  </Page>
})
