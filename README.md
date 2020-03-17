<h1 align="center">Welcom to grpc-mocky 😀</h1>

# Introduction

- This is a mock of grpc used for javascript development
- Supports the following methods
  - unary
  - serverStreming
  - clientStreming
  - duplexStreming

# Install

```shell
npm i -D grpc-mocky
```

# Interface

### run

| Parameter | Type   | Description                                                                                                                                                  |
| --------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| address   | string | Set the address of the mock server to be started. default 0.0.0.0                                                                                            |
| port      | string | Set the port of the mock server to be started. default 50051                                                                                                 |
| protos    | Array  | <b>Required.</b> Set proto and mock data to be loaded into mock server. <br> e.g. https://github.com/activeguild/grpc-mocky/blob/master/example/service.json |

### protos(Array)

| Parameter | Type           | Description |
| --------- | -------------- | ----------- |
| protos    | Array\<proto\> |             |

### proto(Object)

| Parameter | Type             | Description                                                         |
| --------- | ---------------- | ------------------------------------------------------------------- |
| path      | string           | <b>Required.</b> Set location of proto file.                        |
| pkg       | string           | <b>Required.</b> Set pkgName from ptoro file.                       |
| options   | string           | https://github.com/grpc/grpc-node/tree/master/packages/proto-loader |
| services  | Array\<service\> |                                                                     |

### service(Object)

| Parameter | Type            | Description                                        |
| --------- | --------------- | -------------------------------------------------- |
| name      | string          | <b>Required.</b> Set service name from ptoro file. |
| methods   | Array\<method\> | <b>Required.</b>                                   |

### method(Object)

| Parameter      | Type                      | Description                                                  |
| -------------- | ------------------------- | ------------------------------------------------------------ |
| name           | string                    | <b>Required.</b> Set method name from ptoro file.            |
| out            | Object \| Array\<object\> | Set response from server.                                    |
| streamInterval | number                    | Set the sense of server streaming.Unit is msec. default 1000 |

# e.g.

https://github.com/activeguild/grpc-mocky/tree/master/example

# License

- [MIT](https://github.com/activeguild/grpc-mocky/blob/master/LICENSE)
