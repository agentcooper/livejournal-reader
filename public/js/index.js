/* @flow */

require('babel/polyfill');

var React = require('react');

var ReactRouter = require('react-router');
var { Router, Route, Link, Navigation } = ReactRouter;

var BrowserHistory = require('react-router/lib/BrowserHistory');

var DocumentTitle = require('react-document-title');

var Rating  = require('./Rating');
var Post    = require('./Post');
var Journal = require('./Journal');
var Feed    = require('./Feed');
var Update  = require('./Update');

var Profile = require('./Profile');

var Login = require('./Login');

var Auth = require('./Auth');

var showNewPostInSidebar = true;

Auth.init();

var App = React.createClass({
  getInitialState: function () {
    return {};
  },

  render: function () {
    return (
      <DocumentTitle title="Reader">
        <div>
          <div className="b-main">
            {this.props.children || <Rating/>}
          </div>

          <div className="b-sidebar" id="sidebar">

            <ul className="b-menu">
              <li className="b-menu__item">
                <Link to="/">Top</Link>
              </li>
              <li className="b-menu__item">
                <Link to="feed">Feed</Link>
              </li>
              {
                showNewPostInSidebar ?
                  <li className="b-menu__item">
                    <Link to={`/update/`}>New post</Link>
                  </li> : null
              }
              <li className="b-menu__item">
                <Link to={`/read/ljreader-app`}>About</Link>
              </li>

              <li className="b-menu__item b-menu-profile">
                <Profile />
              </li>
            </ul>

          </div>
        </div>
      </DocumentTitle>
    );
  }
});

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

React.render((
  <Router history={new BrowserHistory} onUpdate={onUpdate}>
    <Route path="/" component={App}>
      <Route path="login" component={Login}/>

      <Route path="read/:journal/:postId" component={Post}/>
      <Route path="read/:journal" component={Journal}/>

      <Route path="feed" component={Feed} onEnter={requireAuth}/>
      <Route path="update" component={Update} onEnter={requireAuth}/>
      <Route path="update/:postId" component={Update} onEnter={requireAuth}/>
    </Route>
  </Router>
), document.body);
