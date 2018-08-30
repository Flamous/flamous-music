import { h } from 'hyperapp'
import picostyle from 'picostyle'
import Header from '../components/Header.js'
import Page from '../components/Page'
import UpdateBanner from '../components/UpdateBanner.js'
import bgImage from '../assets/header-graphic.svg'
// import fmLogo from '../flamous_logo.svg'

const style = picostyle(h)
// const Logo = style('img')({
//   width: '100%',
//   display: 'block',
//   maxWidth: '128px',
//   margin: '3em auto -1.7em'
// })
const Wrapper = style('div')({
  margin: '0 2em',
  maxWidth: '1100px',
  padding: '0',
  paddingBottom: '12em',
  ' p': {
    maxWidth: '40em'
  },
  '@media (min-width: 1250px)': {
    margin: '4.4em auto 0em'
  }
})
const FancyImage = style('div')({
  height: '20em',
  backgroundImage: `url(${bgImage})`,
  backgroundSize: 'auto 100%',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat'
})

const About = () =>
  <Page key='about'>
    <FancyImage />
    <Header title='About Flamous' />
    <Wrapper>
      <p style={{color: '#424242', fontStyle: 'italic'}}>
        Version: {`${process.env.npm_package_version}${process.env.STAGE === 'prod' ? '' : '-dev'}`}
        <br />
        {window.flamous.isUpdateAvailable() ? <UpdateBanner /> : <span>&#9989; Up-to-date</span>}
      </p>
      <p>Write us: <a href='mailto:hello@flamous.io'>hello@flamous.io</a></p>
      <p>Free, public-domain music (CC0). Do whatever you want with it, it's free. Like, really. <a href='https://creativecommons.org/share-your-work/public-domain/' target='_blank'>CC0</a> means that there is no copyright owner (“No Rights Reserved”). The music is still credited to the original authors, but they do not own more copyrights than you do.</p>
      <p>Pubic Domain music is the gift of awesome musicians who care about the creative impact of their work. You do not need to give any credit to the authors.</p>
      <p>This is a project by <a href='https://www.christiankaindl.at/' target='_blank'>Christian Kaindl</a> and Timon Röhrbacher.</p>
      <p style={{textAlign: 'center', marginTop: '5em'}}>
        Make something awesome 🔥
      </p>
    </Wrapper>
  </Page>

export default About
