/* @flow */

var React = require('react');

var Router = require('react-router');
var { Route, DefaultRoute, RouteHandler, Link } = Router;

var LJ = require('./LJ');

var FeedEntry = React.createClass({
  render: function() {
    var entry = this.props.entry;

    return (
      <li className="b-entry">
        <span className="b-boop__header">
          <Link to="post" params={
            { journal: entry.journal, postId: entry.postId }
          }>
            { entry.subject || '(No suject)' }
          </Link>
        </span>

        <div className="b-post_aside">
          <img className="b-post__userpic" src={ entry.poster_userpic_url } />
          <p className="b-post__username">{ entry.journal }</p>
          <p className="b-post__time">{ entry.logtime }</p>
        </div>

        <div className="b-entry__body" dangerouslySetInnerHTML={{__html: post.body}}></div>

        <Link to="post" className="b-boop__comments" params={
          { journal: entry.journal, postId: entry.postId }
        }>
          { entry.reply_count }
        </Link>
      </li>
    );
  }
});

var Feed = React.createClass({
  getInitialState: function() {
    return {
      skip: 0,
      posts: []
    }
  },

  loadMore: function() {
    LJ.getFeed({
      skip: this.state.skip,
      itemshow: 7
    }).then((feed) => {
      this.setState({
        posts: this.state.posts.concat(feed.entries)
      });
    });
  }, 

  componentDidMount: function() {
    this.loadMore();
  },

  more: function() {
    this.setState({
      skip: this.state.skip + this.state.posts.length
    }, () => {
      this.loadMore();
    });
  },

  render: function() {
    return (
      <ol className="b-feed">
        <h1 className="b-header">Френдлента</h1>

        <div className="b-feed_entries">
          {
            this.state.posts.map((entry) => {
              return <FeedEntry entry={entry} key={entry.postId} />
            })
          }
        </div>

        <button className="b-feed__loadMore" onClick={this.more}>More</button>
      </ol>
    );
  }
});

module.exports = Feed;
