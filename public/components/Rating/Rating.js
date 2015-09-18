import React from 'react';

import request from 'superagent';

import ReactIntl from 'react-intl';

import LJ from '../../lib/LJ';

import './rating.css';

import RatingEntry from './RatingEntry';

var FormattedRelative = ReactIntl.FormattedRelative;

export default class extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.sort = this.sort.bind(this);

    this.state = {
      rating: null
    };
  }

  componentDidMount() {
    LJ.getRating().then((rating) => {
      this.setState({ rating: rating });
    });
  }

  sort(type) {
    var rating = this.state.rating;

    var reverse = type.charAt(0) === '-';

    if (reverse) {
      type = type.slice(1);
    }

    function compare(a, b) {
      if (b[type] > a[type]) {
        return -1;
      }
      if (b[type] < a[type]) {
        return  1;
      }
      return 0;
    }

    rating.top.sort(
      reverse ? function(a, b) {
        return compare(b, a);
      } : compare
    );

    this.setState({ rating: rating });
  }

  render() {
    var entries = this.state.rating && this.state.rating.top.map(function(post, idx) {
      return <RatingEntry post={post} key={post.postId} position={idx + 1}/>;
    });

    var builtAt = null;

    if (this.state.rating) {
      builtAt = <p>
        Рейтинг обновлен <FormattedRelative value={this.state.rating.built_at} />
      </p>;
    }

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
            <a href="javascript:void(0);" className="b-pseudo" onClick={this.sort.bind(null, '-reply_count')}>комментариям</a>.

            {builtAt}
          </div>

          <ol className="b-social">
            {entries}
          </ol>
        </div>
      </div>
    );

    return this.state.rating ? rating : null;
  }
}
