/* @flow */

require('babel/polyfill');

var React = require('react');
var Router = require('react-router');
var { Route, DefaultRoute, RouteHandler, Link } = Router;

var Rating  = require('./Rating');
var Post    = require('./Post');
var Journal = require('./Journal');
var Feed    = require('./Feed');

var Profile = require('./Profile');

var App = React.createClass({
  getInitialState: function () {
    return {};
  },

  render: function () {
    return (
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
            <li className="b-menu__item">
              <Link to="journal" params={{ journal: 'ljreader-app' }}>About</Link>
            </li>

            <li className="b-menu__item b-menu-profile">
              <Profile />
            </li>
          </ul>

        </div>
      </div>
    );
  }
});

var routes = (
  <Route handler={App}>
    <DefaultRoute handler={Rating}/>
    <Route name="post" path="/read/:journal/:postId" handler={Post}/>
    <Route name="journal" path="/read/:journal" handler={Journal}/>
    <Route name="feed" path="/feed" handler={Feed}/>
  </Route>
);

Router.run(routes, Router.HistoryLocation, function (Handler) {
  React.render(<Handler/>, document.body);
});
