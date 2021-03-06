/* @flow */

import React from 'react';
import { Link } from 'react-router';

import DocumentTitle from 'react-document-title';

import Textarea from 'react-textarea-autosize';

import marked from 'marked';

import LJ from '../../lib/LJ';

import './update.css';

class Editor extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.handleChange = this.handleChange.bind(this);
    this.handleRemove = this.handleRemove.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.onSecurityChange = this.onSecurityChange.bind(this);

    this.state = {
      body: '',

      itemid: null,

      security: 'private',

      markdown: false,

      mode: 'new',
      journal: null
    };
  }

  componentWillMount() {
    console.log(arguments);

    LJ.getJournal({
      auth: true
    }, (err, journal) => {
      this.setState({ journal: journal });

      if (this.props.postId) {
        var event = this.state.journal.events.find((event) => event.postId == this.props.postId);

        this.setPost(event);
      }
    });
  }

  componentWillReceiveProps(newProps) {
    if (newProps.postId) {
      var event = this.state.journal.events.find((event) => event.postId == newProps.postId);

      this.setPost(event);
    } else {
      this.backToNew();
    }
  }

  handleRemove(event) {
    event.preventDefault();

    LJ.newPost({
      itemid: this.state.itemid,
      security: this.state.security
    }).then(function() {
      console.log(arguments);
    });
  }

  onSecurityChange(event) {
    this.setState({ security: event.target.value });
  }

  handleSave(event) {
    event.preventDefault();

    var value = this.state.body;

    var html = marked(value);

    var post = '<div style="display: none;" ljreader-markdown="' +
      encodeURIComponent(value) + '"></div>\n' + html;

    LJ.newPost({
      itemid: this.state.itemid,
      event: post,
      security: this.state.security
    }).then(function() {
      console.log(arguments);
    });
  }

  setPost(event) {
    var markdown = '';

    var body = event.body;

    var match = event.body.match(/ ljreader-markdown="([^"]*)"/);

    if (match && match[1]) {
      markdown = decodeURIComponent(match[1]);
      body = markdown;

      console.log('Markdown found');
    }

    this.setState({
      markdown: markdown.length > 0,
      itemid: event.itemid,
      mode: 'edit',
      body: body
    });
  }

  handleChange(event) {
    this.setState({ body: event.target.value });
  }

  backToNew() {
    this.setState({
      itemid: null,
      mode: 'new',
      body: ''
    });
  }

  render() {
    var posts = null;

    if (this.state.journal) {
      posts = this.state.journal.events.map((event, index) => {
        return (
          <li key={index}>
            <Link className="editor__entry" to={`/update/${event.postId}`}>{event.body.slice(0, 10) + '...'}</Link>
          </li>
        );
      });
    }

    return (
      <div className="editor">
        <div>
          <h2>
            { this.state.mode === 'new' ? 'New post' : 'Edit post' }
            { this.state.mode === 'edit' ?
                <span>
                  {' '} or <Link to="/update/">create new post</Link>
                </span>
                : null
            }
          </h2>

          <Textarea className="editor__textarea" cols="80" value={this.state.body}
            onChange={this.handleChange}></Textarea>

          <div>
            <button className="editor__button" onClick={this.handleSave}>
              { this.state.mode === 'new' ? 'Create new post' : 'Edit post' }
            </button>

            <div>
              <select type="checkbox" value={this.state.security} onChange={this.onSecurityChange}>
                <option value="public">Public</option>
                <option value="private">Private</option>
              </select>
            </div>

            {
              this.state.mode === 'edit' ?
                <button className="editor__button" onClick={this.handleRemove}>
                  Remove post
                </button> : null
            }
          </div>

          <div>{ this.state.markdown ? 'Markdown mode' : null }</div>
        </div>

        <h3>Previous posts</h3>
        <ul>
          {posts}
        </ul>
      </div>
    );
  }
}

export default class extends React.Component {
  render() {
    var postId = this.props.params.postId;

    return (
      <DocumentTitle title="New post">
        <Editor postId={postId} />
      </DocumentTitle>
    );
  }
};
