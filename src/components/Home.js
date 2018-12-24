/** @jsx h */
import { h } from 'hyperapp'
import picostyle from 'picostyle'
import Page from './Page.js'
// import UIPage from './UI/UIPage'
import { Link } from '@hyperapp/router'
import flamousLogo from '../assets/flamous_logo.svg'
import christianImage from '../assets/Christian.jpg'
import timonImage from '../assets/Timon.jpg'
import twitterImage from '../assets/twitter.svg'
import Button from './Button'

const style = picostyle(h)

const StyledLogo = style('div')({
  display: 'flex',
  alignItems: 'center',
  maxWidth: '768px',
  margin: '0 auto',
  justifyContent: 'space-between'
})

const Logo = (props) => {
  return <div style={{ borderBottom: '1px solid rgba(0, 0, 0, 0.1)' }}>
    <StyledLogo>
      <div style={{ display: 'flex', alignItems: 'center', padding: '0.8em' }}>
        <img height='36' style={{ marginRight: '0.7em' }} src={flamousLogo} />
        <span style={{ fontSize: '1.2em', fontWeight: 'normal' }} >Flamous Music</span>

      </div>
    </StyledLogo>
  </div>
}

const StyledTagLine = style('div')({
  maxWidth: '768px',
  margin: '2em auto 3em',
  padding: '0 1em',
  display: 'flex',
  flexWrap: 'wrap'
})

const TagLine = () => (context) => {
  return <StyledTagLine>
    <div>
      <h1 style={{ fontSize: '2.8em', fontWeight: 'bold', maxWidth: '350px', lineHeight: '1.3' }}>
        Listen to<br />copyright free<br />music.
      </h1>
      <p style={{ maxWidth: '350px', fontSize: '1.2em', lineHeight: '1.35', margin: '-1.5em 0 1em' }}>Music without limitations. Share, mix, download and cover.</p>
    </div>
    <div style={{ alignSelf: 'flex-end', marginBottom: '-0.5em', display: 'flex', alignItems: 'center', width: '100%' }}>
      <Link to='/artists'>
        <Button big>
          Browse artists
        </Button>
      </Link>
    </div>

  </StyledTagLine>
}

const Header = style('header')({})

const Divider = () => {
  return <div style={{ height: '3em', backgroundColor: '#fafafa', borderTop: '1px solid rgba(0, 0, 0, 0.1)', borderBottom: '1px solid rgba(0, 0, 0, 0.08)', margin: '3.5em 0px' }} />
}

const StyledSection = style('section')({
  margin: '3em auto',
  maxWidth: '32em',
  padding: '1em'
})

const Section = (props, children) => {
  return <StyledSection {...props}>
    {children}
  </StyledSection>
}

const Footer = () => <Section>
  <footer>
    <p style={{ textAlign: 'center', lineHeight: '1.34' }}>
      <a href='mailto:hello@flamous.io'>hello@flamous.io</a><br />
      <a href='https://twitter.com/FlamousMusic' rel='noopener' target='_blank'>twitter.com/FlamousMusic</a>
    </p>

    {window.installPrompt && <p style={{ textAlign: 'center' }} onclick={() => window.installPrompt.prompt()}>
      Add to homescreen
    </p>}
  </footer>
</Section>
const staticFooter = <Footer />

const DevelopersSection = () => <Section>
  <h2>
  Developers
  </h2>
  <p style={{ display: 'flex', alignItems: 'center' }}>
    <img onclick={(event) => {
      let bounds = event.target.getBoundingClientRect()
      window.flamous.imageViewer.showImageViewer({ image: timonImage, bounds: bounds })
    }} style={{ width: '4em', borderRadius: '100%', marginRight: '1em', pointerEvents: 'auto' }} src={timonImage} />
    <div>
      <b>Timon Röhrbacher</b><br />
    Student
    </div>
    <a style={{ padding: '1em' }} target='_blank' rel='noopener' href={'https://twitter.com/TimonRooe'}>
      <img style={{ width: '2em' }} src={twitterImage} />
    </a>
  </p>
  <p style={{ display: 'flex', alignItems: 'center' }}>
    <img onclick={(event) => {
      let bounds = event.target.getBoundingClientRect()
      window.flamous.imageViewer.showImageViewer({ image: christianImage, bounds: bounds })
    }} style={{ width: '4em', borderRadius: '100%', marginRight: '1em', pointerEvents: 'auto' }} src={christianImage} />
    <div>
      <b>Christian Kaindl</b><br />
    Web Developer
    </div>
    <a style={{ padding: '1em' }} target='_blank' rel='noopener' href={'https://twitter.com/christiankaindl'}>
      <img style={{ width: '2em' }} src={twitterImage} />
    </a>
  </p>
</Section>

const SubmitSection = () => <Section>
  <h2>
  Submit your songs
  </h2>
  <p style={{ maxWidth: '32em', lineHeight: '1.3' }}>
  Public Domain enables creative opportunities for people who create amazing content and brings your music to a larger audience.
  </p>
  <Link to='/song-submit' style={{ display: 'flex' }}>
    <Button>
      <span>Submit Songs</span>
    </Button>
  </Link>
</Section>

const ExplainSection = () => <Section>
  <h2>
  Our music is<br />use-for-everything
  </h2>
  <p style={{ maxWidth: '32em', lineHeight: '1.3' }}>
  Music on flamous.io is in the Public Domain through Creative Commons Zero.
  </p>
  <p>
  Use it commercially, for a video or just for yourself. There are no fees and no credit to the artists required. Listen to what you like, download and use it.
  </p>
  <Link to='/artists'>
    <Button>
      <span>Browse Music</span>
    </Button>
  </Link>
  <Link to='/how-to' style={{ marginLeft: '0.4em' }}>
    <Button white>
      <span>I'm confused</span>
    </Button>
  </Link>
</Section>

const Home = (props) => (context) => {
  // if (props.match.url === '/' && context.initialLoad) window.flamous.setInitialLoad(false)
  return (
    <Page nonInteractive key='home'>
      <Header>
        <Logo />
        <TagLine />
      </Header>

      <Divider />
      <ExplainSection />
      <Divider />
      <SubmitSection />
      <Divider />
      <DevelopersSection />

      {staticFooter}
    </Page>
  )
}

export default Home
