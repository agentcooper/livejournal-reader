/* @flow */

require('babel/polyfill');

import './stylesheets/mobile.css';
import './stylesheets/style.css';

var React = require('react');

var ReactRouter = require('react-router');
var BrowserHistory = require('react-router/lib/BrowserHistory');

var { Router, Route, Link, Navigation } = ReactRouter;

var Layout = require('./Components/Layout/Layout');
var Post = require('./Components/Post/Post');
var Journal = require('./Components/Journal/Journal');
var Feed = require('./Components/Feed/Feed');
var Update = require('./Components/Update/Update');
var Login = require('./Components/Login');
var Auth = require('./Components/Auth');

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
  <Router history={new BrowserHistory} onUpdate={onUpdate}>
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
