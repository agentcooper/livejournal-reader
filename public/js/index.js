/* @flow */

require('babel/polyfill');

var React = require('react');
var Router = require('react-router');
var { Route, DefaultRoute, RouteHandler, Link } = Router;

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
            <RouteHandler/>
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
                    <Link to="update">New post</Link>
                  </li> : null
              }
              <li className="b-menu__item">
                <Link to="journal" params={{ journal: 'ljreader-app' }}>About</Link>
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

var routes = (
  <Route handler={App}>
    <DefaultRoute handler={Rating}/>
    <Route name="post" path="/read/:journal/:postId" handler={Post}/>
    <Route name="journal" path="/read/:journal" handler={Journal}/>
    <Route name="feed" path="/feed" handler={Feed}/>
    <Route name="update" path="/update/:postId?" handler={Update}/>
  </Route>
);

Router.run(routes, Router.HistoryLocation, function (Handler) {
  React.render(<Handler/>, document.body);
});
