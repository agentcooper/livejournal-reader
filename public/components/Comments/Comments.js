/* @flow */

import React from 'react';

import LJ from '../../lib/LJ';

import request from 'superagent';

import classNames from 'classnames';

import Comment from './Comment';

import CommentBox from './CommentBox';

import Share from '../Share/Share';

import textUtils from '../../lib/textUtils';

import './comments.css';

class CommentsLoader extends React.Component {
  render() {
    return (
      <div className="b-comments--loading">
        Loading comments
        <div className="spinner">
          <div className="rect1"></div>
          &nbsp;
          <div className="rect2"></div>
          &nbsp;
          <div className="rect3"></div>
          &nbsp;
          <div className="rect4"></div>
          &nbsp;
          <div className="rect5"></div>
        </div>
      </div>
    );
  }
}

var Comments = React.createClass({
  getInitialState: function() {
    return {
      replyingTo: '',

      poster: 'vasya',

      journal: this.props.post.journal,
      postId: this.props.post.postId,
      page_size: 5,
      page: 1,
      hasMore: false,
      loading: false,

      comments: []
    };
  },

  level: {},

  process: function(comments) {
    var that = this;

    comments.forEach(function(comment) {
      if (!comment.parentdtalkid) {
        comment.level = 0;
      } else {
        if (that.level[comment.parentdtalkid]) {
          comment.level = that.level[comment.parentdtalkid] + 1;
        } else {
          comment.level = 1;
        }
        
        that.level[comment.dtalkid] = comment.level;
      }

      // comment.body = App.Text.clean(comment.body);
      comment.isAuthor = comment.postername === that.state.journal;

      comment.isAnonymous = comment.posterid === 0;
      if (comment.isAnonymous) {
        comment.userpic = LJ.USERPIC.ANONYMOUS;
        comment.postername = 'Anonymous';
      }

      comment.body = textUtils.hightlightUrls(comment.body);
      comment.userpic = comment.userpic || LJ.USERPIC.DEFAULT;
    });
  },

  loadMore: function() {
    var that = this;

    this.setState({ loading: true });

    this.request = request.get('/api/comments/').query({
      user:      this.state.journal,
      post_id:   this.state.postId,
      page_size: this.state.page_size,
      page:      this.state.page
    }).end(function(err, res) {

      var comments = res.body.comments;

      that.process(comments);

      that.setState({
        loading: false,
        comments: that.state.comments.concat(comments),
        hasMore: that.state.page < res.body.pages
      });
    });
  },

  componentWillUnmount: function() {
    if (this.request) {
      this.request.abort();
    }
  },

  componentDidMount: function() {
    this.loadMore();
  },

  more: function() {
    this.setState({ page: this.state.page + 1 }, () => {
      this.loadMore();
    });
  },

  reply: function(comment) {
    this.setState({ replyingTo: comment.dtalkid });
  },

  submit: function(body) {
    console.log(this.state.replyingTo, body);

    var replyingTo = this.state.replyingTo;

    var comments = [{
      body: body,
      postername: this.state.poster,
      dtalkid: Math.floor(Math.random() * 100000),
      journal: this.state.journal,
      ditemid: this.state.postId,
      userpic: ''
    }];

    if (replyingTo !== 'new') {
      comments[0].parentdtalkid = replyingTo;
    }

    this.process(comments);

    var index = this.state.comments.findIndex((comment) => {
      return String(comment.dtalkid) === String(this.state.replyingTo);
    });

    this.state.comments.splice(index + 1, 0, comments[0]);

    this.setState({ comments: this.state.comments, replyingTo: '' });
  },

  newComment: function() {
    this.setState({ replyingTo: 'new' });
  },

  render: function() {
    const commentBox = this.state.replyingTo === 'new' ?
      <CommentBox onSubmit={this.submit}/> :
      null;

    return (
      <div className={classNames(
          'b-comments',
          {
            'b-commentbox-hidden': this.state.replyingTo === '',
            'b-comments-more': this.state.hasMore,
            'b-comments-loading': this.state.loading
          }
        )}>

        <p>
          <a href="javascript:void(0);" className="b-replybutton"
            onClick={this.newComment}>Leave a comment</a>
          {" "}
          or
          {" "}
          <Share journal={this.state.journal} postId={this.state.postId} />
        </p>

        <div>
          {commentBox}
        </div>

        <ul className="b-thread">
        {
          this.state.comments.map((comment) => {
            return (
              <Comment
                key={comment.dtalkid}
                comment={comment}
                commentBox={comment.dtalkid === this.state.replyingTo}
                onReply={this.reply}
                onSubmit={this.submit} />
            );
          })
        }
        </ul>

        <span className="b-comments__more" onClick={this.more}>Load more</span>

        <CommentsLoader />
      </div>
    );
  }
});

module.exports = Comments;
