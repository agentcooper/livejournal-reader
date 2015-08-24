var path = require('path');

module.exports = {
  devtool:
    process.env.NODE_ENV === 'production' ? undefined : 'inline-source-map',

  entry: path.resolve(__dirname, 'public/js/index.js'),

  output: {
    path: path.resolve(__dirname, 'public/build'),
    filename: 'app.js'
  },

  module: {
    loaders: [
      { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader'},
      { test: /\.css$/, loader: 'style!css' },
      { test: /\.(png|jpg|ico)$/, loader: 'url?limit=25000' }
    ]
  }
};
