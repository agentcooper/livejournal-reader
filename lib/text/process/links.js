var Autolinker = require('autolinker');

module.exports = function(text, options) {
  return Autolinker.link(text, {
    replaceFn : function( autolinker, match ) {
      var tag = autolinker.getTagBuilder().build( match );  // returns an `Autolinker.HtmlTag` instance, which provides mutator methods for easy changes

      if (match.getType() === 'url') {
        tag.setInnerHtml(decodeURIComponent(match.getAnchorText()));

        return tag;
      }

      if (match.getType() === 'twitter') {
        var name = match.getAnchorText().substr(1);

        tag.setAttr('href', '/read/' + name);
        tag.setAttr('target', "");

        return tag;
      }

      return true;
    },

    phone: false,
    hashtag: false
  });
}
