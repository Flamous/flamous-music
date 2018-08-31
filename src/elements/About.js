import { h } from 'hyperapp'
import picostyle from 'picostyle'
import Header from '../components/Header.js'
import Page from '../components/Page'
import UpdateBanner from '../components/UpdateBanner.js'
// import fmLogo from '../flamous_logo.svg'

const style = picostyle(h)
// const Logo = style('img')({
//   width: '100%',
//   display: 'block',
//   maxWidth: '128px',
//   margin: '3em auto -1.7em'
// })
const Wrapper = style('div')({
  margin: '0 auto',
  maxWidth: '40em',
  padding: '0',
  paddingBottom: '12em',
  ' p.first': {
    paddingTop: '1.2em'
  },
  '> p': {
    marginLeft: '1.7em',
    marginRight: '1.7em'
  },
  '@media (min-width: 1250px)': {
    'p': {
      margin: '1.2em auto'
    }
  }
})

const About = (props) =>
  <Page key='about' oncreate={window.flamous.checkForUpdate}>
    <Wrapper>
      <Header title='About Flamous' />
      <p class='first' style={{color: '#424242', fontStyle: 'italic'}}>
        Version: {`${process.env.npm_package_version}${process.env.STAGE === 'prod' ? '' : '-dev'} (${process.env.COMMIT_REF ? `build ${process.env.COMMIT_REF.substring(0, 6)}` : 'local build'})`}
        <br />
        {props.updateAvailable ? <UpdateBanner /> : <span>&#9989; Up-to-date</span>}
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
