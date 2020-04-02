import mocky from '../dist';
import * as fs from 'fs';

const protos = JSON.parse(fs.readFileSync('./example/service.json', 'utf8'))
  .protos as mocky.MockProtoJson[];

const protoMockServer: mocky.ProtoMockServer = {
  address: '0.0.0.0',
  port: '50051',
  protos,
};

mocky.run(protoMockServer);
