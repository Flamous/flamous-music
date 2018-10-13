import { h } from 'hyperapp'
import picostyle from 'picostyle'
import Header from '../components/Header.js'
import Wrapper from '../components/Wrapper'
import Page from '../components/Page'

const style = picostyle(h)

const StyledSection = style('section')({
  padding: '0.1em 0px 1em 0px',
  borderBottom: '1px solid rgba(0, 0, 0, 0.14)'
})

const Section = StyledSection

const Question = style('p')({
  fontWeight: 'bold'
})

const SongSubmit = () => (context) => {
  return <Page key='about'>
    <Wrapper>
      <Header title='FAQ' back={{text: 'Back', to: '/'}} />

      <Section>
        <Question>What is the Public Domain?</Question>
        <p >
          <i>"Absolutely FREE! Music, text, and art! Copy all you want!"</i>
        </p>
        <p>
          If you saw an advertisement like this, you might wonder, “What’s the catch?” When it comes to the public domain, there is no catch. If a book, song, movie, or artwork is in the public domain, then it is not protected by intellectual property laws (copyright, trademark, or patent laws)—which means it’s free for you to use without permission.
        </p>
        <p>
          Read more here: <a href='https://fairuse.stanford.edu/overview/public-domain/welcome/' target='_blank' rel='noopener'>Welcome to the Public Domain</a>
        </p>
      </Section>

      <Section>
        <Question>Is music on Flamous free of copyright?</Question>
        <p >
        Yes. All songs and their associated album cover are completely free of any copyright restrictions. This is because the artists themselves explicitly chose to put their music in the Public Domain.
        </p>
      </Section>

      <Section>
        <Question>But hasn't SoundCloud also copyright free music?</Question>
        <p >
          No. A lot of people confuse Copyright with Creative Commons. With a Createive Commons license the original author still is the copyright owner, and allows you to use it under certain terms. Music in the Public Domain does not have a copyright owner.
        </p>
        <p>
          So when you see "No Copyright" on Soundcloud or other services, it most likely is just a standard Creative Commons license and has some restrictions on it (like the requirement to give attribution to the artist). What they mean with "No Copyright" is most often "Royalty free", which mean only that you don't have to pay them money.
        </p>
      </Section>

      <p style={{textAlign: 'center'}}>
        Have more questions? Write us an email<br />
        <a href='mailto:hello@flamous.io'>hello@flamous.io</a>
      </p>

    </Wrapper>
  </Page>
}

export default SongSubmit
