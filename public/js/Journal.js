/* @flow */

var React = require('react');

var Router = require('react-router');
var { Route, DefaultRoute, RouteHandler, Link } = Router;

var LJ = require('./LJ');

var JournalEntry = React.createClass({
  render: function() {
    var entry = this.props.entry;

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

        <div className="b-entry__body">{ entry.body }</div>

        <p className="b-entry__tags">{ entry.props.tags }</p>

        <span className="b-boop__comments">{ entry.reply_count }</span>
      </li>
    );
  }
});

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
            return <JournalEntry entry={entry} key={entry.postId} />
          })
        }
      </ol>
    );
  }
});

module.exports = Journal;
