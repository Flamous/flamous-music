/** @jsx h */
import { h } from 'hyperapp'
import styles from './Countdown.css'
import logo from '~/assets/logo/brand_invert.png'

export default () => {
  return <div class={styles['countdown']}>
    <div class={styles['inner-wrapper']}>
      <img src={logo} loading='eager' />
      <p>Listen to free, high-quality music</p>
      <div class={styles['divider']} />
      <div>
        <p>Flamous Music is about to launch. Check back on May 31st to listen to awesome free music.</p>
        <p>If you are in Vienna, <b>visit us at Schraubenfabrik</b>, 1020 Vienna, for the launch-event. There will be a talk, food and drinks 🥓. The event will be from 18:00 o'clock onwards, so check by!</p>
        <p><a href='https://goo.gl/maps/ht7Ddy53ePQyQyr69' target='_blank' rel='nofollow'>See it on a map</a></p>
      </div>

      <div style={{ margin: '3em auto', maxWidth: '32em', padding: '1em' }}>
        <p>
          <b>Get notified when we launch</b>
        </p>

        <div id='mc_embed_signup'>
          <form action='https://flamous.us19.list-manage.com/subscribe/post?u=2c3e676f85f7cce3cad163b48&amp;id=83387ae973' method='post' id='mc-embedded-subscribe-form' name='mc-embedded-subscribe-form' class='validate' target='_blank' novalidate>
            <div id='mc_embed_signup_scroll'>
              <div class='mc-field-group'>
                <label style={{ display: 'none' }} for='mce-NAME'>Name </label>
                <input type='text' placeholder='Name' value='' name='NAME' class='required' id='mce-NAME' style={{ width: '100%', display: 'inline-block', maxWidth: '350px', minWidth: '0px', height: '1.3rem', boxSizing: 'content-box', padding: '0.5rem 1rem', border: '1px solid rgba(0, 0, 0, 0.1)', backgroundColor: 'rgba(0, 0, 0, 0.02)', borderRadius: '.5rem', margin: '0.45em 0' }} />
              </div>
              <div class='mc-field-group' style={{ textAlign: 'center' }}>
                <label style={{ display: 'none' }} for='mce-EMAIL'>Email Address </label>
                <input type='email' placeholder='Email Address' value='' name='EMAIL' class='required email' id='mce-EMAIL' style={{ width: '100%', display: 'inline-block', maxWidth: '350px', minWidth: '0px', height: '1.3rem', boxSizing: 'content-box', padding: '0.5rem 1rem', border: '1px solid rgba(0, 0, 0, 0.1)', backgroundColor: 'rgba(0, 0, 0, 0.02)', borderRadius: '.5rem', margin: '0.45em 0' }} />
              </div>
              <div id='mce-responses' class='clear'>
                <div class='response' id='mce-error-response' style='display:none' />
                <div class='response' id='mce-success-response' style='display:none' />
              </div>
              <div style='position: absolute; left: -5000px;' aria-hidden='true'><input type='text' name='b_2c3e676f85f7cce3cad163b48_83387ae973' tabindex='-1' value='' /></div>
              <div class='clear'><input type='submit' style={{ backgroundColor: '#007AFF', border: 'none', borderRadius: '.5rem', color: 'white', padding: '0.6rem 1rem' }} value='Subscribe' name='subscribe' id='mc-embedded-subscribe' class='button' /></div>
            </div>
          </form>
        </div>
        <script onload={() => { import('~/mailchimp-validation.js') }} type='text/javascript' src='//s3.amazonaws.com/downloads.mailchimp.com/js/mc-validate.js' />
      </div>
    </div>
  </div>
}
