import { h } from 'hyperapp'
import picostyle from 'picostyle'
import { spring, value, styler, listen, pointer, transform } from 'popmotion'
import { nestable } from 'hyperapp-context'

import playImage from '../assets/play.svg'
import pauseImage from '../assets/pause.svg'
import prevImage from '../assets/prev.svg'
import nextImage from '../assets/next.svg'
import downArrow from '../assets/down.svg'
import downloadImage from '../assets/download.svg'

let {snap} = transform

const style = picostyle(h)

const oneDPointer = (initY) => pointer({x: 0, y: initY, preventDefault: false}).pipe(({y}) => y > 0 ? y : 0)

// function init (element) {
//   const THRESHOLD = 10 // Pixel
//   let handleStyler = styler(element)
//   let handleY = value(0, handleStyler.set('y'))
//   element.handleY = handleY

//   // Initial slide-in
//   spring({
//     from: document.body.clientHeight,
//     to: 0,
//     damping: 20,
//     mass: 0.5
//   }).start(handleY)

//   let sub
//   listen(element, 'mousedown touchstart')
//     .start((event) => {
//       sub = oneDPointer(0)
//         .start((y) => {
//           if (y >= THRESHOLD) {
//             sub.stop()
//             sub = oneDPointer(handleY.get())
//               .start(handleY)
//           }
//         })

//       let upSub = listen(document, 'mouseup touchend')
//         .start((event) => {
//           sub && sub.stop()
//           upSub.stop()

//           let velocity = handleY.getVelocity()
//           let pos = handleY.get()

//           let isGoingBack = Boolean(!snap([
//             0,
//             document.body.clientHeight / 2
//           ])(pos + velocity))

//           if (isGoingBack) {
//             let config = {
//               from: pos,
//               to: 0,
//               velocity: velocity,
//               mass: 0.5,
//               damping: 20
//             }

//             spring(config)
//               .start(handleY)
//           } else {
//             window.flamous.pages.back()
//           }
//         })
//     })
// }

// function exit (element, done) {
//   let handleY = element.handleY
//   let velocity = handleY.getVelocity()
//   let pos = handleY.get()
//   let height = document.body.clientHeight

//   handleY.subscribe((val) => {
//     if (val >= height) {
//       handleY.stop()
//       done()
//     }
//   })

//   let config = {
//     from: pos,
//     to: height,
//     velocity: velocity,
//     mass: 0.5
//   }
//   spring(config)
//     .start(handleY)
// }

const StreamViewStyles = style('div')({
  height: '100%',
  width: '100%',
  backgroundColor: 'white',
  zIndex: '2000',
  boxShadow: '0 0 10px 0 rgba(0, 0, 0, 0.2)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  position: 'relative',
  backgroundImage: `url(${downArrow})`,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center top',
  backgroundSize: '3em'
})

const OtherButton = style('span')({
  display: 'inline-block',
  height: '3em',
  width: '3em'
})
const PlayButton = style('span')({
  backgroundColor: '#fafafa',
  borderRadius: '100%',
  border: '1px solid #f0f0f0',
  display: 'inline-block',
  height: '4em',
  width: '4em',
  padding: '4px'
})

const Wrapper = style('div')({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  width: '100%',
  maxWidth: '400px',
  marginTop: '3em'
})
const Progress = style('progress')({
  WebkitAppearance: 'none',
  MozAppearance: 'none',
  appearance: 'none',
  width: '100%',
  height: '0.7em',
  borderRadius: '100px',
  border: '1px solid #e0e0e0',
  margin: '1em 0 1em',
  overflow: 'hidden',
  backgroundColor: '#f0f0f0'
})

function formatTime (seconds) {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  return [
    h,
    m > 9 ? m : (h ? '0' + m : m || '0'),
    s > 9 ? s : '0' + s
  ].filter(a => a).join(':')
}

