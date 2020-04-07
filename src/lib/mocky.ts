import * as grpc from 'grpc';
import * as loader from '@grpc/proto-loader';
import { makeHandler } from './handler';
import Path from 'path';

const DEFULAT_SERVER_ADDRESS = '0.0.0.0';
const DEFAULT_SERVER_PORT = '50051';

export interface ProtoMockServer {
  address: string;
  port: string;
  protos: MockProtoJson[];
}

export interface MockProtoJson {
  path: string;
  pkg: string;
  options: loader.Options;
  services: MockServiceJson[];
}
export type MockServiceJson = {
  name: string;
  methods: MockMethodJson[];
};
export type MockMethodJson = {
  name: string;
  out: { [key: string]: string };
  error?: grpc.ServiceError;
  streamInterval?: number;
};

export const enum RPCType {
  UNARY = 'UNARY',
  SERVER_STREAMING = 'SERVER_STREAMING',
  CLIENT_STREAMING = 'CLIENT_STREAMING',
  DUPLEX_STREAMING = 'DUPLEX_STREAMING',
}

const convertRPCType = ({
  requestStream,
  responseStream,
}: grpc.MethodDefinition<object, object>): RPCType => {
  if (requestStream && responseStream) return RPCType.DUPLEX_STREAMING;
  else if (requestStream) return RPCType.CLIENT_STREAMING;
  else if (responseStream) return RPCType.SERVER_STREAMING;

  return RPCType.UNARY;
};

let server: grpc.Server;

export const run = (
  protoMockServer: ProtoMockServer = {
    address: DEFULAT_SERVER_ADDRESS,
    port: DEFAULT_SERVER_PORT,
    protos: [],
  }
): grpc.Server => {
  const { address, port, protos } = protoMockServer;

  if (protos.length === 0) {
    throw new Error('no proto to mock');
  }

  server = new grpc.Server();

  protos.forEach(({ path, pkg, options, services }) => {
    const pkgDefinition = loader.loadSync(Path.resolve(path), options);
    services.forEach((service) => {
      const serviceHandler = service.methods.reduce((prev, curr) => {
        const svcDefinition =
          pkgDefinition[`${pkg}.${service.name}`] as
          grpc.ServiceDefinition<any>;

        const methodDefinition =
          svcDefinition[curr.name] as grpc.MethodDefinition<object, object>;

        return {
          ...prev,
          [curr.name]: makeHandler(curr, convertRPCType(methodDefinition)),
        };
      }, {});

      server.addService(
        (pkgDefinition as any)[`${pkg}.${service.name}`],
        serviceHandler
      );
    });
  });

  server.bind(`${address}:${port}`, grpc.ServerCredentials.createInsecure());
  server.start();

  return server;
};
