
// const socketio = require("socket.io");
// const { createAdapter } = require("@socket.io/mongo-adapter");
// const { MongoClient } = require("mongodb");
// const chat = require("../models/chat"); // Update the path according to your structure

// // Maps to track users and rooms
// let userToRoomMap = {};  // Maps socket.id to room
// let roomToUsersMap = {};  // Maps room to list of users

// // MongoDB connection URL and configuration
// const mongoUrl = "mongodb+srv://akhilsaisriram9848:test@hill.vmdzs.mongodb.net/chatDB?retryWrites=true&w=majority";

// const setupSocket = async (server, notifySocketa) => {
//   const io = socketio(server, {
//     cors: {
//       origin: "*", // Change this to your frontend domain in production
//       methods: ["GET", "POST"],
//     },
//     path: "/chat-socket", // Match the WebSocket path
//   });

//   // Connect to MongoDB to set up the adapter
//   const mongoClient = new MongoClient(mongoUrl);
//   await mongoClient.connect();
//   const db = mongoClient.db();
//   const mongoCollection = db.collection("socketio_events");

//   // Use the MongoDB adapter with the capped collection
//   io.adapter(createAdapter(mongoCollection));

//   io.on("connection", (socket) => {
//     console.log("New client connected", socket.id);

//     // Listen for 'joinRoom' event
//     socket.on("joinRoom", ({ room, name, id }) => {
//       console.log(`${name} joining room: ${room}`);
      
//       socket.join(room); // Join the specified chat room

//       // Initialize room data if not already initialized
//       if (!roomToUsersMap[room]) {
//         roomToUsersMap[room] = [];
//       }

//       // Check if the user already exists in the room
//       const userExists = roomToUsersMap[room].some(user => user.id === id);
//       if (!userExists) {  // User does not exist
//         roomToUsersMap[room].push({ id, name, socketid: socket.id });
//         userToRoomMap[socket.id] = room;  // Map socket.id to room
//       }

//       console.log(`${name} joined room: ${room}`);
//       console.log("Online users in room:", roomToUsersMap);
//     });

//     // Listen for 'chatMessage' event
//     socket.on("chatMessage", async ({ room, name, message }) => {
//       const chatMessage = {
//         sender: name,
//         content: message,
//         timestamp: new Date(),
//       };

//       // Save the message to the database
//       await chat.findOneAndUpdate(
//         { room: room },
//         { $push: { messages: chatMessage } },
//         { new: true, upsert: true }
//       );

//       // Emit the message to other users in the room
//       io.to(room).emit("message", chatMessage);
//       console.log(chatMessage);
      
//       // Emit a notification (if applicable)
//       if (notifySocketa && typeof notifySocketa.emit === "function") {
//         notifySocketa.emit("newChatNotification", { room, name, message });
//       } else {
//         console.log("notifySocketa is not properly initialized");
//       }
//     });

//     // Handle user disconnection
//     socket.on("disconnect", () => {
//       console.log("Client disconnected", socket.id);

//       const room = userToRoomMap[socket.id]; // Get the room for this socket

//       if (room) {
//         // Remove the user from the room
//         roomToUsersMap[room] = roomToUsersMap[room].filter(user => user.socketid !== socket.id);

//         // If there are no users left in the room, delete the room entry
//         if (roomToUsersMap[room].length === 0) {
//           delete roomToUsersMap[room];
//         }

//         // Delete the user-to-room mapping
//         delete userToRoomMap[socket.id];

//         // Emit the updated list of users in the room
//         io.to(room).emit("onlineUsers", roomToUsersMap[room]);

//         console.log(`User ${socket.id} disconnected from room: ${room}`);
//       }
//     });
//   });
// };

// module.exports = setupSocket;
const socketio = require("socket.io");
const { createAdapter } = require("@socket.io/mongo-adapter");
const { MongoClient } = require("mongodb");
const chat = require("../models/chat");

// Maps to track users and rooms
let userToRoomMap = {};  // Maps socket.id to room
let roomToUsersMap = {};  // Maps room to list of users
let userLastSeenMap = {}; // Maps userId to last seen timestamp

