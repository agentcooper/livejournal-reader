var React = require('react');

var Router = require('react-router');
var { Link } = Router;

var request = require('superagent');

var LJ = require('./LJ');

var Profile = React.createClass({
  getInitialState: function() {
    return {
      profile: null
    }
  },

  componentWillMount: function() {
    var that = this;

    if (LJ.getCookie('auth')) {
      this.getData();
    }

    window.onmessage = function(e) {
      console.log(e);

      if (e.data === 'login ok') {
        that.getData();
      }
    };
  },

  getData: function() {
    var that = this;

    request.get('/api/login').end((err, res) => {
      var profile = res.body;

      if (!profile.username) {
        return console.error('Bad login', profile);
      }

      that.setState({ profile: profile });
    });
  },

  isLoggedIn: function() {
    return Boolean(this.state.profile && this.state.profile.username);
  },

  login: function() {
    window.open('/auth/run', '/auth/run', 'width=670,height=575');
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
