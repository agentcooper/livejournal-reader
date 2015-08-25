var React = require('react');

var Router = require('react-router');
var { Link } = Router;

import '../stylesheets/profile.css';

var request = require('superagent');

var LJ = require('./LJ');

var Auth = require('./Auth');

var Profile = React.createClass({
  getInitialState: function() {
    return {
      profile: null
    };
  },

  componentWillMount: function() {
    Auth.events.on('login', () => {
      this.getData();
    });

    if (Auth.isLoggedIn()) {
      this.getData();
    }
  },

  getData: function() {
    var that = this;

    Auth.getProfile().then((profile) => {
      if (!profile.username) {
        return console.error('Bad login', profile);
      }

      analytics.identify({ userId: profile.username });
      analytics.track({ userId: profile.username, event: 'Login' });

      that.setState({ profile: profile });
    });
  },

  login: function() {
    Auth.startLogin();
  },

  render: function() {
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
});

module.exports = Profile;
