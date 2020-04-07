import fs from 'fs';
import Path from 'path';
import * as loader from '@grpc/proto-loader';
import { MockServiceJson, MockMethodJson, MockProtoJson } from './mocky';
import fl from 'node-filelist';

const TEMPLATE_NAME = 'service.json';

const _getServiceName = (namespace: string): string => {
  const pkgWithServiceName = namespace.split('.');
  return pkgWithServiceName.pop() || '';
};

const _getPkgName = (namespace: string): string => {
  const pkgWithServiceName = namespace.split('.');
  pkgWithServiceName.pop();
  return pkgWithServiceName.join('.');
};

export default (path: string): void => {
  const pathStat = fs.statSync(path);
  let filePaths: string[] = [];

  if (pathStat.isDirectory()) {
    filePaths = fs
      .readdirSync(path)
      .map((fileName) => Path.join(path, fileName));
  } else {
    filePaths.push(path);
  }

  fl.read(filePaths, { ext: 'proto' }, (results: any[]) => {
    const protos = results.map<MockProtoJson>(({ path }) => {
      const pkgDefinition = loader.loadSync(path);
      console.log(pkgDefinition);
      const serviceObjs = Object.entries(pkgDefinition);
      const pkg = _getPkgName(serviceObjs[0][0]);
      const services = serviceObjs
        .filter(([, value]) => {
          return !(value as Record<string, any>).hasOwnProperty('type');
        })
        .map<MockServiceJson>(([key, values]) => {
          const name = _getServiceName(key);

          const methods = Object.entries(values).map<MockMethodJson>(
            ([key]) => {
              return { name: key, out: {} };
            }
          );
          return { name, methods };
        });

      return {
        path: Path.relative('.', path),
        pkg,
        options: {},
        services,
      };
    });

    try {
      fs.writeFileSync(TEMPLATE_NAME, JSON.stringify({ protos }));
    } catch (e) {
      console.log(e);
    }
  });
};