const PlayingView = nestable({
  handleStyler: null,
  handleY: null,
  AXIS_LOCK_THRESHOLD: 15,
  isAxisLocked: false,
  makeInteractive: false,
  currentPointer: null,
  upListener: null
},
{
  makeInteractive: (element) => (state, actions) => {
    let {handleTouchStart} = actions
    let bodyHeight = window.innerHeight

    let handleStyler = styler(element)
    let handleY = value(bodyHeight, handleStyler.set('y'))

    // Initial slide-in
    spring({
      from: bodyHeight,
      to: 0,
      damping: 20,
      mass: 0.5
    }).start(handleY)

    listen(element, 'mousedown touchstart', { passive: true })
      .start(handleTouchStart)

    return {
      handleY: handleY
    }
  },
  handleTouchStart: (event) => (state, actions) => {
    let { handleTouchEnd } = actions
    let { handleY, AXIS_LOCK_THRESHOLD } = state
    let currentPointer

    currentPointer = oneDPointer(0)
      .start((y) => {
        if (Math.abs(y) <= AXIS_LOCK_THRESHOLD) return

        currentPointer.stop()
        currentPointer = oneDPointer(handleY.get())
          .start(handleY)
      })

    let upListener = listen(document, 'mouseup touchend', { passive: true })
      .start(handleTouchEnd)

    return {
      currentPointer: currentPointer,
      upListener: upListener
    }
  },
  handleTouchEnd: (event) => (state, actions) => {
    let { currentPointer, upListener } = state

    currentPointer.stop()
    upListener.stop()

    let { handleY } = state
    let bodyHeight = window.innerHeight
    let currentPosition = handleY.get()
    let currentVelocity = handleY.getVelocity()
    let snappy = snap([0, bodyHeight / 2])
    let getIsLeaving = (position) => {
      let snappedPosition = snappy(position)

      return snappedPosition || 0
    }
    let isLeaving = getIsLeaving(currentPosition + currentVelocity)

    if (isLeaving) {
      window.clickLock = true
      let location = window.flamous.getState().location
      let back = location.previous !== location.pathname ? location.previous : '/'

      // BUG: onremove events are not fired! That's why we finish the animation here and not in the onremove handler
      handleY.subscribe((val) => {
        if (val >= bodyHeight) {
          handleY.stop()
          back === '/' ? window.flamous.location.go('/') : window.flamous.pages.back()
          window.clickLock = false
        }
      })

      spring({
        from: currentPosition,
        to: bodyHeight,
        velocity: currentVelocity
      }).start(handleY)
    } else {
      spring({
        from: currentPosition,
        to: 0,
        damping: 20,
        mass: 0.5,
        velocity: currentVelocity
      }).pipe(val => { return val >= 0 ? val : 0 }).start(handleY)
    }
  }
},
(state, actions) => (props) => (context) => {
  let {playingContext, playbackTime, playingState} = context
  let { makeInteractive } = actions

  return <StreamViewStyles oncreate={makeInteractive}>
    <Wrapper>
      <div onclick={() => context.actions.pages.back()} style={{position: 'absolute', top: '0', height: '4em', width: '100%'}} />
      <img style={{width: '70%'}} src={playingContext.cover_art_url} />
      <span style={{marginTop: '2em', fontWeight: 'bold', fontSize: '1.2em'}}>{playingContext.name}</span>
      <span>
        {playingContext.artist}
      </span>
      <div style={{display: 'flex', width: '90%', alignItems: 'center'}}>
        <div style={{width: '4em'}}>
          {formatTime(Math.round(playbackTime))}
        </div>
        <Progress max={playingContext.duration || '300'} value={playbackTime}>{playbackTime}/{playingContext.duration}</Progress>
        <div style={{width: '4em', textAlign: 'right'}}>
          {formatTime(Math.round(playingContext.duration))}
        </div>
      </div>
      <div style={{display: 'flex', justifyContent: 'space-around', alignItems: 'center', width: '100%', padding: '0.5em 3em'}}>
        <OtherButton title='Previous Song' onclick={() => window.Amplitude.prev()}>
          <img style={{height: '100%'}} src={prevImage} />
        </OtherButton>
        <PlayButton title={`${playingState ? 'Pause' : 'Play'}`} onclick={context.actions.playPause}>
          { !playingState
            ? <img style={{height: '100%'}} src={playImage} />
            : <img style={{height: '100%'}} src={pauseImage} />
          }
        </PlayButton>
        <OtherButton title='Next Song' onclick={() => window.Amplitude.next()}>
          <img style={{height: '100%'}} src={nextImage} />
        </OtherButton>
      </div>
      <div style={{display: 'flex', justifyContent: 'space-around', alignItems: 'center', width: '100%', padding: '1em 3em 0.5em'}}>
        <OtherButton style={{width: '100%'}}>
          <a title='Download Song' style={{display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'black', padding: '0.6em'}} href={window.Amplitude.audio().src} download={`${playingContext.name} - ${playingContext.artist} | Flamous Music.mp3`}>
            <img style={{height: '1.6em', marginRight: '0.5em'}} src={downloadImage} />
            <span>Download</span>
          </a>
        </OtherButton>
      </div>
    </Wrapper>
  </StreamViewStyles>
}, 'playing-view')

