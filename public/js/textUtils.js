var $ = require('jquery');

var processor = require("../../lib/text/process");

var normalize_newlines = require("../../lib/text/process/newlines");
var highlight_links = require("../../lib/text/process/links");
var autoparagraph = require("../../lib/text/process/autoparagraph");
var clean_html = require("../../lib/text/process/clean-html");

var post_processor = processor()
                      .use(normalize_newlines)
                      .use(highlight_links)
                      .use(autoparagraph)
                      .use(clean_html);

var comment_processor = processor()
                      .use(normalize_newlines)
                      .use(highlight_links);


exports.prettifyPost = function(text) {
  console.log(text);

  var transformed = post_processor.process(text);
  console.log(text);

  return transformed;
};

exports.prettifyComment = function(text) {
  console.log(text);

  var transformed = comment_processor.process(text);
  console.log(text);

  return transformed;
};
