var React = require('react');

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

    request.get('/api/login').end((err, profile) => {
      console.log(arguments);

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
    // if (params && params.done) {
    //   if (App.profile.isLoggedIn()) {
    //     return params.done();
    //   }

    //   App.profile.set('doneCallback', params.done);
    // }

    window.open('/auth/run', '/auth/run', 'width=670,height=575');
  },

  render: function() {
    if (this.state.profile) {
      return (
        <div className="b-profile">
          <a href="bla" className="b-profile-link">
            <span className="b-profile-userpic">
                <img src={profile.defaultpicurl} />
            </span>
            <span className="b-profile-username">
                { profile.username }
            </span>
          </a>
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
