# ZMQ JSON-RPC Client

JSON-RPC 2.0 client implementation using a ZeroMQ socket as transport mechanism. 
More precisely a `dealer` socket is used for the client, in line with the [asynchronous clients / servers pattern](http://zguide.zeromq.org/page:all#The-Asynchronous-Client-Server-Pattern)
of ZeroMQ.

## Installation

```
npm install zmq-json-rpc-client
```

## Usage

Create a JSON RPC client wiht a ZeroMQ endpoint and emit requests or 
notifications.

### zmqJsonRpcClient(endpoint, options)

This module exports a factory faction that accepts a ZeroMQ endpoint, eg. 
`tcp:127.0.0.1:3030` and options. 

#### Options

The following options can be passed to the factory function.

##### nextId

Function that is called each time a new request is created. Defaults to a 
built-in incrementer starting at `1`.

##### timeout

The number of milliseconds the client will wait for a reply when sending a 
request, until returning a timeout error. Defaults to `30000` (30 seconds).

##### socketId

Identity that will be used for the underlaying ZeroMQ socket. Defaults to five 
random bytes.

### client.emit(method, params, callback)

Sends a JSON-RPC request or notification. Params and callback are optional. A 
notification is sent if callback is omitted. A request that expetct a reply
will be sent if passing a callback. The callback will receive an error and a 
result as arguments.

### client.socket

Exposes the underlying ZeroMQ socket object.

## Example

```js

var zmqJsonRpcClient = require('zmq-json-rpc-client');
var client = zmqJsonRpcClient('tcp:127.0.0.1', { socketId: 'client' });

// Send a notification
client.emit('update', [1, 2, 3, 4, 5]);  

// Send a request
client.emit('subtract', {"subtrahend": 23, "minuend": 42}, function(err, result) {
  // ...
});

```

## Related packages

* [zmq-json-rpc-server](https://github.com/claudijo/zmq-json-rpc-server)

## Test

Run unit tests

`$ npm test`




