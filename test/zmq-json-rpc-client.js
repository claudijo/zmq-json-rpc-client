var assert = require('assert');
var zmq = require('zeromq');
var zmqJsonRpcClient = require('..');

describe('ZMQ JSON-RPC Client', function() {
  beforeEach(function() {
    this.fakeServer = zmq.socket('router');
    this.fakeServer.bindSync('ipc://some-endpoint');
  });

  afterEach(function() {
    this.fakeServer.close();
  });

  it('should emit JSON-RPC notification to server with specified endpoint', function(done) {
    var rpc = zmqJsonRpcClient('ipc://some-endpoint');

    rpc.emit('foo');

    this.fakeServer.on('message', function(socketId, data) {
      var message = JSON.parse(data);
      assert(message.method === 'foo');
      done();
    });
  });

  it('should expose underlaying zmq socket', function() {
    var rpc = zmqJsonRpcClient('ipc://some-endpoint');

    assert(rpc.socket.constructor === zmq.Socket);
  });

  it('should accept a `nextId` option', function(done) {
    var rpc = zmqJsonRpcClient('ipc://some-endpoint', {
      nextId: function() { return 'generated-id'; }
    });

    rpc.emit('foo', function(err, result) { /* Noop just to force a json rpc request to include id */});

    this.fakeServer.on('message', function(socketId, data) {
      var message = JSON.parse(data);
      assert(message.id === 'generated-id');
      done();
    })
  });

  it('should accept a `timeout` option', function(done) {
    var timeoutError = null;

    var rpc = zmqJsonRpcClient('ipc://some-endpoint', {
      timeout: 20
    });

    rpc.emit('foo', function(err, result) {
      timeoutError = err;
    });

    setTimeout(function() {
      assert(timeoutError);
      done();
    }, 60);
  });

  it('should accept a `socketId` option', function(done) {
    var rpc = zmqJsonRpcClient('ipc://some-endpoint', {
      socketId: 'client'
    });

    this.fakeServer.on('message', function(socketId, data) {
      assert(socketId.toString() === 'client');
      done();
    });

    rpc.emit('foo');
  })
});
