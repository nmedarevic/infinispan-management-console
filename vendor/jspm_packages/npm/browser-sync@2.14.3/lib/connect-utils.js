/* */ 
"use strict";
var _ = require('../lodash.custom');
var fs = require('fs');
var config = require('./config');
function getPath(options, relative, port) {
  if (options.get("mode") === "snippet") {
    return options.get("scheme") + "://HOST:" + port + relative;
  } else {
    return "//HOST:" + port + relative;
  }
}
var connectUtils = {
  scriptTags: function(options) {
    var scriptPath = this.clientScript(options);
    var async = options.getIn(["snippetOptions", "async"]);
    var scriptDomain = options.getIn(["script", "domain"]);
    var scriptSrc = (function() {
      if (options.get("localOnly")) {
        return [options.get("scheme"), "://localhost:", options.get("port"), scriptPath].join("");
      }
      if (_.isFunction(options.get("scriptPath"))) {
        return options.get("scriptPath").apply(null, getScriptArgs(options, scriptPath));
      }
      if (scriptDomain) {
        if (_.isFunction(scriptDomain)) {
          return scriptDomain.call(null, options) + scriptPath;
        }
        if (scriptDomain.match(/\{port\}/)) {
          return scriptDomain.replace("{port}", options.get("port")) + scriptPath;
        }
        return scriptDomain + scriptPath;
      }
      if (options.get("server") || options.get("proxy")) {
        return scriptPath;
      }
      return getPath(options, scriptPath, options.get("port"));
    })();
    var template = (function() {
      if (scriptDomain || options.get("localOnly")) {
        return config.templates.scriptTagSimple;
      }
      return config.templates.scriptTag;
    })();
    return fs.readFileSync(template, "utf8").replace("%script%", scriptSrc).replace("%async%", async ? "async" : "");
  },
  socketConnector: function(options) {
    var socket = options.get("socket");
    var template = fs.readFileSync(config.templates.connector, "utf-8");
    var url = connectUtils.getConnectionUrl(options);
    var clientConfig = socket.get("socketIoClientConfig").merge({path: socket.get("path")});
    template = template.replace("%config%", JSON.stringify(clientConfig.toJS())).replace("%url%", url);
    return template;
  },
  getNamespace: function(socketOpts, options) {
    var namespace = socketOpts.namespace;
    if (typeof namespace === "function") {
      return namespace(options);
    }
    if (!namespace.match(/^\//)) {
      namespace = "/" + namespace;
    }
    return namespace;
  },
  getConnectionUrl: function(options) {
    var socketOpts = options.get("socket").toJS();
    var namespace = connectUtils.getNamespace(socketOpts, options);
    var protocol = "";
    var withHostnamePort = "'{protocol}' + location.hostname + ':{port}{ns}'";
    var withHost = "'{protocol}' + location.host + '{ns}'";
    var withDomain = "'{domain}{ns}'";
    var port = options.get("port");
    var string = withHost;
    if (options.get("mode") !== "server") {
      protocol = options.get("scheme") + "://";
      string = withHostnamePort;
    }
    if (options.get("mode") === "proxy" && options.getIn(["proxy", "ws"])) {
      port = options.getIn(["socket", "port"]);
    }
    socketOpts.domain = (function() {
      if (options.get("localOnly")) {
        string = withDomain;
        return [options.get("scheme"), "://localhost:", options.get("port")].join("");
      }
      if (socketOpts.domain) {
        string = withDomain;
        if (_.isFunction(socketOpts.domain)) {
          return socketOpts.domain.call(null, options);
        }
        if (_.isString(socketOpts.domain)) {
          return socketOpts.domain;
        }
      }
      return "";
    })();
    return string.replace("{protocol}", protocol).replace("{port}", port).replace("{domain}", socketOpts.domain.replace("{port}", port)).replace("{ns}", namespace);
  },
  clientScript: function(options, both) {
    var prefix = options.getIn(["socket", "clientPath"]);
    var script = prefix + "/browser-sync-client.js";
    var template = prefix + "/browser-sync-client.%s.js";
    var compiled = template.replace("%s", options.get("version"));
    if (both) {
      return {
        path: script,
        versioned: compiled
      };
    }
    return compiled;
  }
};
function getScriptArgs(options, scriptPath) {
  var abspath = options.get("scheme") + "://HOST:" + options.get("port") + scriptPath;
  return [scriptPath, options.get("port"), options.set("absolute", abspath)];
}
module.exports = connectUtils;
