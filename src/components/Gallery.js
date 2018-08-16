import { h } from 'hyperapp'
import picostyle from 'picostyle'
import flamous from '../index.js'

const style = picostyle(h)

console.log('hadsf')
const Gallery = (props) => style('div')({
  width: '100%',
  padding: '1em',
  boxSizing: 'border-box',
  marginBottom: '6em'
})(
  {},
  <FlexWrapper>
    {props.data.map((item) => {
      return <Item image={item.albumCoverUrl} name={item.name} artist={item.artist} onclick={() => { console.log('WHOA'); flamous.addPage() }} />
    })}
  </FlexWrapper>
)

const FlexWrapper = style('div')({
  display: 'flex',
  flexWrap: 'wrap',
  maxWidth: '1250px',
  margin: '0 auto'
})

const Item = (props) => style('div')({
  color: '#212121',
  textAlign: 'center',
  fontWeight: 'bold',
  fontSize: '1.3em',
  padding: '1em',
  width: '50%',
  minWidth: '150px',
  // maxWidth: '250px',
  '@media (min-width: 1000px)': {
    width: '250px',
    maxWidth: '33%'
  },
  position: 'relative',
  flexGrow: '1',
  boxSizing: 'border-box',
  ' .secondary': {
    marginTop: '-1em',
    color: '#848484'
  }
})(
  props,
  [
    <Cover src={props.image} />,
    <p>{props.name}</p>,
    <p class='secondary'>by {props.artist}</p>
  ]
)

const Cover = (props) => style('img')({
  width: '100%'
})({
  src: props.src
})

export default Gallery
