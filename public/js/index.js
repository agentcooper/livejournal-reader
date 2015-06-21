/* @flow */

require('babel/polyfill');

var React = require('react');

var ReactRouter = require('react-router');
var { Router, Route, Link } = ReactRouter;

var BrowserHistory = require('react-router/lib/BrowserHistory');

var DocumentTitle = require('react-document-title');

var Rating  = require('./Rating');
var Post    = require('./Post');
var Journal = require('./Journal');
var Feed    = require('./Feed');
var Update  = require('./Update');

var Profile = require('./Profile');

var showNewPostInSidebar = true;

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

React.render((
  <Router history={new BrowserHistory}>
    <Route path="/" component={App}>
      <Route path="read/:journal/:postId" component={Post}/>
      <Route path="read/:journal" component={Journal}/>
      <Route path="feed" component={Feed}/>
      <Route path="update" component={Update} />
      <Route path="update/:postId" component={Update} />
    </Route>
  </Router>
), document.body);
