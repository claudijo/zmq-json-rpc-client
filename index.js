var zmq = require('zeromq');
var jsonRpcClientStream = require('json-rpc-client-stream');
var socketStream = require('./lib/socket-stream');

module.exports = function(endpoint, opts) {
  opts = opts || {};

  var socket = zmq.socket('dealer');
  var clientStream = jsonRpcClientStream(opts);
  var clientSocketStream = socketStream().attach(socket);

  if (opts.socketId) {
    socket.identity = opts.socketId;
  }

  socket.connect(endpoint);
  clientStream.pipe(clientSocketStream).pipe(clientStream);

  clientStream.rpc.socket = socket;

  return clientStream.rpc;
};
