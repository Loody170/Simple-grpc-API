const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');

// Load Protobuf
const PROTO_PATH = path.join(__dirname, 'proto', 'user.proto');
const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const userProto = grpc.loadPackageDefinition(packageDefinition).UserService;

// Create Client
const client = new userProto('localhost:50051', grpc.credentials.createInsecure());

client.GetUser({ id: 1 }, (err, response) => {
  if (err) {
    console.error('Error:', err.message);
  } else {
    console.log('Unary Response:', response);
  }
});

// const call = client.ListUsers({});
// call.on('data', (user) => {
//   console.log('Streaming User:', user);
// });
// call.on('end', () => {
//   console.log('Stream ended.');
// });
