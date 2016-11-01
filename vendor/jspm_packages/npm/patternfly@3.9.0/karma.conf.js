/* */ 
var config = module.exports = function(config) {
  config.set({
    basePath: './',
    frameworks: ['jasmine'],
    files: ['components/jquery/dist/jquery.js', 'components/bootstrap/dist/js/bootstrap.js', 'components/bootstrap-combobox/js/bootstrap-combobox.js', 'components/bootstrap-datepicker/dist/js/bootstrap-datepicker.js', 'components/bootstrap-select/dist/js/bootstrap-select.js', 'components/datatables/media/js/jquery.dataTables.js', 'components/bootstrap-switch/dist/js/bootstrap-switch.js', 'components/patternfly-bootstrap-treeview/src/js/bootstrap-treeview.js', 'components/c3/c3.js', 'components/d3/d3.js', 'node_modules/jasmine-jquery/lib/jasmine-jquery.js', {
      pattern: 'dist/img/**/*',
      watched: true,
      included: false,
      served: true
    }, {
      pattern: 'dist/fonts/**/*',
      watched: true,
      included: false,
      served: true
    }, {
      pattern: 'dist/css/*.map',
      watched: true,
      included: false,
      served: true
    }, 'dist/css/*.css', 'dist/js/*.js', {
      pattern: 'dist/tests/**/*',
      watched: true,
      included: false,
      served: true
    }, 'tests/unit/globals.js', 'tests/unit/*.spec.js'],
    exclude: [],
    preprocessors: {},
    reporters: ['progress'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['PhantomJS'],
    middleware: ['custom'],
    plugins: ['karma-jasmine', 'karma-chrome-launcher', 'karma-firefox-launcher', 'karma-phantomjs-launcher', {'middleware:custom': ['factory', CustomMiddlewareFactory]}],
    singleRun: true,
    browserNoActivityTimeout: 100000
  });
};
var fs = require('fs');
var CustomMiddlewareFactory = function(config) {
  return function(request, response) {
    if (/^\/dist*/.test(request.url)) {
      var newPath = request._parsedUrl.pathname.substring(1);
      var file = fs.readFileSync(newPath, "utf8");
      if (config.logLevel === config.LOG_DEBUG) {
        console.log('Intercepted:' + request.url + ' Serving: ' + newPath);
      }
      if (request.url.indexOf('.svg') > 0) {
        response.writeHeader(200, {'Content-Type': 'image/svg+xml'});
      } else if (request.url.indexOf('.js') > 0) {
        response.writeHeader(200, {'Content-Type': 'application/javascript'});
      } else if (request.url.indexOf('.css') > 0) {
        response.writeHeader(200, {'Content-Type': 'text/css'});
      }
      response.write(file);
    }
    return response.end();
  };
};
