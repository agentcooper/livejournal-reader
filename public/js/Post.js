/* @flow */

var React = require('react');

var Router = require('react-router');
var { Route, DefaultRoute, RouteHandler, Link } = Router;

var LJ = require('./LJ');

var Comments = require('./Comments');

var Post = React.createClass({
  contextTypes: {
    router: React.PropTypes.func
  },

  getInitialState: function() {
    return {
      post: null
    }
  },

  componentDidMount: function() {
    var params = this.context.router.getCurrentParams();

    LJ.getPost({
      journal: params.journal,
      postId: params.postId
    }, (err, post) => {
      this.setState({ post: post })
    });
  },

  render: function() {
    var post = this.state.post;

    var output = null;

    if (post) {
      output = (
        <article className="b-post">
          <header className="b-post__header">
            <h1 className="b-post__title">{ post.subject }</h1>
            <Link className="b-lj_user b-lj_user--big" to="journal" params={
              { journal: post.journal || '' }
            }>{ post.journal }</Link>
          </header>
          <div className="b-post__body">
            { post.body }
          </div>

          <Comments post={post} />
        </article>
      )
    }

    return output;
  }
});

module.exports = Post;
