/* @flow */

var React = require('react');

var Router = require('react-router');
var { Link } = Router;

import './post.css';

var DocumentTitle = require('react-document-title');

var LJ = require('../../lib/LJ');

var Comments = require('../Comments/Comments');

var Post = React.createClass({
  getInitialState: function() {
    return {
      post: null
    };
  },

  componentDidMount: function() {
    var params = this.props.params;

    LJ.getPost({
      journal: params.journal,
      postId: params.postId
    }, (err, post) => {
      this.setState({ post: post });
    });
  },

  render: function() {
    var post = this.state.post;

    var output = null;

    if (post) {
      output = (
        <DocumentTitle title={post.subject}>
          <article className="b-post">
            <header className="b-post__header">
              <h1 className="b-post__title">{ post.subject }</h1>
              <Link className="b-lj_user b-lj_user--big" to={`/read/${post.journal}`}>{ post.journal }</Link>
            </header>
            <div className="b-post__body" dangerouslySetInnerHTML={{__html: post.body}}>
            </div>

            <Comments post={post} />
          </article>
        </DocumentTitle>
      );
    }

    return output;
  }
});

module.exports = Post;
