module.exports = function() {
    return {
      _filters: [],

      use: function(func) {
        this._filters.push(func);

        return this;
      },

      process: function(text, options) {
        return this._filters.reduce(function(text, filter) {
          return filter(text, options);
        }, text);
      }
  };
};
