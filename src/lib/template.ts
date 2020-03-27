import fs from 'fs';
import Path from 'path';
import * as loader from '@grpc/proto-loader';
import { MockServiceJson, MockMethodJson } from './mocky';
import fl from 'node-filelist';

export const generateMockTemplate = (path: string): void => {
  const stats = fs.statSync(path);
  const isDirectory = stats.isDirectory();
  let filePaths: string[] = [];

  if (isDirectory) {
    filePaths = fs.readdirSync(path).map(fileName => Path.join(path, fileName));
  } else {
    filePaths.push(path);
  }

  fl.read(filePaths, { ext: 'proto' }, (results: any[]) => {
    const protos = results.map(({ path }) => {
      console.log(path);
      console.log(Path.resolve(path));
      const pkgDefinition = loader.loadSync(path);
      const services = Object.entries(pkgDefinition)
        .filter(([key, value]) => {
          return !(value as Record<string, any>).hasOwnProperty('type');
        })
        .map<MockServiceJson>(([key, values]) => {
          const pkgWithServiceName = key.split('.');
          const name = pkgWithServiceName.pop() || '';

          const methods = Object.entries(values).map<MockMethodJson>(
            ([key]) => {
              return { name: key, out: '' };
            }
          );
          return { name, methods };
        });

      return {
        path: path,
        pkg: '',
        options: {},
        services: services,
      };
    });

    try {
      fs.writeFileSync('service.json', JSON.stringify({ protos }));
    } catch (e) {
      console.log(e);
    }
  });
};
