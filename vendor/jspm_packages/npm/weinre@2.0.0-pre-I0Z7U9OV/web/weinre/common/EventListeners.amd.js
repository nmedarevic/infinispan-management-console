/* */ 
;modjewel.define("weinre/common/EventListeners", function(require, exports, module) { // Generated by CoffeeScript 1.8.0
var EventListeners, Ex, Weinre;

Ex = require('./Ex');

Weinre = require('./Weinre');

module.exports = EventListeners = (function() {
  function EventListeners() {
    this.listeners = [];
  }

  EventListeners.prototype.add = function(listener, useCapture) {
    return this.listeners.push([listener, useCapture]);
  };

  EventListeners.prototype.remove = function(listener, useCapture) {
    var listeners, _i, _len, _listener;
    listeners = this.listeners.slice();
    for (_i = 0, _len = listeners.length; _i < _len; _i++) {
      _listener = listeners[_i];
      if (_listener[0] !== listener) {
        continue;
      }
      if (_listener[1] !== useCapture) {
        continue;
      }
      this._listeners.splice(i, 1);
      return;
    }
  };

  EventListeners.prototype.fire = function(event) {
    var e, listener, listeners, _i, _len, _results;
    listeners = this.listeners.slice();
    _results = [];
    for (_i = 0, _len = listeners.length; _i < _len; _i++) {
      listener = listeners[_i];
      listener = listener[0];
      if (typeof listener === "function") {
        try {
          listener.call(null, event);
        } catch (_error) {
          e = _error;
          Weinre.logError("" + arguments.callee.name + " invocation exception: " + e);
        }
        continue;
      }
      if (typeof (listener != null ? listener.handleEvent : void 0) !== "function") {
        throw new Ex(arguments, "listener does not implement the handleEvent() method");
      }
      try {
        _results.push(listener.handleEvent.call(listener, event));
      } catch (_error) {
        e = _error;
        _results.push(Weinre.logError("" + arguments.callee.name + " invocation exception: " + e));
      }
    }
    return _results;
  };

  return EventListeners;

})();

require("../common/MethodNamer").setNamesForClass(module.exports);

});
