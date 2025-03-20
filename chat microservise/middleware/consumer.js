// const amqp = require('amqplib/callback_api');

// // RabbitMQ connection URL
// const url = 'amqps://sbgjbiei:CqT2eyLqJUqMCIKQbISkrQcd18T1pcd-@crow.rmq.cloudamqp.com/sbgjbiei';

// // Connect to RabbitMQ server
// amqp.connect(url, (err, connection) => {
//   if (err) {
//     throw err;
//   }

//   // Create a channel
//   connection.createChannel((err, channel) => {
//     if (err) {
//       throw err;
//     }

//     const queue = 'main';

//     // Ensure that the queue exists
//     channel.assertQueue(queue, {
//       durable: false
//     });

//     console.log("Started Consuming from queue: main");

//     // Set up the consumer
//     channel.consume(queue, (msg) => {
//       console.log("Received in main:");
//       const content = JSON.parse(msg.content.toString());
//       console.log(content);
//       console.log("Product likes increased!");
//     }, {
//       noAck: true
//     });
//   });
// });
