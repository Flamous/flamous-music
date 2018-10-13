import { h } from 'hyperapp'
import picostyle from 'picostyle'
import LazyImage from './LazyImage'
import PlayAllButton from './Button'

const style = picostyle(h)

const SongListStyle = style('div')({
  transition: 'opacity 70ms',
  ' ul': {
    listStyleType: 'none',
    padding: '0'
  },
  ' .song-list-item': {
    display: 'flex',
    padding: '0.6em 1em 0.6em 1.5em',
    alignItems: 'center'
  },
  ' .song-list-item *:not(img)': {
    margin: '0'
  }
})

const Thumbnail = style(LazyImage)({
  height: '3.3em',
  width: '3.3em',
  marginRight: '0.8em',
  transition: 'opacity 350ms 300ms',
  ':not([src])': {
    opacity: '0'
  }
})

const StyledListItem = style('li')({
  transition: 'background-color 100ms',
  '@media (pointer: fine)': {
    '&:hover': {
      backgroundColor: '#fafafa'
    }
  },
  '&:active': {
    backgroundColor: '#f0f0f0',
    transform: 'scale(0.95)',
    opacity: '0.7'
  }
})

const ListItem = (props) => {
  return <StyledListItem {...props} class='song-list-item'>
    <Thumbnail src={props.image} />
    <div>
      <p style={{fontWeight: 'bold'}}>{props.title}</p>
      <p>{props.sub}</p>
    </div>
  </StyledListItem>
}

const SongList = (props) => (context) => {
  return <SongListStyle>
    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
      <h3 style={{paddingLeft: '1.5em', fontWeight: 'bold'}}>Songs</h3>
      {/* <PlayAllButton title='Shuffle' /> */}
    </div>
    <ul>
      {
        props.songs.map((song, index) => {
          return <ListItem onclick={() => {
            window.Amplitude.getShuffle() && window.Amplitude.setShuffle(false)
            props.albumId ? window.Amplitude.playPlaylistSongAtIndex(index, props.albumId) : window.Amplitude.playSongAtIndex(index)
            context.actions.scrubBar.show()
          }} key={song.id} title={song.name} image={song.cover_art_url} sub={song.artist} />
        })
      }
    </ul>
  </SongListStyle>
}

export default SongList
