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

const About = () => (context) => {
  let {checkForUpdate, updateAvailable} = context
  return <Page key='about'>
    <Wrapper oncreate={checkForUpdate}>
      <Header title='About' back={{text: 'Back', to: '/'}} />

      <p class='first'>"Flamous Music is a player for awesome, free music."</p>
      <p>
      On Flamous you can listen to the best of Public Domain music, which is completely free to use.
      </p>

      <p>
        We see Public Domain content as the future of creative art and think music should start moving towards this direction as other creative fields <a href='https://unsplash.com/' rel='noopener' target='_blank'>did already</a>. Share, mix, download or cover music you find on Flamous.
      </p>
      <p>
      Read more about the power of Public Domain: <br /><a href='https://creativecommons.org/share-your-work/public-domain/cc0/' rel='noopener' target='_blank'>https://creativecommons.org/share-your-work/public-domain/cc0/</a>
      </p>
      <p style={{borderTop: '1px solid #f0f0f0'}} />
      <p style={{color: '#636363', display: 'flex'}}>
        <span style={{minWidth: '7em', display: 'inline-block'}}>Version: </span>
        <span>
          {`${process.env.npm_package_version}${process.env.STAGE === 'prod' ? '' : '-dev'}`}
          <br />
          {`${process.env.COMMIT_REF ? `build ${process.env.COMMIT_REF.substring(0, 6)}` : '(local build)'}`}
          <br />
          {updateAvailable ? <UpdateBanner /> : <span>&#9989; Up-to-date</span>}
        </span>
      </p>
      <p style={{color: '#636363', display: 'flex'}}>
        <span style={{minWidth: '7em', display: 'inline-block'}}>Contact: </span>
        <span>
          <a href='mailto:hello@flamous.io'>hello@flamous.io</a>
        </span>
      </p>
      <p style={{color: '#636363', display: 'flex'}}>
        <span style={{minWidth: '7em', display: 'inline-block'}}>Developers: </span>
        <span>
          Timon Röhrbacher, Christian Kaindl
        </span>
      </p>
      <p style={{color: '#636363', display: 'flex'}}>
        <span style={{minWidth: '7em', display: 'inline-block'}}>License: </span>
        <span>
          Flamous Music is an open source project, licensed under MIT. <a href='https://github.com/christiankaindl/flamous-music' rel='noopener' target='_blank'>View Code</a>
        </span>
      </p>
    </Wrapper>
  </Page>
}

export default About
