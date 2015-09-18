import React from 'react';

import OverlayTrigger from 'react-bootstrap/lib/OverlayTrigger';

import Popover from 'react-bootstrap/lib/Popover';

import LJ from '../../lib/LJ';

import './social.css';

const networks = {
  twitter: function(post) {
    return [
      'https://twitter.com/intent/tweet?url=',
      location.href,
      '&text=',
      post.subject
    ].join('');
  },

  facebook: function(post) {
    return 'https://www.facebook.com/sharer/sharer.php?u=' +
      location.href + '&t=' + post.subject;
  }
};

export default class extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.share = this.share.bind(this);
  }

  share(network, event) {
    event.preventDefault();

    LJ.getPost({
      journal: this.props.journal,
      postId: this.props.postId
    }, function(err, post) {
      window.open(
        networks[network](post),
        network,
        'width=550,height=420'
      );
    });
  }

  render() {
    return (
      <OverlayTrigger trigger='click' rootClose={true} placement='bottom' overlay={
        <Popover>
          <div className="b-share-options">
            <p>
              <a href="#" className="b-share__network" onClick={this.share.bind(null, 'twitter')}>Twitter</a>
            </p>

            <p>
              <a href="#" className="b-share__network" onClick={this.share.bind(null, 'facebook')}>Facebook</a>
            </p>
          </div>
        </Popover>
      }>
        <a href="javascript:void(0);" className="b-share">share this post</a>
      </OverlayTrigger>
    );
  }
}
