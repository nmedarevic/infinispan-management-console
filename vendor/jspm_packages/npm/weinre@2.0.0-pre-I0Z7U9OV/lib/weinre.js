/* */ 
(function(process) {
  var HttpChannelHandler,
      Version,
      channelManager,
      checkForDeath,
      checkHost,
      deathTimeout,
      dns,
      dumpingHandler,
      express,
      fs,
      getStaticWebDir,
      getVersion,
      jsonBodyParser,
      net,
      path,
      processOptions,
      run2,
      serviceManager,
      startDeathWatcher,
      startServer,
      utils,
      _;
  fs = require('fs');
  net = require('net');
  dns = require('dns');
  path = require('path');
  _ = require('underscore');
  express = require('express');
  utils = require('./utils');
  jsonBodyParser = require('./jsonBodyParser');
  HttpChannelHandler = require('./HttpChannelHandler');
  dumpingHandler = require('./dumpingHandler');
  channelManager = require('./channelManager');
  serviceManager = require('./serviceManager');
  exports.run = function(options) {
    return processOptions(options, run2);
  };
  run2 = function() {
    var options;
    options = utils.options;
    serviceManager.registerProxyClass('WeinreClientEvents');
    serviceManager.registerProxyClass('WeinreTargetEvents');
    serviceManager.registerLocalClass('WeinreClientCommands');
    serviceManager.registerLocalClass('WeinreTargetCommands');
    startDeathWatcher(options.deathTimeout);
    return startServer();
  };
  processOptions = function(options, cb) {
    var name,
        nameLen,
        names,
        reducer,
        _i,
        _len;
    options.httpPort = utils.ensureInteger(options.httpPort, 'the value of the option httpPort is not a number');
    options.boundHost = utils.ensureString(options.boundHost, 'the value of the option boundHost is not a string');
    options.verbose = utils.ensureBoolean(options.verbose, 'the value of the option verbose is not a boolean');
    options.debug = utils.ensureBoolean(options.debug, 'the value of the option debug is not a boolean');
    options.readTimeout = utils.ensureInteger(options.readTimeout, 'the value of the option readTimeout is not a number');
    options.deathTimeout = utils.ensureInteger(options.deathTimeout, 'the value of the option deathTimeout is not a number');
    if (options.debug) {
      options.verbose = true;
    }
    options.staticWebDir = getStaticWebDir();
    utils.logVerbose("pid:                 " + process.pid);
    utils.logVerbose("version:             " + (getVersion()));
    utils.logVerbose("node versions:");
    names = _.keys(process.versions);
    reducer = function(memo, name) {
      return Math.max(memo, name.length);
    };
    nameLen = _.reduce(names, reducer, 0);
    for (_i = 0, _len = names.length; _i < _len; _i++) {
      name = names[_i];
      utils.logVerbose("   " + (utils.alignLeft(name, nameLen)) + ": " + process.versions[name]);
    }
    utils.logVerbose("options:");
    utils.logVerbose("   httpPort:     " + options.httpPort);
    utils.logVerbose("   boundHost:    " + options.boundHost);
    utils.logVerbose("   verbose:      " + options.verbose);
    utils.logVerbose("   debug:        " + options.debug);
    utils.logVerbose("   readTimeout:  " + options.readTimeout);
    utils.logVerbose("   deathTimeout: " + options.deathTimeout);
    utils.setOptions(options);
    return checkHost(options.boundHost, function(err) {
      if (err) {
        utils.exit("unable to resolve boundHost address: " + options.boundHost);
      }
      return cb();
    });
  };
  checkHost = function(hostName, cb) {
    if (hostName === '-all-') {
      return cb();
    }
    if (hostName === 'localhost') {
      return cb();
    }
    if (net.isIP(hostName)) {
      return cb();
    }
    return dns.lookup(hostName, cb);
  };
  deathTimeout = null;
  startDeathWatcher = function(timeout) {
    deathTimeout = utils.options.deathTimeout * 1000;
    return setInterval(checkForDeath, 1000);
  };
  checkForDeath = function() {
    var channel,
        now,
        _i,
        _len,
        _ref,
        _results;
    now = (new Date).valueOf();
    _ref = channelManager.getChannels();
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      channel = _ref[_i];
      if (now - channel.lastRead > deathTimeout) {
        _results.push(channel.close());
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  };
  startServer = function() {
    var app,
        clientHandler,
        favIcon,
        options,
        staticCacheOptions,
        targetHandler;
    options = utils.options;
    clientHandler = new HttpChannelHandler('/ws/client');
    targetHandler = new HttpChannelHandler('/ws/target');
    channelManager.initialize();
    favIcon = "" + options.staticWebDir + "/images/weinre-icon-32x32.png";
    staticCacheOptions = {
      maxObjects: 500,
      maxLength: 32 * 1024 * 1024
    };
    app = express.createServer();
    app.on('error', function(error) {
      return utils.exit("error running server: " + error);
    });
    app.use(express.favicon(favIcon));
    app.use(jsonBodyParser());
    app.all(/^\/ws\/client(.*)/, function(request, response, next) {
      var uri;
      uri = request.params[0];
      if (uri === '') {
        uri = '/';
      }
      if (options.debug) {
        dumpingHandler(request, response, uri);
      }
      return clientHandler.handle(request, response, uri);
    });
    app.all(/^\/ws\/target(.*)/, function(request, response, next) {
      var uri;
      uri = request.params[0];
      if (uri === '') {
        uri = '/';
      }
      if (options.debug) {
        dumpingHandler(request, response, uri);
      }
      return targetHandler.handle(request, response, uri);
    });
    app.use(express.errorHandler({dumpExceptions: true}));
    app.use(express.staticCache(staticCacheOptions));
    app.use(express["static"](options.staticWebDir));
    if (options.boundHost === '-all-') {
      utils.log("starting server at http://localhost:" + options.httpPort);
      return app.listen(options.httpPort);
    } else {
      utils.log("starting server at http://" + options.boundHost + ":" + options.httpPort);
      return app.listen(options.httpPort, options.boundHost);
    }
  };
  getStaticWebDir = function() {
    var webDir;
    webDir = path.normalize(path.join(__dirname, '../web'));
    if (utils.fileExistsSync(webDir)) {
      return webDir;
    }
    return utils.exit('unable to find static files to serve in #{webDir}; did you do a build?');
  };
  Version = null;
  getVersion = exports.getVersion = function() {
    var json,
        packageJsonName,
        values;
    if (Version) {
      return Version;
    }
    packageJsonName = path.join(path.dirname(fs.realpathSync(__filename)), '../package.json');
    json = fs.readFileSync(packageJsonName, 'utf8');
    values = JSON.parse(json);
    Version = values.version;
    return Version;
  };
})(require('process'));
