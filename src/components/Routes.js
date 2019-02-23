/** @jsx h */
import { h } from 'hyperapp'
import { Route } from '@hyperapp/router'

import UIViewRoute from './UI/UIViewRoute'
import UIView from './UI/UIView'

import Home from './Home.js'
import Library from './pages/Library'
import Profile from './pages/Profile'
import Login from './pages/Login'
import NewAlbum from './pages/NewAlbum'
import AlbumDetails from './pages/AlbumDetails'
import License from './pages/License'
import ChangePassword from './pages/ChangePassword'
import Player from './pages/Player'
import AlbumEditor from './pages/AlbumEditor'

let Routes = () => {
  return <span>
    <UIViewRoute path='/' exact render={Home} viewName='home' />
    {/* <UIViewRoute path='/albums' parent render={AlbumView} viewName='home' /> */}
    <UIViewRoute path='/library' render={Library} viewName='library' />
    <UIViewRoute path='/profile' render={Profile} viewName='profile' />
    <UIViewRoute path='/settings/change-password' render={ChangePassword} viewName='profile' exact />
    <UIViewRoute path='/albums/:albumId' exact render={AlbumDetails} viewName='profile' />

    <UIView displayView='home' />
    <UIView displayView='profile' />
    <UIView displayView='library' />

    <Route path='/login' render={Login} />
    <Route path='/signup' render={Login} />
    <Route path='/player' render={Player} />

    <Route path='/flamous-license' render={License} />
    <Route path='/create-album' render={NewAlbum} />
    <Route path='/album-editor' render={AlbumEditor} />
  </span>
}

export default Routes