// MongoDB connection URL and configuration
const mongoUrl = "mongodb+srv://akhilsaisriram9848:test@hill.vmdzs.mongodb.net/chatDB?retryWrites=true&w=majority";

const setupSocket = async (server, notifySocketa) => {
  const io = socketio(server, {
    cors: {
      origin: "*", // Change this to your frontend domain in production
      methods: ["GET", "POST"],
    },
    path: "/chat-socket", // Match the WebSocket path
  });

  // Connect to MongoDB to set up the adapter
  const mongoClient = new MongoClient(mongoUrl);
  await mongoClient.connect();
  const db = mongoClient.db();
  const mongoCollection = db.collection("socketio_events");

  // Use the MongoDB adapter with the capped collection
  io.adapter(createAdapter(mongoCollection));

  io.on("connection", (socket) => {
    console.log("New client connected", socket.id);

    // Listen for 'joinRoom' event
    socket.on("joinRoom", ({ room, name, id }) => {
      console.log(`${name} joining room: ${room}`);
      
      socket.join(room); // Join the specified chat room

      // Initialize room data if not already initialized
      if (!roomToUsersMap[room]) {
        roomToUsersMap[room] = [];
      }

      // Check if the user already exists in the room
      const userExists = roomToUsersMap[room].some(user => user.id === id);
      if (!userExists) {  // User does not exist
        roomToUsersMap[room].push({ id, name, socketid: socket.id });
        userToRoomMap[socket.id] = room;  // Map socket.id to room
      }

      // Update online users in the room
      io.to(room).emit("onlineUsers", roomToUsersMap[room]);

      console.log(`${name} joined room: ${room}`);
      console.log("Online users in room:", roomToUsersMap[room]);
    });

    // Listen for 'chatMessage' event
    socket.on("chatMessage", async ({ room, name, message, timestamp }) => {
      const chatMessage = {
        sender: name,
        content: message,
        timestamp: timestamp || new Date(),
      };

      // Save the message to the database
      await chat.findOneAndUpdate(
        { room: room },
        { $push: { messages: chatMessage } },
        { new: true, upsert: true }
      );

      // Emit the message to other users in the room
      io.to(room).emit("message", chatMessage);
      
      // Emit delivery confirmation to sender
      socket.emit("messageDelivered", timestamp);
      
      // Emit a notification (if applicable)
      if (notifySocketa && typeof notifySocketa.emit === "function") {
        notifySocketa.emit("newChatNotification", { room, name, message });
      }
    });

    // Handle typing indicator
    socket.on("typing", ({ room, name }) => {
      socket.to(room).emit("userTyping", name);
    });

    // Handle message read receipts
    socket.on("messageRead", ({ room, messageTimestamp }) => {
      socket.to(room).emit("messageRead", messageTimestamp);
    });

    // Handle last seen requests
    socket.on("getLastSeen", (userId) => {
      const lastSeen = userLastSeenMap[userId] || new Date();
      socket.emit("lastSeen", { userId, timestamp: lastSeen });
    });

    // Handle user disconnection
    socket.on("disconnect", () => {
      console.log("Client disconnected", socket.id);

      const room = userToRoomMap[socket.id]; // Get the room for this socket
      const userId = getUserIdFromSocket(socket.id);
      
      if (userId) {
        userLastSeenMap[userId] = new Date();
      }

      if (room) {
        // Remove the user from the room
        roomToUsersMap[room] = roomToUsersMap[room].filter(user => user.socketid !== socket.id);

        // If there are no users left in the room, delete the room entry
        if (roomToUsersMap[room].length === 0) {
          delete roomToUsersMap[room];
        }

        // Delete the user-to-room mapping
        delete userToRoomMap[socket.id];

        // Emit the updated list of users in the room
        io.to(room).emit("onlineUsers", roomToUsersMap[room]);

        console.log(`User ${socket.id} disconnected from room: ${room}`);
      }
    });
  });
};

// Helper function to get userId from socket.id
function getUserIdFromSocket(socketId) {
  for (const room in roomToUsersMap) {
    const user = roomToUsersMap[room].find(u => u.socketid === socketId);
    if (user) return user.id;
  }
  return null;
}

module.exports = setupSocket;
