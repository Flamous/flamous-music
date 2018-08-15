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
// import picostyle from 'picostyle'
import ScrubBar from './components/ScrubBar.js'
import songList from './songs.js'

// const h = (name, attributes, children) => {
//   let vNode = hyper(name, attributes, children)

//   // // Force classes down the component chain
//   vNode.attributes.class = [vNode.attributes.class, attributes.class]
//     .filter(Boolean)
//     .join(' ')

//   return vNode
// }
import placeholder from './public/placeholder.jpg'
// placeholder.load()

Amplitude.setDebug(true)
Amplitude.init({
  songs: songList,
  default_album_art: placeholder,
  callbacks: {
    song_change: () => {
      let meta = Amplitude.getActiveSongMetadata()
      console.log(meta)
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
    }
  },
  {
    updateMetaData: (metaData) => {
      return {
        playingContext: {
          artist: metaData.artist,
          name: metaData.name,
          cover_art_url: metaData.cover_art_url || Amplitude.getDefaultAlbumArt()
        }
      }
    },
    setPlayState: (isPlaying) => {
      return {
        playingState: isPlaying
      }
    }
  },
  ({playingContext, playingState}) =>
    <ScrubBar
      playingState={playingState}
      playPause={playPause}
      nextSong={Amplitude.next}
      previousSong={Amplitude.prev}
      artist={playingContext.artist}
      name={playingContext.name}
      image={playingContext.cover_art_url} />,
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
