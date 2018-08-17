// import { h, app } from 'hyperapp'
// import songList from './songs.js'
// import ScrubBar from './components/ScrubBar.js'

// console.log(songList)

// const state = {
//   pages: [ // High level state of pages
//   ],
//   music: {
//     history: [],
//     isPlaying: false,
//     shuffle: true,
//     playingContext: null,
//     songs: songList
//   }
// }

// const actions = {
//   addPage: () => ({pages}) => ({
//     pages: (pages.push({id: pages.length}), pages)
//   }),
//   removePage: () => ({pages}) => ({
//     pages: (pages.pop(), pages)
//   }),
//   music: {
//     play: (id) => (state) => {
//       console.log(state)
//       console.log(id)
//       switch (id) {
//         case undefined:
//           if (state.playingContext) {
//             console.log('would continue to play song')
//           }
//           if (!state.playingContext) {
//             console.log('would start shuffle play')
//           }
//           break

//         default:
//           console.log('default')
//       }
//     },
//     pause: () => ({playingContext}) => {
//       if (!playingContext) {
//         console.log('nothing to pause')
//         return
//       }

//       console.log('would pause now')
//     }
//   }
// }

// const Page = ({id: pageNumber, addPage, removePage}) =>
//   h('div', { class: 'page-container' }, [
//     h('h1', {}, pageNumber),
//     h('button', {onclick: addPage}, '+ Add Page'),
//     h('button', {onclick: removePage}, '- Remove Page')
//   ])

// // const view = ({pages}, {addPage, removePage, music: {play, pause}}) =>
// //   h('div', {}, [
// //     h('h1', {}, 'Lowest level'),
// //     h('button', {onclick: () => play()}, 'play'),
// //     h('button', {onclick: () => pause()}, 'pause'),
// //     h('button', {onclick: addPage}, '+ Add Page'),
// //     // console.log(state)
// //     pages.map(({id}) => (
// //       Page({id, addPage, removePage})
// //     ))
// //   ])

// const view =
//   <main>
//     <ScrubBar />
//     <p>This is some Bodytext</p>
//   </main>

// console.info(ScrubBar)
// app(state, actions, view, document.body)

import { h, app } from 'hyperapp'
import Amplitude from 'amplitudejs'
import picostyle from 'picostyle'
import ScrubBar from './components/ScrubBar.js'
import Home from './components/Home.js'
import songList from './songs.js'
import placeholder from './public/song_placeholder.svg'
import Page from './components/Page.js'
// import Gallery from './components/Gallery.js'
// import Header from './components/Header.js'

// const Page = import('./components/Page.js')

const style = picostyle(h)

const AppShell = style('div')({
  height: '100%',
  width: '100%',
  position: 'relative',
  overflow: 'hidden'
})

Amplitude.setDebug(true)
Amplitude.init({
  songs: songList,
  default_album_art: placeholder,
  callbacks: {
    song_change: () => {
      let meta = JSON.parse(JSON.stringify(Amplitude.getActiveSongMetadata())) // Deep copy so we don't modify the original object
      let image = new window.Image()

      if (meta.cover_art_url) {
        image.src = meta.cover_art_url

        if (!image.complete) {
          meta.cover_art_url = placeholder
          image.onload = () => {
            meta.cover_art_url = image.src
            flamous.updateMetaData(meta)
          }
        }
      }

      flamous.updateMetaData(meta)
    },
    before_play: () => {
      flamous.setPlayState(true)
    },
    before_pause: () => {
      flamous.setPlayState(false)
    }
  }
})

const flamous = app(
  {
    playingState: false,
    playingContext: {
      artist: songList[0].artist,
      name: songList[0].name,
      cover_art_url: songList[0].cover_art_url || Amplitude.getDefaultAlbumArt()
    },
    pages: []
  },
  {
    updateMetaData: (metaData) => {
      if ('mediaSession' in navigator) {
        navigator.mediaSession.metadata = new window.MediaMetadata({
          title: metaData.name,
          artist: metaData.artist,
          artwork: [{
            src: metaData.cover_art_url
          }]
        })
      }

      return {
        playingContext: {
          artist: metaData.artist,
          name: metaData.name,
          cover_art_url: metaData.cover_art_url || Amplitude.getDefaultAlbumArt()
        }
      }
    },
    addPage: (page) => (state) => {
      state.pages.push(page)
      // console.log(state)
      return {
        pages: state.pages
      }
    },
    killPage: () => (state) => {
      state.pages.pop()

      return {
        pages: state.pages
      }
    },
    setPlayState: (isPlaying) => {
      return {
        playingState: isPlaying
      }
    }
  },
  ({playingContext, playingState, pages}) =>
    <AppShell>
      <Home />
      { pages.map((item) => { return <Page>{item}</Page> }) }
      <ScrubBar
        playingState={playingState}
        playPause={playPause}
        nextSong={Amplitude.next}
        previousSong={Amplitude.prev}
        artist={playingContext.artist}
        name={playingContext.name}
        image={playingContext.cover_art_url} />
    </AppShell>,
  document.body
)

function playPause () {
  console.log(Amplitude.audio())
  if (!Amplitude.audio().paused) {
    console.info('paused')
    Amplitude.pause()
  } else {
    console.info('playing')
    Amplitude.play()
  }
}

if ('mediaSession' in navigator) {
  navigator.mediaSession.metadata = new window.MediaMetadata({
    title: songList[0].name,
    artist: songList[0].artist,
    artwork: [{
      src: songList[0].cover_art_url
    }]
  })

  navigator.mediaSession.setActionHandler('play', Amplitude.play)
  navigator.mediaSession.setActionHandler('pause', Amplitude.pause)
  navigator.mediaSession.setActionHandler('previoustrack', Amplitude.prev)
  navigator.mediaSession.setActionHandler('nexttrack', Amplitude.next)
}

// window.setTimeout(() => {
//   flamous.addPage()
// }, 3000);

window.flamous = flamous
