var express = require('express'),
    http    = require('http'),
    path    = require('path'),

    comments = require('./routes/comments'),
    post     = require('./routes/post'),
    feed     = require('./routes/feed'),
    journal  = require('./routes/journal');

var app = express();

app.set('port', process.env.PORT || 4000);
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(app.router);

app.use(function(req, res, next) {

  if (/^\/read\//.test(req.url)) {
    console.log('read');
    req.url = '/';
  }

  if (/^\/feed\/?$/.test(req.url)) {
    req.url = '/';
  }

  if (/^\/history\/?$/.test(req.url)) {
    req.url = '/';
  }

  if (/^\/comments$/.test(req.url)) {
    req.url = '/';
  }

  next();
});

//app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get( '/api/post',     post.get     );
app.get( '/api/comments', comments.get );
app.get( '/api/feed',     feed.get     );
app.get( '/api/journal',  journal.get  );

http.createServer(app).listen(app.get('port'), function(){
  console.log('App is running on port ' + app.get('port'));
});
