import { h } from 'hyperapp'
import picostyle from 'picostyle'
import Header from '../components/Header.js'

const style = picostyle(h)

const Wrapper = style('div')({
  margin: '0 auto',
  maxWidth: '40em',
  padding: '2em',
  paddingBottom: '6em',
  textAlign: 'center',
  fontSize: '1.2em'
})
const About = () =>
  [
    <Header title='About Flamous' alignment='center' />,
    <Wrapper>
      <p>Contact: <a href='mailto:hello@flamous.io'>hello@flamous.io</a></p>
      <p>Free, public-domain music (CC0). Do whatever you want with it, it's free. Like, really. <a href='https://creativecommons.org/share-your-work/public-domain/' target='_blank'>CC0</a> means that there is no copyright owner (“No Rights Reserved”). The music is still credited to the original authors, but they do not own more copyrights than you do.</p>
      <p>Pubic Domain music is the gift of awesome musicians who care about the creative impact of their work. You do not need to give any credit to the authors.</p>
      <p>This is a project by <a href='https://www.christiankaindl.at/' target='_blank'>Christian Kaindl</a> and Timon Röhrbacher.</p>
    </Wrapper>
  ]

export default About
