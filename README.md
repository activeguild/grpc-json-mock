<h1 align="center">Welcome to grpc-json-mock 😀</h1>

<p align="left">
  <a href="https://github.com/actions/setup-node"><img alt="GitHub Actions status" src="https://github.com/activeguild/grpc-json-mock/workflows/automatic%20release/badge.svg" style="max-width:100%;"></a>
</p>

# Introduction

- A GRPC mock server for front-end development.
- Multiple APIs are supported.
- Supports the following APIs
  - unary
  - serverStreming
  - clientStreming
  - duplexStreming

# Install

```shell
npm i -D grpc-json-mock
```

# Cli

### gen-grpc-tamplate

- By specifying a proto file, you can output a json template for use in mock.

```shell
node ./node_module/.bin/gen-grpc-template {path}
```

| Parameter | Description                                                     |
| --------- | --------------------------------------------------------------- |
| path      | Set the directory where the proto file or proto file is located |

- option

| option | Description         |
| ------ | ------------------- |
| -i     | import another path |

- e.g.

```helloWorld.proto
syntax = "proto3";
package helloworld;

service Greeter {
  rpc unary (UnaryRequest) returns (UnaryResponse) {}
  rpc serverStreaming (UnaryRequest) returns (stream UnaryResponse) {}
  rpc clientStreaming (stream UnaryRequest) returns (UnaryResponse) {}
  rpc duplexStreaming (stream UnaryRequest) returns (stream UnaryResponse) {}
}

message UnaryRequest {
  string name = 1;
}

message UnaryResponse {
  string message = 1;
}
```

generate...

```service.json
{
  "protos": [
    {
      "path": "example/protos/helloWorld.proto",
      "pkg": "helloworld",
      "options": {},
      "services": [
        {
          "name": "Greeter",
          "methods": [
            { "name": "unary", "output": {} },
            { "name": "serverStreaming", "output": {} },
            { "name": "clientStreaming", "output": {} },
            { "name": "duplexStreaming", "output": {} }
          ]
        }
      ]
    }
  ]
}
```

# Interface

### run

| Parameter | Type           | Description                                                                                                                                                                                                                            |
| --------- | -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| address   | string         | Set the address of the mock server to be started. default 0.0.0.0                                                                                                                                                                      |
| port      | string         | Set the port of the mock server to be started. default 50051                                                                                                                                                                           |
| protos    | Array\<proto\> | <b>Required.</b> Set proto and mock data to be loaded into mock server. <br> e.g. https://github.com/activeguild/grpc-json-mock/blob/master/example/service.json <br> https://github.com/activeguild/grpc-json-mock#user-content-proto |

### proto

| Parameter | Type             | Description                                                                         |
| --------- | ---------------- | ----------------------------------------------------------------------------------- |
| path      | string           | <b>Required.</b> Set location of proto file.                                        |
| pkg       | string           | <b>Required.</b> Set pkgName from ptoro file.                                       |
| options   | string           | https://github.com/grpc/grpc-node/tree/master/packages/proto-loader                 |
| services  | Array\<service\> | <b>Required.</b> https://github.com/activeguild/grpc-json-mock#user-content-service |

### service

| Parameter | Type            | Description                                                                        |
| --------- | --------------- | ---------------------------------------------------------------------------------- |
| name      | string          | <b>Required.</b> Set service name from ptoro file.                                 |
| methods   | Array\<method\> | <b>Required.</b> https://github.com/activeguild/grpc-json-mock#user-content-method |

### method

| Parameter      | Type                      | Description                                                                  |
| -------------- | ------------------------- | ---------------------------------------------------------------------------- |
| name           | string                    | <b>Required.</b> Set method name from ptoro file.                            |
| output         | Object \| Array\<object\> | Set response from server.                                                    |
| streamInterval | number                    | Set the sense of server streaming.Unit is msec. default 1000                 |
| error          | Object                    | Set grpc error. <br> https://cloud.google.com/apis/design/errors#error_model |

# e.g.

https://github.com/activeguild/grpc-json-mock/tree/master/example

# License

- [MIT](https://github.com/activeguild/grpc-json-mock/blob/master/LICENSE)
