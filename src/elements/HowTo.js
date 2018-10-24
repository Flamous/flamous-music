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
  maxWidth: '40rem',
  padding: '0',
  '& h2': {
    marginBottom: '-0.6rem'
  },
  '& p.first': {
    fontSize: '1.3em',
    textAlign: 'center'
  },
  '> p': {
    margin: '1.3em 1em',
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
    <Header title='How To' back={{text: 'Back', to: '/'}} />
    <Wrapper oncreate={checkForUpdate}>

      <p>
        All songs on flamous.io are copyright free. That mean you are free to do with them what you want (personal use and even commercial use). All without having to pay fees or having to give credit. It's that simple.
      </p>

      <ol>
        <li>
          <h2>Find music you like</h2>
          <p>Click on an artist on the home page and check out some songs there.</p>
        </li>

        <li>
          <h2>Listen or use it</h2>
          <p>
            You can just listen to them here on flamous.io <b>OR</b>
          </p>
          <p>
            You can download the music to your computer, by clicking on the bottom bar (appears when you start playing something) and then click on "Download".
          </p>
        </li>

        <li>
          <h2>
            Share songs you like (coming soon)
          </h2>
          <p>
            Get the song link and send them to your friends. (Till this is possible, you can send a link to the artist which the song is from).
          </p>
        </li>
      </ol>

      <p>
        Read ore about how songs are copyright free on Flamous in this article by the Stanford University: <a href='https://fairuse.stanford.edu/overview/public-domain/' target='_blank' rel='noopener'>Public Domain</a>
      </p>
    </Wrapper>
  </Page>
}

export default About
