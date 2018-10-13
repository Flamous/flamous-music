import { h } from 'hyperapp'
import picostyle from 'picostyle'
import Header from '../components/Header.js'
import Page from '../components/Page'
import Wrapper from '../components/Wrapper'
import { Link } from '@hyperapp/router'

const SongSubmit = () => (context) => {
  return <Page key='about'>
    <Header title='Song Submit' back={{text: 'Back', to: '/'}} />
    <Wrapper>
      
      <p>
        Here you can submit your songs to Flamous Music. Don't forget to check out the <Link to='/faq'>FAQ</Link>.
      </p>

      <span style={{backgroundColor: '#007AFF', borderRadius: '100px', display: 'inline-block'}}>
        <a
          style={{color: 'white', padding: '0.7em 1.2em', display: 'inline-block'}}
          href='https://docs.google.com/forms/d/e/1FAIpQLSdelZNDeZAB-VjMzNs-H7f4X0aFyyaQ61xEJ_2lijic725KLQ/viewform'
          target='_blank'
          rel='noopener'>
              Submit Songs
        </a>
      </span>
    </Wrapper>
  </Page>
}

export default SongSubmit
