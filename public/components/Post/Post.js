/* @flow */

import React from 'react';
import { Link } from 'react-router';

import './post.css';

import DocumentTitle from 'react-document-title';

import LJ from '../../lib/LJ';

import Comments from '../Comments/Comments';

export default class extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      post: null
    };
  }

  componentDidMount() {
    var params = this.props.params;

    LJ.getPost({
      journal: params.journal,
      postId: params.postId
    }, (err, post) => {
      this.setState({ post: post });
    });
  }

  render() {
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
}
