import React from 'react';
import { Link } from 'react-router';

import './profile.css';

import request from 'superagent';

import LJ from '../../lib/LJ';

import Auth from '../../lib/Auth';

export default class extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.login = this.login.bind(this);

    this.state = {
      profile: null
    };
  }

  componentWillMount() {
    Auth.events.on('login', () => {
      this.getData();
    });

    if (Auth.isLoggedIn()) {
      this.getData();
    }
  }

  getData() {
    var that = this;

    Auth.getProfile().then((profile) => {
      if (!profile.username) {
        return console.error('Bad login', profile);
      }

      analytics.identify({ userId: profile.username });
      analytics.track({ userId: profile.username, event: 'Login' });

      that.setState({ profile: profile });
    });
  }

  login() {
    Auth.startLogin();
  }

  render() {
    var profile = this.state.profile;

    if (this.state.profile) {
      return (
        <div className="b-profile">
          <Link className="b-profile-link" to={`/read/${profile.username}`}>
            <span className="b-profile-userpic">
                <img src={profile.defaultpicurl} />
            </span>
            <span className="b-profile-username">
                { profile.username }
            </span>
          </Link>
        </div>
      );
    }

    return (
      <a href="javascript:void(0);" className="b-menu-login" onClick={this.login}>
        Login
      </a>
    );
  }
}
