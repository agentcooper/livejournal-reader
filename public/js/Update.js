/* @flow */

var React = require('react');

var Router = require('react-router');
var { Link } = Router;

var DocumentTitle = require('react-document-title');

var Textarea = require('react-textarea-autosize');

var marked = require('marked');

var LJ = require('./LJ');

var Editor = React.createClass({
  componentWillMount: function() {
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
  },

  componentWillReceiveProps: function(newProps) {
    if (newProps.postId) {
      var event = this.state.journal.events.find((event) => event.postId == newProps.postId);

      this.setPost(event);
    } else {
      this.backToNew();
    }
  },

  getInitialState: function() {
    return {
      body: '',

      itemid: null,

      security: 'private',

      markdown: false,

      mode: 'new',
      journal: null
    }
  },

  handleRemove: function(event) {
    event.preventDefault();

    LJ.newPost({
      itemid: this.state.itemid,
      security: this.state.security
    }).then(function() {
      console.log(arguments);
    });
  },

  onSecurityChange: function(event) {
    this.setState({ security: event.target.value });
  },

  handleSave: function(event) {
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
  },

  setPost: function(event) {
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
  },

  handleChange: function(event) {
    this.setState({ body: event.target.value });
  },

  backToNew: function() {
    this.setState({
      itemid: null,
      mode: 'new',
      body: ''
    });
  },

  render: function() {
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
});

module.exports = React.createClass({
  render: function() {
    var postId = this.props.params.postId;

    return (
      <DocumentTitle title="New post">
        <Editor postId={postId} />
      </DocumentTitle>
    );
  }
});
