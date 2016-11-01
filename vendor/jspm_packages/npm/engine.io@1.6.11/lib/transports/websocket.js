/* */ 
(function(Buffer) {
  var Transport = require('../transport'),
      parser = require('engine.io-parser'),
      debug = require('debug')('engine:ws');
  module.exports = WebSocket;
  function WebSocket(req) {
    Transport.call(this, req);
    var self = this;
    this.socket = req.websocket;
    this.socket.on('message', this.onData.bind(this));
    this.socket.once('close', this.onClose.bind(this));
    this.socket.on('error', this.onError.bind(this));
    this.socket.on('headers', function(headers) {
      self.emit('headers', headers);
    });
    this.writable = true;
    this.perMessageDeflate = null;
  }
  ;
  WebSocket.prototype.__proto__ = Transport.prototype;
  WebSocket.prototype.name = 'websocket';
  WebSocket.prototype.handlesUpgrades = true;
  WebSocket.prototype.supportsFraming = true;
  WebSocket.prototype.onData = function(data) {
    debug('received "%s"', data);
    Transport.prototype.onData.call(this, data);
  };
  WebSocket.prototype.send = function(packets) {
    var self = this;
    packets.forEach(function(packet) {
      parser.encodePacket(packet, self.supportsBinary, function(data) {
        debug('writing "%s"', data);
        var opts = {};
        if (packet.options) {
          opts.compress = packet.options.compress;
        }
        if (self.perMessageDeflate) {
          var len = 'string' == typeof data ? Buffer.byteLength(data) : data.length;
          if (len < self.perMessageDeflate.threshold) {
            opts.compress = false;
          }
        }
        self.writable = false;
        self.socket.send(data, opts, function(err) {
          if (err)
            return self.onError('write error', err.stack);
          self.writable = true;
          self.emit('drain');
        });
      });
    });
  };
  WebSocket.prototype.doClose = function(fn) {
    debug('closing');
    this.socket.close();
    fn && fn();
  };
})(require('buffer').Buffer);
