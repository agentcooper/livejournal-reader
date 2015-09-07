var React = require('react');
var ReactRouter = require('react-router');

var DocumentTitle = require('react-document-title');

var showNewPostInSidebar = true;

import './layout.css';

var Rating  = require('../Rating/Rating');
var Profile = require('../Profile/Profile');

var { Link } = ReactRouter;

module.exports = React.createClass({
  getInitialState: function() {
    return {};
  },

  render: function() {
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
