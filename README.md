# This

- This is a mock of grpc used for javascript development
- Supports the following methods
  - unary
  - serverStreming
  - clientStreming
- Not yet ready
  - duplexStreming

# Install

```shell
npm i -D grpc-mocky
```

# Exp

https://github.com/activeguild/grpc-mocky/tree/master/example

# Interface

### run

| args    | Type | description                                                                                                                               |
| ------- | ------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| address | string  | Set the address of the mock server to be started. default 0.0.0.0                                                                         |
| port    | string  | Set the port of the mock server to be started. default 50051                                                                              |
| protos  | Array   | Set Set proto and mock data to be loaded into mock server. exp https://github.com/activeguild/grpc-mocky/blob/master/example/service.json |
