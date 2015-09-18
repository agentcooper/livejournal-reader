import React from 'react';
import { Link, Navigation } from 'react-router';

import Auth from '../../lib/Auth';

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