// const StreamView = (props) => (context) => {
//   let {playingContext, playbackTime, playingState, actions} = context
//   return <StreamViewStyles key='stream-view' oncreate={init} onremove={exit}>
//     <Wrapper>
//       <div onclick={() => context.actions.pages.back()} style={{position: 'absolute', top: '0', height: '4em', width: '100%'}} />
//       <img style={{width: '70%'}} src={playingContext.cover_art_url} />
//       <span style={{marginTop: '2em', fontWeight: 'bold', fontSize: '1.2em'}}>{playingContext.name}</span>
//       <span>
//         {playingContext.artist}
//       </span>
//       <div style={{display: 'flex', width: '90%', alignItems: 'center'}}>
//         <div style={{width: '4em'}}>
//           {formatTime(Math.round(playbackTime))}
//         </div>
//         <Progress max={playingContext.duration || '300'} value={playbackTime}>{playbackTime}/{playingContext.duration}</Progress>
//         <div style={{width: '4em', textAlign: 'right'}}>
//           {formatTime(Math.round(playingContext.duration))}
//         </div>
//       </div>
//       <div style={{display: 'flex', justifyContent: 'space-around', alignItems: 'center', width: '100%', padding: '0.5em 3em'}}>
//         <OtherButton title='Previous Song' onclick={() => window.Amplitude.prev()}>
//           <img style={{height: '100%'}} src={prevImage} />
//         </OtherButton>
//         <PlayButton title={`${playingState ? 'Pause' : 'Play'}`} onclick={actions.playPause}>
//           { !playingState
//             ? <img style={{height: '100%'}} src={playImage} />
//             : <img style={{height: '100%'}} src={pauseImage} />
//           }
//         </PlayButton>
//         <OtherButton title='Next Song' onclick={() => window.Amplitude.next()}>
//           <img style={{height: '100%'}} src={nextImage} />
//         </OtherButton>
//       </div>
//       <div style={{display: 'flex', justifyContent: 'space-around', alignItems: 'center', width: '100%', padding: '1em 3em 0.5em'}}>
//         <OtherButton style={{width: '100%'}}>
//           <a title='Download Song' style={{display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'black', padding: '0.6em'}} href={window.Amplitude.audio().src} download={`${playingContext.name} - ${playingContext.artist} | Flamous Music.mp3`}>
//             <img style={{height: '1.6em', marginRight: '0.5em'}} src={downloadImage} />
//             <span>Download</span>
//           </a>
//         </OtherButton>
//       </div>
//     </Wrapper>
//   </StreamViewStyles>
// }

export default PlayingView
