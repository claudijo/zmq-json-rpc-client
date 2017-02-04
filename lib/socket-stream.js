var Duplex = require('stream').Duplex;

module.exports = function() {
  var stream = new Duplex();

  var messageListener = function(data) {
    stream.push(data);
  };

  stream.socket = null;

  stream.attach = function(socket) {
    if (this.socket) {
      this.socket.removeListener('message', messageListener);
    }

    this.socket = socket;

    this.socket.addListener('message', messageListener);

    return this;
  };

  stream._write = function(chunk, encoding, callback) {
    if (!this.socket) {
      return callback(new Error('No attached socket'));
    }

    this.socket.send(chunk);
    callback();
  };

  stream._read = function(size) {};

  return stream;
};
