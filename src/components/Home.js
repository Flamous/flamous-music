import { h } from 'hyperapp'
import picostyle from 'picostyle'
import albums from '../albums.js'

const style = picostyle(h)

const Header = () => style('header')({
  fontSize: '2em',
  maxWidth: '1100px',
  margin: '1em',
  '@media (min-width: 1000px)': {
    fontSize: '3em'
  },
  '@media (min-width: 1250px)': {
    margin: '0 auto'
  },
  ' .sub': {
    fontSize: '0.6em',
    marginTop: '-2em'
  }
})(
  {},
  [
    <h1>Flamous</h1>,
    <p class='sub'>The best of Public Domain music.</p>
  ]
)

const Gallery = (props) => style('div')({
  width: '100%',
  padding: '1em',
  boxSizing: 'border-box',
  marginBottom: '6em'
})(
  {},
  <FlexWrapper>
    {props.data.map((item) => {
      return <Item image={item.albumCoverUrl} name={item.name} artist={item.artist} />
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
  {},
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

const Page = style('article')({
  height: '100%',
  width: '100%',
  overflowY: 'auto',
  color: '#212121'
})

const Home = () => {
  return (
    <Page>
      <Header />
      <Gallery data={albums} />
    </Page>
  )
}

export default Home
