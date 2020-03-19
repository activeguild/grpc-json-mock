import * as grpc from 'grpc';
import { MockMethodJson, RPCType } from './mocky';

const DEFAULT_STREAMING_INTERVAL = 1000;

const intervalEach = (
  array: { [key: string]: string }[],
  callback: (value: { [key: string]: string }) => void,
  lastCallback: () => void,
  interval: number | undefined = DEFAULT_STREAMING_INTERVAL
): void => {
  let i = array.length;
  const timerID = setInterval(function() {
    if (!i) {
      lastCallback();
      clearInterval(timerID);
      return;
    }
    callback(array[array.length - i]);
    i--;
  }, interval);
};

type Handler =
  | UnaryHandler
  | ClientStreamingHandler
  | ServerStreamingHandler
  | DuplexStreamingHandler;

type UnaryHandler = (
  call: grpc.ServerUnaryCall<{ [key: string]: string }>,
  cb: grpc.sendUnaryData<{ [key: string]: string }>
) => void;

type ClientStreamingHandler = (
  call: grpc.ServerReadableStream<{ [key: string]: string }>,
  cb: grpc.sendUnaryData<{ [key: string]: string }>
) => void;

type ServerStreamingHandler = (
  call: grpc.ServerWritableStream<{ [key: string]: string }>,
  cb: grpc.sendUnaryData<{ [key: string]: string }>
) => void;

type DuplexStreamingHandler = (
  call: grpc.ServerDuplexStream<
    { [key: string]: string },
    { [key: string]: string }
  >
) => void;

const _unaryHandler = (mockMethodJson: MockMethodJson): UnaryHandler => (
  call: grpc.ServerUnaryCall<{ [key: string]: string }>,
  cb: grpc.sendUnaryData<{ [key: string]: string }>
): void => {
  if (mockMethodJson.error) {
    cb(mockMethodJson.error, null);
  } else {
    cb(null, mockMethodJson.out);
  }
};

const _clientStreamingHandler = (
  mockMethodJson: MockMethodJson
): ClientStreamingHandler => (
  call: grpc.ServerReadableStream<{ [key: string]: string }>,
  cb: grpc.sendUnaryData<{ [key: string]: string }>
): void => {
  // wip
  console.log(mockMethodJson);
  console.log(call);
  console.log(cb);

  call.on('data', function(chunk: any) {
    console.log(chunk);
  });
  call.on('end', () => {
    if (mockMethodJson.error) {
      cb(mockMethodJson.error, null);
    } else {
      cb(null, mockMethodJson.out);
    }
  });
};

const _serverStreamingHandler = (
  mockMethodJson: MockMethodJson
): ServerStreamingHandler => (
  call: grpc.ServerWritableStream<{ [key: string]: string }>,
  cb: grpc.sendUnaryData<{ [key: string]: string }>
): void => {
  // wip
  console.log(mockMethodJson);
  console.log(call);
  console.log(cb);

  call.on('error', (err: Error) => {
    console.log(err);
  });
  if (mockMethodJson.error) {
    cb(mockMethodJson.error, null);
  } else if (Array.isArray(mockMethodJson.out)) {
    intervalEach(
      mockMethodJson.out,
      (value: { [key: string]: string }) => call.write(value),
      () => call.end(),
      mockMethodJson.streamInterval
    );
  } else {
    call.write(mockMethodJson.out);
    call.end();
  }
};

const _duplexStreamingHandler = (
  mockMethodJson: MockMethodJson
): DuplexStreamingHandler => (
  call: grpc.ServerDuplexStream<
    { [key: string]: string },
    { [key: string]: string }
  >
): void => {
  // wip
  console.log(mockMethodJson);
  console.log(call);

  call.on('data', function(chunk: { [key: string]: string }) {
    console.log(chunk);
  });
  call.on('end', () => {
    console.log('clinet stream end');
  });

  if (mockMethodJson.error) {
    call.emit('error', mockMethodJson.error);
  } else if (Array.isArray(mockMethodJson.out)) {
    intervalEach(
      mockMethodJson.out,
      (value: { [key: string]: string }) => call.write(value),
      () => ({}),
      mockMethodJson.streamInterval
    );
  } else {
    call.write(mockMethodJson.out);
  }
};

export const makeHandler = (
  mockMethodJson: MockMethodJson,
  rpcType: RPCType
): Handler => {
  switch (rpcType) {
    case RPCType.UNARY:
      return _unaryHandler(mockMethodJson);
    case RPCType.CLIENT_STREAMING:
      return _clientStreamingHandler(mockMethodJson);
    case RPCType.SERVER_STREAMING:
      return _serverStreamingHandler(mockMethodJson);
    case RPCType.DUPLEX_STREAMING:
      return _duplexStreamingHandler(mockMethodJson);
    default:
      throw new Error('An undefined RPCType was specified.');
  }
};
