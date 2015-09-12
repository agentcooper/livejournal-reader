var React = require('react');

var Router = require('react-router');
var { Link } = Router;

var classNames = require('classnames');

var CommentBox = require('./CommentBox');

class Comment extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {};
  }

  reply(event) {
    event.preventDefault();
  }

  render() {
    var comment = this.props.comment;

    var isDeleted = comment.state === 'D';

    var commentBox = null;

    if (this.props.commentBox) {
      commentBox = <CommentBox onSubmit={this.props.onSubmit}/>;
    }

    var journal = comment.identity_display || comment.postername;
    var body = comment.body;

    if (isDeleted) {
      journal = 'deleted';
      body = 'deleted comment';
    }

    return (
      <li className={classNames(
        'b-comment',
        'b-comment-level-' + (comment.level > 15 ? 'over-15' : comment.level),
        {
          'b-comment--anonymous': comment.isAnonymous,
          'b-comment--deleted': isDeleted
        }
      )} id={ 'c' + comment.dtalkid }>
        <div className={classNames(
          'b-thread__comment',
          { 'b-thread__comment_author': comment.isAuthor }
        )}>
          <div className="b-thread__userpic" style={
            { backgroundImage: 'url(' + comment.userpic + ')' }
          }></div>

          <Link className="b-thread__username" to={`/read/${comment.identity_display || comment.postername}`}>
            { journal }
          </Link>

          {
            !isDeleted ?
              <a
                href="javascript:void(0);"
                onClick={this.props.onReply.bind(null, comment)}
                className="b-reply b-pseudo">
                reply
                </a>
              : null
          }

          <p className="b-thread__body" dangerouslySetInnerHTML={{__html: comment.body}}/>
        </div>

        {commentBox}
      </li>
    );
  }
}

module.exports = Comment;
