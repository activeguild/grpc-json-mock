import * as grpc from 'grpc';
import { MockMethodJson, RPCType } from './mocky';

export const DEFAULT_STREAMING_INTERVAL = 1000;

const intervalEach = (
  array: Record<string, string>[],
  callback: (value: Record<string, string>) => void,
  lastCallback: () => void,
  interval: number | undefined = DEFAULT_STREAMING_INTERVAL
): void => {
  let i = array.length;
  const timerID = setInterval(function () {
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
  call: grpc.ServerUnaryCall<Record<string, string>>,
  cb: grpc.sendUnaryData<Record<string, string>>
) => void;

type ClientStreamingHandler = (
  call: grpc.ServerReadableStream<Record<string, string>>,
  cb: grpc.sendUnaryData<Record<string, string>>
) => void;

type ServerStreamingHandler = (
  call: grpc.ServerWritableStream<Record<string, string>>,
  cb: grpc.sendUnaryData<Record<string, string>>
) => void;

type DuplexStreamingHandler = (
  call: grpc.ServerDuplexStream<Record<string, string>, Record<string, string>>
) => void;

const _unaryHandler =
  (mockMethodJson: MockMethodJson): UnaryHandler =>
  (
    call: grpc.ServerUnaryCall<Record<string, string>>,
    cb: grpc.sendUnaryData<Record<string, string>>
  ): void => {
    if (mockMethodJson.error) {
      cb(gRPCErrorObj(mockMethodJson.error), null);
    } else {
      cb(null, mockMethodJson.output);
    }
  };

const _clientStreamingHandler =
  (mockMethodJson: MockMethodJson): ClientStreamingHandler =>
  (
    call: grpc.ServerReadableStream<Record<string, string>>,
    cb: grpc.sendUnaryData<Record<string, string>>
  ): void => {
    call.on('data', function (chunk: any) {
      console.log(chunk);
    });
    call.on('end', () => {
      if (mockMethodJson.error) {
        cb(gRPCErrorObj(mockMethodJson.error), null);
      } else {
        cb(null, mockMethodJson.output);
      }
    });
  };

const _serverStreamingHandler =
  (mockMethodJson: MockMethodJson): ServerStreamingHandler =>
  (
    call: grpc.ServerWritableStream<Record<string, string>>,
    cb: grpc.sendUnaryData<Record<string, string>>
  ): void => {
    call.on('error', (err: Error) => {
      console.log(err);
    });
    if (mockMethodJson.error) {
      cb(gRPCErrorObj(mockMethodJson.error), null);
    } else if (Array.isArray(mockMethodJson.output)) {
      intervalEach(
        mockMethodJson.output,
        (value: Record<string, string>) => call.write(value),
        () => call.end(),
        mockMethodJson.streamInterval
      );
    } else {
      call.write(mockMethodJson.output);
      call.end();
    }
  };

const _duplexStreamingHandler =
  (mockMethodJson: MockMethodJson): DuplexStreamingHandler =>
  (
    call: grpc.ServerDuplexStream<
      Record<string, string>,
      Record<string, string>
    >
  ): void => {
    call.on('data', function (chunk: Record<string, string>) {
      console.log(chunk);
    });
    call.on('end', () => {
      console.log('clinet stream end');
    });

    if (mockMethodJson.error) {
      call.emit('error', gRPCErrorObj(mockMethodJson.error));
    } else if (Array.isArray(mockMethodJson.output)) {
      intervalEach(
        mockMethodJson.output,
        (value: Record<string, string>) => call.write(value),
        () => ({}),
        mockMethodJson.streamInterval
      );
    } else {
      call.write(mockMethodJson.output);
    }
  };

const gRPCErrorObj = (error: NonNullable<MockMethodJson['error']>) => {
  const { code, metadata, details } = error;
  const trailer = new grpc.Metadata();
  if (metadata) {
    for (const [key, value] of Object.entries(metadata)) {
      trailer.set(key, value);
    }
  }

  return { code, metadata: trailer, details, name: '', message: '' };
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
