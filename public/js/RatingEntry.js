var React = require('react');

var Router = require('react-router');
var { Route, DefaultRoute, RouteHandler, Link } = Router;

var RatingEntry = React.createClass({
  render: function() {
    var post = this.props.post;

    return (
      <li className="b-social-item">
        <Link className="b-social-link" to="post" params={
          { journal: post.journal, postId: post.postId }
        }>
          <span className="b-social-position">{this.props.position}. </span>

          <span className="b-social-header">{ post.title }</span>
          
          <div className="b-social-body" dangerouslySetInnerHTML={{__html: post.body}}></div>

          <span className="b-social-details">
            <span className="user">{ post.journal }</span>
          </span>

          <div className="b-social-stats">
            <span className="b-entry__twitter">
              <span className="b-entry__tweets">{post.tw_count}</span>
            </span>

            <span className="b-entry__fb">
              <span>{ post.fb_count }</span>
            </span>

            <span className="b-entry__livejournal">
              <span>{post.reply_count}</span>
            </span>

            <span className="b-entry__vk">
              <span>{ post.vk_count }</span>
            </span>
          </div>
        </Link>
      </li>
    );
  }
});

module.exports = RatingEntry;
