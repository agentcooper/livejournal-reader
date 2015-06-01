var React = require('react');

var Router = require('react-router');
var { Route, DefaultRoute, RouteHandler, Link } = Router;

var request = require('superagent');

var LJ = require('./LJ');

var RatingEntry = require('./RatingEntry');

var Rating = React.createClass({
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
    var entries = this.state.rating && this.state.rating.top.map(function(post, idx) {
      return <RatingEntry post={post} key={post.postId} position={idx + 1}/>
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

module.exports = Rating;
