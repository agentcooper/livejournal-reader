/* @flow */

var React = require('react');

var Router = require('react-router');
var { Route, DefaultRoute, RouteHandler, Link } = Router;

var LJ = require('./LJ');

var Journal = React.createClass({
  contextTypes: {
    router: React.PropTypes.func
  },

  getInitialState: function() {
    return {
      journal: {}
    }
  },

  componentDidMount: function() {
    var params = this.context.router.getCurrentParams();

    LJ.getJournal({
      journal: params.journal
    }, (err, journal) => {
      this.setState({ journal: journal })
    });
  },

  render: function ():React {
    return (
      <ol className="b-feed">
        {
          this.state.journal.events && this.state.journal.events.map((entry) => {
            return (
              <li className="b-entry">
                <span className="b-boop__header">
                  <Link to="post" params={
                    {
                      journal: entry.journal || '',
                      postId: entry.postId || ''
                    }
                    }>
                    { entry.subject || '(no subject)' }
                  </Link>
                </span>

                <div className="b-post_aside">
                  <img className="b-post__userpic" src="{entry.poster_userpic_url}" />
                  <span className="b-post__username">{entry.username}></span>
                </div>

                <div className="b-entry__body">{ entry.body }</div>

                <p className="b-entry__tags">{ entry.props.tags }</p>

                <span className="b-boop__comments">{ entry.reply_count }</span>
              </li>
            )
          })
        }
      </ol>
    );
  }
});

module.exports = Journal;
