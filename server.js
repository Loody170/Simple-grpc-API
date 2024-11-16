const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');

// Load Protobuf
const PROTO_PATH = path.join(__dirname, 'proto', 'user.proto');
const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const userProto = grpc.loadPackageDefinition(packageDefinition).UserService;

// Dummy Data
const users = [
  { id: 1, name: 'Ahmed', age: 25 },
  { id: 2, name: 'Amal', age: 28 },
];

// Implement gRPC Methods
const server = new grpc.Server();

server.addService(userProto.service, {
  // Unary RPC
  GetUser: (call, callback) => {
    const user = users.find((u) => u.id === call.request.id);
    if (user) {
      callback(null, user);
    } else {
      callback({
        code: grpc.status.NOT_FOUND,
        message: 'User not found',
      });
    }
  },

  // Server Streaming RPC
  ListUsers: (call) => {
    users.forEach((user) => call.write(user));
    call.end(); // End the stream
  },
});

// Start the Server
const PORT = '50051';
server.bindAsync(`0.0.0.0:${PORT}`, grpc.ServerCredentials.createInsecure(), () => {
  console.log(`Server running on port ${PORT}`);
});
