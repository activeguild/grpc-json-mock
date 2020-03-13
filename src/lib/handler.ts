import * as grpc from 'grpc';
import { MockMethodJson, RPCType } from './mocky';

const _unaryHandler = (mockMethodJson: MockMethodJson) => (
  call: grpc.ServerUnaryCall<{ [key: string]: string }>,
  cb: grpc.sendUnaryData<{ [key: string]: string }>
): void => {
  cb(null, mockMethodJson.out);
};

const _clientStreamingHandler = (mockMethodJson: MockMethodJson) => (
  call: grpc.ServerReadableStream<{ [key: string]: string }>,
  cb: grpc.sendUnaryData<{ [key: string]: string }>
): void => {
  // wip
  console.log(mockMethodJson);
  console.log(call);
  console.log(cb);

  call.on('data', function(memo, data) {
    console.log(memo);
    console.log(data);
  });
  call.on('end', () => {
    cb(null, mockMethodJson.out);
  });
};

const _serverStreamingHandler = (mockMethodJson: MockMethodJson) => (
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

  if (Array.isArray(mockMethodJson.out)) {
    mockMethodJson.out.forEach(value => {
      call.write(value);
    });
  } else {
    call.write(mockMethodJson.out);
  }

  call.end();
};

const _duplexStreamingHandler = (mockMethodJson: MockMethodJson) => (
  call: grpc.ServerDuplexStream<
    { [key: string]: string },
    { [key: string]: string }
  >
): void => {
  // wip
  console.log(mockMethodJson);
  console.log(call);
};

export const makeHandler = (
  mockMethodJson: MockMethodJson,
  rpcType: RPCType
): any => {
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
      return (): void => {
        // wip
      };
  }
};
