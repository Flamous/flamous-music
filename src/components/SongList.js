/** @jsx h */
import { h } from 'hyperapp'
import picostyle from 'picostyle'
import LazyImage from './LazyImage'
import playImage from '../assets/play.svg'

const style = picostyle(h)

const SongListStyle = style('div')({
  transition: 'opacity 70ms',
  counterReset: 'numbers',
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
  },
  '& .song-list-wrapper': {
    maxWidth: '40rem',
    margin: '0 auto'
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

const StyledHoverPlayButton = style('div')({
  position: 'absolute',
  right: '1em',
  height: '100%',
  visibility: 'hidden',
  display: 'flex',
  alignItems: 'center',
  cursor: 'pointer'
})
const HoverPlayButton = (props) => {
  let { index, context } = props

  return <StyledHoverPlayButton class='hover-play-button' onclick={() => {
    window.Amplitude.getShuffle() && window.Amplitude.setShuffle(false)
    props.albumId ? window.Amplitude.playPlaylistSongAtIndex(index, props.albumId) : window.Amplitude.playPlaylistSongAtIndex(index, props.playlist)
    context.actions.scrubBar.show()
  }}>
    <div style={{ border: '1px solid black', borderRadius: '100%', padding: '0.25em' }}>
      <img height='36' src={playImage} style={{ display: 'block' }} />
    </div>
  </StyledHoverPlayButton>
}

const StyledListItem = style('li')({
  transition: 'background-color 100ms',
  position: 'relative',
  '@media (pointer: fine)': {
    '&:hover': {
      backgroundColor: '#fafafa'
    },
    '&:hover .hover-play-button': {
      visibility: 'visible'
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
      <p style={{ fontWeight: 'bold' }}>{props.title}</p>
      <p>{props.sub}</p>
    </div>
    <HoverPlayButton />
  </StyledListItem>
}
const ListNumber = style('div')({
  '&::before': {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    counterIncrement: 'numbers',
    content: 'counter(numbers)"."',
    height: '3.3em',
    fontWeight: 'bold',
    fontStyle: 'italic',
    width: '3.3em',
    marginRight: '0.8em',
    border: '2px solid #eee',
    borderRadius: '5px'
  }
})
const AlbumListItem = (props) => {
  return <StyledListItem {...props} class='song-list-item'>
    <ListNumber />
    <div>
      <p style={{ fontWeight: 'bold' }}>{props.title}</p>
      <p>{props.sub}</p>
    </div>
  </StyledListItem>
}

const SongList = (props) => (context) => {
  return <SongListStyle>
    <div class='song-list-wrapper'>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ paddingLeft: '1.5em', fontWeight: 'bold' }}>Songs</h3>
        {/* <PlayAllButton title='Shuffle' /> */}
      </div>
      <ul>
        {
          props.type !== 'album' && props.songs.map((song, index) => {
            return <ListItem onclick={() => {
              window.Amplitude.getShuffle() && window.Amplitude.setShuffle(false)
              props.albumId ? window.Amplitude.playPlaylistSongAtIndex(index, props.albumId) : window.Amplitude.playPlaylistSongAtIndex(index, props.playlist)
              context.actions.scrubBar.show()
            }} key={song.id} context={{ context }} index={index} title={song.name} image={song.cover_art_url} sub={song.artist} />
          })
        }
        {
          props.type === 'album' && props.songs.map((song, index) => {
            return <AlbumListItem onclick={() => {
              window.Amplitude.getShuffle() && window.Amplitude.setShuffle(false)
              props.albumId ? window.Amplitude.playPlaylistSongAtIndex(index, props.albumId) : window.Amplitude.playSongAtIndex(index)
              context.actions.scrubBar.show()
            }} key={song.id} title={song.name} image={song.cover_art_url} sub={song.artist} />
          })
        }
      </ul>
    </div>
  </SongListStyle>
}

export default SongList
