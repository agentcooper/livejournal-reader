/* @flow */

import React from 'react';
import { Link } from 'react-router';

import './feed.css';

import DocumentTitle from 'react-document-title';

import CommentsLink from '../Comments/CommentsLink';

import LJ from '../../lib/LJ';

class FeedEntry extends React.Component {
  render() {
    var entry = this.props.entry;

    return (
      <li className="b-entry">
        <span className="b-boop__header">
          <Link to={`/read/${entry.journal}/${entry.postId}`}>
            { entry.subject || '(No suject)' }
          </Link>
        </span>

        <div className="b-post_aside">
          <img className="b-post__userpic" src={ entry.poster_userpic_url } />
          <p className="b-post__username">{ entry.journal }</p>
          <p className="b-post__time">{ entry.logtime }</p>
        </div>

        <div className="b-entry__body" dangerouslySetInnerHTML={{__html: entry.body}}></div>

        <CommentsLink
            count={Number(entry.reply_count)}
            journal={entry.journal}
            postId={entry.postId} />
      </li>
    );
  }
}

export default class extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.more = this.more.bind(this);

    this.state = {
      skip: 0,
      posts: []
    };
  }

  loadMore() {
    LJ.getFeed({
      skip: this.state.skip,
      itemshow: 7
    }).then((feed) => {
      this.setState({
        posts: this.state.posts.concat(feed.entries)
      });
    });
  }

  componentDidMount() {
    this.loadMore();
  }

  more() {
    this.setState({
      skip: this.state.skip + this.state.posts.length
    }, () => {
      this.loadMore();
    });
  }

  render() {
    return (
      <DocumentTitle title="Feed">
        <ol className="b-feed">
          <h1 className="b-header">Френдлента</h1>

          <div className="b-feed_entries">
            {
              this.state.posts.map((entry) => {
                return <FeedEntry entry={entry} key={entry.postId} />;
              })
            }
          </div>

          <button className="b-feed__loadMore" onClick={this.more}>More</button>
        </ol>
      </DocumentTitle>
    );
  }
}
