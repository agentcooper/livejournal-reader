import React from 'react';

export default class extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit() {
    var text = React.findDOMNode(this.refs.textarea).value;

    this.props.onSubmit(text);
  }

  render() {
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
}
