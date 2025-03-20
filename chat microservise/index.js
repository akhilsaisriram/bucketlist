
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const userAuthRoutes = require("./routs/userauth"); // Adjust the path as needed
const setupSocket = require("./sockets/socket");
const setupnotifySocket = require("./sockets/notify-socket");
// const amqp = require("amqplib/callback_api");
const chat = require("./models/chat"); // Update the path according to your structure

const http = require("http");

const app = express();

// Environment Variables (use dotenv for better security)
const PORT = process.env.PORT || 8080;
const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://akhilsaisriram9848:test@hill.vmdzs.mongodb.net/?retryWrites=true&w=majority&appName=hill";
// const RABBITMQ_URL = process.env.RABBITMQ_URL || "amqps://sbgjbiei:CqT2eyLqJUqMCIKQbISkrQcd18T1pcd-@crow.rmq.cloudamqp.com/sbgjbiei";

// Middleware
app.use(cors());
app.use(express.json({ limit: "30mb" }));
app.use(bodyParser.json());

// Create HTTP server
const server = http.createServer(app);

// MongoDB Connection
mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT} and connected to MongoDB`);
    });
  })
  .catch((err) => console.error("MongoDB connection error:", err));

// RabbitMQ Consumer Setup
// const setupRabbitMQ = () => {
//   amqp.connect(RABBITMQ_URL, (err, connection) => {
//     if (err) {
//       console.error("RabbitMQ connection error:", err);
//       setTimeout(setupRabbitMQ, 5000); // Retry after 5 seconds
//       return;
//     }

//     connection.createChannel((err, channel) => {
//       if (err) {
//         console.error("RabbitMQ channel error:", err);
//         return;
//       }

//       const queue = "main";
//       channel.assertQueue(queue, { durable: false });

//       console.log("Started consuming from queue:", queue);

//       channel.consume(
//         queue,
//         (msg) => {
//           try {
//             const content = JSON.parse(msg.content.toString());
//             console.log("Received in main:", content);
//             console.log("Product likes increased!");
//           } catch (error) {
//             console.error("Error processing message:", error);
//           }
//         },
//         { noAck: true }
//       );
//     });

//     connection.on("error", (err) => {
//       console.error("RabbitMQ connection error:", err);
//       setupRabbitMQ(); // Reconnect on connection error
//     });

//     connection.on("close", () => {
//       console.warn("RabbitMQ connection closed. Reconnecting...");
//       setupRabbitMQ(); // Reconnect on connection close
//     });
//   });
// };

// // Start RabbitMQ consumer
// setupRabbitMQ();

// WebSocket Setup
// const notifySocketInstance = setupnotifySocket(server);
// setupSocket(server, notifySocketInstance);
setupnotifySocket(server).then((notifySocketInstance) => {
  setupSocket(server, notifySocketInstance);
});
// Sample Routes
app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.post("/allmessages", async (req, res) => {
  try {
    const { room } = req.body;
    if (!room) {
      return res.status(400).json({ error: "Room ID is required" });
    }

    const chatRoom = await chat.findOne({ room });
    if (!chatRoom) {
      return res.status(404).json({ error: "Chat room not found" });
    }
    // console.log(chatRoom);
    
    res.status(200).json(chatRoom.messages); // Sending messages
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
app.use("/api", userAuthRoutes);

