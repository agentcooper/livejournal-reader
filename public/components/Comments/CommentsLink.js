var React = require('react');

var Router = require('react-router');
var { Link } = Router;

module.exports = React.createClass({
  propTypes: {
    count: React.PropTypes.number.isRequired
  },

  render: function() {
    var text = this.props.count + ' comments';

    if (this.props.count === 0) {
      text = 'No comments';
    }

    if (this.props.count === 1) {
      text = '1 comment';
    }

    return (
      <Link to={`/read/${this.props.journal}/${this.props.postId}`}>{ text }</Link>
    );
  }
});
