/** @jsx h */
import { h } from 'hyperapp'
import UIHeader from '../UI/UIHeader'
import UIPage from '../UI/UIPage'
import UIBackButton from '../UI/UIBackButton'

const License = (props) => {
  return <UIPage>
    <UIHeader title='Flamous License' nav={{ start: <UIBackButton /> }} />
    <main style={{ maxWidth: '40rem', margin: '0 auto', padding: '2em 1em' }}>
      <p>
        All music published on flamous.io can be used for free. You can use them for commercial and noncommercial purposes. You do not need to ask permission from or provide credit to the musicians or Flamous Music, although it is appreciated when possible.
      </p>
      <p>
        More precisely, Flamous Music grants you an irrevocable, nonexclusive, worldwide copyright license to download, copy, modify, distribute, perform, and use music from Flamous Music for free, including for commercial purposes, without permission from or attributing the musician or Flamous Music. This license does not include the right to compile music from Flamous to replicate a similar or competing service.
      </p>
    </main>

  </UIPage>
}

export default License
