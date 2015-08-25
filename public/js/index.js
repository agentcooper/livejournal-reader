/* @flow */

require('babel/polyfill');

import '../stylesheets/mobile.css';
import '../stylesheets/style.css';

var React = require('react');

var ReactRouter = require('react-router');
var BrowserHistory = require('react-router/lib/BrowserHistory');

var { Router, Route, Link, Navigation } = ReactRouter;

var Layout = require('./Layout');
var Post = require('./Post');
var Journal = require('./Journal');
var Feed = require('./Feed');
var Update = require('./Update');
var Login = require('./Login');
var Auth = require('./Auth');

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
