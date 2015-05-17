var React = require('react');

var Router = require('react-router');
var { Route, DefaultRoute, RouteHandler, Link } = Router;

var request = require('superagent');

var LJ = require('./LJ');

var TopEntry = React.createClass({
  render: function() {
    var post = this.props.post;

    return (
      <li className="b-social-item">
        <Link className="b-social-link" to="post" params={
          { journal: post.journal, postId: post.postId }
        }>
          <span className="b-social-header">{ post.title }</span>
          
          <div className="b-social-body">{ post.body }</div>

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

var Top = React.createClass({
  componentDidMount: function() {
    LJ.getRating().then((rating) => {
      this.setState({ rating: rating });
    });
  },

  getInitialState: function() {
    return {
      rating: null
    }
  },

  sort: function(type) {
    var rating = this.state.rating;

    var reverse = type.charAt(0) === '-';

    if (reverse) {
      type = type.slice(1);
    }

    function compare(a, b) {
      if (b[type] > a[type]) { return -1; }
      if (b[type] < a[type]) { return  1; }
      return 0;
    }

    rating.top.sort(
      reverse ? function(a, b) {
        return compare(b, a)
      } : compare
    );

    this.setState({ rating: rating });
  },

  render: function () {
    var entries = this.state.rating && this.state.rating.top.map(function(post) {      
      return <TopEntry post={post}/>
    });

    var rating = (
      <div>
        <div className="b-rating">
          <h1 className="b-header">LiveJournal reader</h1>

          <div className="b-top__controls">
            Сортировать по {" "}
            <a href="javascript:void(0);" className="b-pseudo" onClick={this.sort.bind(null, 'position')}>позиции</a>,
            {" "}
            <a href="javascript:void(0);" className="b-pseudo" onClick={this.sort.bind(null, '-tw_count')}>твитам</a>,
            {" "}
            <a href="javascript:void(0);" className="b-pseudo" onClick={this.sort.bind(null, '-fb_count')}>фейсбуку</a>,
            {" "}
            <a href="javascript:void(0);" className="b-pseudo" onClick={this.sort.bind(null, '-vk_count')}>вконтакте</a>,
            {" "}
            <a href="javascript:void(0);" className="b-pseudo" onClick={this.sort.bind(null, '-reply_count')}>комментариям</a>. <p>Рейтинг обновлен</p> 
          </div>

          <ol className="b-social">
            {entries}
          </ol>
        </div>
      </div>
    );

    return this.state.rating ? rating : null;
  }
});

module.exports = Top;
