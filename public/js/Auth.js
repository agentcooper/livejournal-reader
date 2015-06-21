var EventEmitter = require('events').EventEmitter;

var request = require('superagent');

module.exports = {
  events: new EventEmitter(),

  getCookie: function(name) {
    var value = "; " + document.cookie;
    var parts = value.split("; " + name + "=");
    if (parts.length == 2) return parts.pop().split(";").shift();
  },

  isLoggedIn: function() {
    return Boolean(this.getCookie('auth'));
  },

  onLogin: null,

  getProfile: function() {
    return new Promise((resolve, reject) => {
      request.get('/api/login').end((err, res) => {
        var profile = res.body;

        if (!profile.username) {
          return reject(new Error('Bad login'));
        }

        resolve(profile);
      });
    });
  },

  startLogin: function(options) {
    options = options || {};

    this.onLogin = options.onLogin;

    window.open('/auth/run', '/auth/run', 'width=670,height=575');
  },

  init: function() {
    var that = this;

    window.onmessage = function(event) {
      if (event.data === 'login ok') {
        that.events.emit('login', { status: true });

        if (that.onLogin) {
          that.onLogin();
          that.onLogin = null;
        }
      }
    };
  }
}
