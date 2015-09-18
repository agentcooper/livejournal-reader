import React from 'react';
import { Link } from 'react-router';

import DocumentTitle from 'react-document-title';

import './layout.css';

import Rating from '../Rating/Rating';
import Profile from '../Profile/Profile';

const showNewPostInSidebar = true;

export default class extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {};
  }

  render() {
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
};
