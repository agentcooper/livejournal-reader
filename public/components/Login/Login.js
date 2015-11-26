import React from 'react';
import { Link, History } from 'react-router';

import { createHistory, useBasename } from 'history';

import Auth from '../../lib/Auth';

module.exports = React.createClass({
  mixins: [ History ],

  login: function() {
    Auth.startLogin({
      onLogin: () => {
        var { location } = this.props;

        if (location.state && location.state.nextPathname) {
          this.history.replaceState(null, location.state.nextPathname);
        } else {
          this.history.replaceState(null, '/');
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
