module.exports = function(text, options) {
  return text
          .replace(/<\s*br[^>]*\/?>/g, "\n")
          .replace(/\r\n?/, "\n");
}
