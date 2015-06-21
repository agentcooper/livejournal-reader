/* @flow */

var React = require('react');

var Router = require('react-router');
var { Link } = Router;

var DocumentTitle = require('react-document-title');

var CommentsLink = require('./CommentsLink');

var LJ = require('./LJ');

var JournalEntry = React.createClass({
  render: function() {
    var entry = this.props.entry;

    return (
      <li className="b-entry">
        <span className="b-boop__header">
          <Link to={`/read/${entry.journal}/${entry.postId}`}>
            { entry.subject || '(no subject)' }
          </Link>
        </span>

        <div className="b-entry__body" dangerouslySetInnerHTML={{__html: entry.body}}></div>

        <p className="b-entry__tags">{ entry.props.tags }</p>

        <span className="b-boop__comments">
          <CommentsLink
            count={Number(entry.reply_count)}
            journal={entry.journal}
            postId={entry.postId} />
        </span>
      </li>
    );
  }
});

var Journal = React.createClass({
  getInitialState: function() {
    return {
      journal: {}
    }
  },

  componentDidMount: function() {
    var params = this.props.params;

    LJ.getJournal({
      journal: params.journal
    }, (err, journal) => {
      this.setState({ journal: journal })
    });
  },

  render: function ():React {
    var params = this.props.params;

    return (
      <DocumentTitle title={params.journal}>
        <ol className="b-feed">
          {
            this.state.journal.events && this.state.journal.events.map((entry) => {
              return <JournalEntry entry={entry} key={entry.postId} />
            })
          }
        </ol>
      </DocumentTitle>
    );
  }
});

module.exports = Journal;
