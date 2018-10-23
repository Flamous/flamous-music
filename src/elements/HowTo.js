import { h } from 'hyperapp'
import picostyle from 'picostyle'
import Header from '../components/Header.js'
import Page from '../components/Page'
import UpdateBanner from '../components/UpdateBanner.js'
import { Link } from '@hyperapp/router'
import rightArrow from '../assets/blue_right.svg'

const style = picostyle(h)

const Wrapper = style('div')({
  margin: '0 auto',
  maxWidth: '40em',
  padding: '0',
  '& p.first': {
    fontSize: '1.3em',
    textAlign: 'center'
  },
  '> p': {
    margin: '1.3em 1.2em',
    fontSize: '1.1rem',
    lineHeight: '1.3em'
  },
  '@media (min-width: 1250px)': {
    '> p': {
      margin: '1.2em auto'
    }
  }
})

const About = (props) => (context) => {
  let {checkForUpdate, updateAvailable} = context
  return <Page {...props} key='about'>
    <Wrapper oncreate={checkForUpdate}>
      <Header title='How To' back={{text: 'Back', to: '/'}} />
      <p>
        All songs on flamous.io are copyright free. that mean you are free to do with them what you want (personal use and even commercial use). All without having to pay fees or having to give credit. It's that simple
      </p>

      <ol>
        <li>
          <p>
            <b>Find music you like</b>
          </p>
          <p>Go to the Artists age and check out some songs there.</p>
        </li>
        <li>
          <p>
            <b>Listen or use it</b>
          </p>
          <p>
            You can just listen to them here on flamous.io <b>OR</b>
          </p>
          <p>
            You can download the music to your computer, by clicking on the bottom bar (appears when you start playing something) and then click on "Download".
          </p>
        </li>
        <li>
          <p>
            <b>
            Share songs you like (coming soon)
            </b>
          </p>
          <p>
            Get the song link and send them to your friends. (Till this is possible, you can send a link to the artist which the ong is from).
          </p>
        </li>
      </ol>
    </Wrapper>
  </Page>
}

export default About
