/* @flow */

var React = require('react');

var Router = require('react-router');
var { Link } = Router;

var DocumentTitle = require('react-document-title');

var CommentsLink = require('./CommentsLink');

var LJ = require('./LJ');

var ERROR_STRING = {
  '206': 'Journal does not exist'
};

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
      journal: {},
      err: null
    };
  },

  componentDidMount: function() {
    var params = this.props.params;

    LJ.getJournal({
      journal: params.journal
    }, (err, journal) => {
      if (err) {
        this.setState({ err: err });
        return;
      }

      this.setState({ err: null, journal: journal });
    });
  },

  render: function() {
    var params = this.props.params,
        content = null;

    if (this.state.err) {
      content = (
        <div>
          <h2>Error</h2>
          <p>{
            ERROR_STRING[this.state.err.code] ||
            ('Something went wrong: ' + JSON.stringify(this.state.err, null, 2) )}
          </p>
        </div>
      );
    } else {
      content = this.state.journal.events && this.state.journal.events.map((entry) => {
        return <JournalEntry entry={entry} key={entry.postId}/>;
      });
    }

    return (
      <DocumentTitle title={params.journal}>
        <ol className="b-feed">
          {content}
        </ol>
      </DocumentTitle>
    );
  }
});

module.exports = Journal;
