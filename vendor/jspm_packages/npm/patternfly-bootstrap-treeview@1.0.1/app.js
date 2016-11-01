/* */ 
(function(process) {
  var express = require('express');
  var http = require('http');
  var path = require('path');
  var app = express();
  app.set('port', process.env.PORT || 3000);
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.json());
  app.use(express.urlencoded());
  app.use(express.methodOverride());
  app.use(express.static(path.join(__dirname, '/public')));
  app.use(express.static(path.join(__dirname, '/tests')));
  if ('development' == app.get('env')) {
    app.use(express.errorHandler());
  }
  http.createServer(app).listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port'));
  });
})(require('process'));