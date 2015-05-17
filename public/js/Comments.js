/* @flow */

var React = require('react');

var Router = require('react-router');
var { Route, DefaultRoute, RouteHandler, Link } = Router;

var LJ = require('./LJ');

var request = require('superagent');

var classNames = require('classnames');

var Comment = require('./Comment');

var Comments = React.createClass({
  getInitialState: function() {
    return {
      journal: this.props.post.journal,
      postId: this.props.post.postId,
      page_size: 5,
      page: 1,
      hasMore: false,
      loading: false,

      comments: []
    }
  },

  level: {},

  process: function(comments:Array<Object>):void {
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

      comment.userpic = comment.userpic || LJ.USERPIC.DEFAULT;
    });
  },

  loadMore: function() {
    var that = this;

    this.setState({ loading: true });

    request.get('/api/comments/').query({
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

  componentDidMount: function() {
    this.loadMore();
  },

  more: function() {
    this.setState({ page: this.state.page + 1 }, () => {
      this.loadMore();
    });
  },

  render: function():React {
    return (
      <div className={classNames(
        'b-comments',
        'b-commentbox-hidden',
        {
          'b-comments-more': this.state.hasMore,
          'b-comments-loading': this.state.loading
        }
      )}>

        <p>
          <a href="javascript:void(0);" className="b-replybutton">Leave a comment</a>
          {" "}
          or
          {" "}
          <a href="#" className="b-share">share this post</a>
        </p>

        <ul className="b-thread">
        {
          this.state.comments.map((comment) => {
            return (
              <Comment comment={comment} key={comment.dtalkid}/>
            );
          })
        }
        </ul>

        <span className="b-comments__more" onClick={this.more}>Load more</span>

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
      </div>
    );
  }
});

module.exports = Comments;
