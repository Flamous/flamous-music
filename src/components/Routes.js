/** @jsx h */
import { h } from 'hyperapp'
import { Route } from '@hyperapp/router'

import UIViewRoute from './UI/UIViewRoute'
import UIView from './UI/UIView'
import UIRoute from './UI/UIRoute'

import Home from './Home.js'
import Library from './pages/Library'
import Profile from './pages/Profile'
import Login from './pages/Login'
import NewAlbum from './pages/NewAlbum'
// import AlbumDetails from './pages/AlbumDetails'
import License from './pages/License'
import ChangePassword from './pages/ChangePassword'
import Player from './pages/Player'
import AlbumEditor from './pages/AlbumEditor'
import Album from './pages/Album'
import Artist from './pages/Artist'

let Routes = () => {
  return <span key='routes'>
    <UIViewRoute path='/' exact render={Home} viewName='home' />
    {/* <UIViewRoute path='/albums' parent render={AlbumView} viewName='home' /> */}
    <UIViewRoute path='/library' render={Library} viewName='library' />
    <UIViewRoute path='/profile' render={Profile} viewName='profile' />
    <UIViewRoute path='/settings/change-password' render={ChangePassword} viewName='profile' exact />
    {/* <UIViewRoute path='/albums/:albumId' exact render={AlbumDetails} viewName='profile' /> */}
    <UIViewRoute path='/albums/:albumId' exact render={Album} viewName='home' />
    <UIViewRoute path='/artists/:artistId' exact render={Artist} viewName='home' />

    <UIView displayView='home' />
    <UIView displayView='profile' />
    <UIView displayView='library' />

    <UIRoute renderMode='always' path='/player' render={Player} />
    <Route path='/login' render={Login} />
    <Route path='/signup' render={Login} />

    <Route path='/flamous-license' render={License} />
    <Route path='/create-album' render={NewAlbum} />
    <Route path='/album-editor/:albumId' render={AlbumEditor} />
  </span>
}

export default Routes
