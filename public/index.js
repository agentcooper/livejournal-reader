/* @flow */

require('babel/polyfill');

import './stylesheets/mobile.css';
import './stylesheets/style.css';

import React from 'react';
import { Router, Route, Link } from 'react-router';

import createBrowserHistory from 'history/lib/createBrowserHistory';

import Layout from './components/Layout/Layout';
import Post from './components/Post/Post';
import Journal from './components/Journal/Journal';
import Feed from './components/Feed/Feed';
import Update from './components/Update/Update';

import Login from './components/Login/Login';

import Auth from './lib/Auth';

function requireAuth(nextState, transition) {
  if (!Auth.isLoggedIn()) {
    transition.to('/login', null, {
      nextPathname: nextState.location.pathname
    });
  }
}

function onUpdate() {
  analytics.page();
}

Auth.init();

React.render((
  <Router history={createBrowserHistory()} onUpdate={onUpdate}>
    <Route path="/" component={Layout}>
      <Route path="login" component={Login}/>

      <Route path="read/:journal/:postId" component={Post}/>
      <Route path="read/:journal" component={Journal}/>

      <Route path="feed" component={Feed} onEnter={requireAuth}/>
      <Route path="update" component={Update} onEnter={requireAuth}/>
      <Route path="update/:postId" component={Update} onEnter={requireAuth}/>
    </Route>
  </Router>
), document.body.querySelector('#container'));
