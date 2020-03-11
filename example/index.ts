import { run, ProtoMockServer, MockProtoJson } from '..';
import * as fs from 'fs';

const protos = JSON.parse(fs.readFileSync('./example/service.json', 'utf8'))
  .protos as MockProtoJson[];

const protoMockServer: ProtoMockServer = {
  address: '0.0.0.0',
  port: '50051',
  protos,
};

run(protoMockServer);
