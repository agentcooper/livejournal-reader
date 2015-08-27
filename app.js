'use strict';

var express = require('express'),
    path = require('path');

var comments = require('./routes/comments'),
    post = require('./routes/post'),
    feed = require('./routes/feed'),
    journal = require('./routes/journal'),
    update = require('./routes/update'),
    auth = require('./routes/auth');

var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var serveStatic = require('serve-static');
var serveFavicon = require('serve-favicon');
var morgan = require('morgan');

var app = express();

app.use(cookieParser());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(serveFavicon(__dirname + '/public/images/favicon.ico'));
app.use(morgan('combined'));

app.use(serveStatic(path.join(__dirname, 'public')));

if (app.get('env') === 'development') {
  app.use(require('errorhandler')());
}

app.get('/api/post', post.get);
app.get('/api/comments', comments.get);
app.get('/api/feed', feed.get);
app.get('/api/journal', journal.get);

app.get('/auth/run', auth.run);
app.get('/auth', auth.token);
app.get('/api/login', auth.login);

app.post('/api/comments/add', comments.add);
app.post('/api/newPost', update.newPost);
app.post('/api/editPost', update.editPost);

app.all('*', function(req, res) {
  res.sendfile('./public/index.html');
});

app.set('port', process.env.PORT || 4000);

var server = app.listen(app.get('port'), function() {
  var host = server.address().address;
  var port = server.address().port;

  console.log('livejournal-reader is listening at port %s', port);
});
