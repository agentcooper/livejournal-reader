var React = require('react');

var Comments = React.createClass({
  onSubmit: function() {
    var text = this.refs.textarea.getDOMNode().value;

    this.props.onSubmit(text);
  },

  render: function() {
    return (
      <div className="b-commentbox">
        <p>
          <textarea
            ref="textarea"
            className="b-commentbox-area"
            placeholder="Leave a comment"></textarea>
        </p>
        <p>
          <button
            className="b-commentbox-submit"
            onClick={this.onSubmit}
            >Submit comment</button>
        </p>
      </div>
    );
  }
});

module.exports = Comments;
