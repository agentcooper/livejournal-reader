var React = require('react');

var Router = require('react-router');
var { Link } = Router;

var classNames = require('classnames');

var Comment = React.createClass({
  reply: function(event) {
    event.preventDefault();

    console.log('fuck');
  },

  render: function() {
    var comment = this.props.comment;

    return (
      <li className={classNames(
          'b-comment',
          'b-comment-level-' + (comment.level > 15 ? 'over-15' : comment.level),
          { 'b-comment--anonymous': comment.isAnonymous }
        )} id={ 'c' + comment.dtalkid }>
        <div className={classNames(
          'b-thread__comment',
          { 'b-thread__comment_author': comment.isAuthor }
        )}>
          <div className="b-thread__userpic" style={
            { backgroundImage: 'url(' + comment.userpic + ')' }
          }></div>

          <Link className="b-thread__username" to="journal" params={
            { journal: comment.identity_display || comment.postername || '' }
          }>
            { comment.identity_display || comment.postername }
          </Link>

          <a href="#" onClick={this.reply} className="b-reply b-pseudo">reply</a>

          <p className="b-thread__body">{ comment.body }</p>
        </div>
      </li>
    );
  }
});

module.exports = Comment;
