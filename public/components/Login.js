var React = require('react');

var ReactRouter = require('react-router');
var { Router, Route, Link, Navigation } = ReactRouter;

var Auth = require('./Auth');

module.exports = React.createClass({
  mixins: [ Navigation ],

  login: function() {
    Auth.startLogin({
      onLogin: () => {
        var { location } = this.props;

        if (location.state && location.state.nextPathname) {
          this.replaceWith(location.state.nextPathname);
        } else {
          this.replaceWith('/');
        }
      }
    });
  },

  render: function() {
    return (
      <div style={{ padding: '40px' }}>
        <button style={{ fontSize: '40px' }} onClick={this.login}>
          Login with your LiveJournal account
        </button>
      </div>
    );
  }
});
