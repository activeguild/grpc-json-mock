<h1 align="center">Welcome to grpc-mocky 😀</h1>

<p align="left">
  <a href="https://github.com/actions/setup-node"><img alt="GitHub Actions status" src="https://github.com/activeguild/grpc-mocky/workflows/automatic%20release/badge.svg" style="max-width:100%;"></a>
</p>

# Introduction

- This is a mock of grpc used for javascript development
- Can have multiple entry points
- Supports the following methods
  - unary
  - serverStreming
  - clientStreming
  - duplexStreming

# Install

```shell
npm i -D grpc-mocky
```

# Cli

### gen-grpc-tamplate

- Output mock json template

```shell
node ./node_module/.bin/gen-grpc-template {path}
```

| Parameter | Description                                                     |
| --------- | --------------------------------------------------------------- |
| path      | Set the directory where the proto file or proto file is located |

# Interface

### run

| Parameter | Type           | Description                                                                                                                                                                                                                    |
| --------- | -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| address   | string         | Set the address of the mock server to be started. default 0.0.0.0                                                                                                                                                              |
| port      | string         | Set the port of the mock server to be started. default 50051                                                                                                                                                                   |
| protos    | Array\<proto\> | <b>Required.</b> Set proto and mock data to be loaded into mock server. <br> e.g. https://github.com/activeguild/grpc-mocky/blob/master/example/service.json <br> https://github.com/activeguild/grpc-mocky#user-content-proto |

### proto

| Parameter | Type             | Description                                                                     |
| --------- | ---------------- | ------------------------------------------------------------------------------- |
| path      | string           | <b>Required.</b> Set location of proto file.                                    |
| pkg       | string           | <b>Required.</b> Set pkgName from ptoro file.                                   |
| options   | string           | https://github.com/grpc/grpc-node/tree/master/packages/proto-loader             |
| services  | Array\<service\> | <b>Required.</b> https://github.com/activeguild/grpc-mocky#user-content-service |

### service

| Parameter | Type            | Description                                                                    |
| --------- | --------------- | ------------------------------------------------------------------------------ |
| name      | string          | <b>Required.</b> Set service name from ptoro file.                             |
| methods   | Array\<method\> | <b>Required.</b> https://github.com/activeguild/grpc-mocky#user-content-method |

### method

| Parameter      | Type                      | Description                                                                  |
| -------------- | ------------------------- | ---------------------------------------------------------------------------- |
| name           | string                    | <b>Required.</b> Set method name from ptoro file.                            |
| out            | Object \| Array\<object\> | Set response from server.                                                    |
| streamInterval | number                    | Set the sense of server streaming.Unit is msec. default 1000                 |
| error          | Object                    | Set grpc error. <br> https://cloud.google.com/apis/design/errors#error_model |

# e.g.

https://github.com/activeguild/grpc-mocky/tree/master/example

# License

- [MIT](https://github.com/activeguild/grpc-mocky/blob/master/LICENSE)
