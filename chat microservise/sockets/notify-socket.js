const socketio = require("socket.io");
const { createAdapter } = require("@socket.io/mongo-adapter");
const { MongoClient } = require("mongodb");
const Queue = require("bull");
const nodemailer = require("nodemailer");

// Create a queue for handling email sending
const emailQueue = new Queue("emailQueue");

// Email transporter configuration
let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "akhilsaisriram9848@gmail.com",
    pass: "ikyy uiow pykv njei", // Replace with your app-specific password for better security
  },
});

// Email sending logic as a separate worker
emailQueue.process(async (job) => {
  const { mailOptions } = job.data;
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Email Error:", error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
});

let allUsers = {}; // Store all connected users and their socket IDs

// MongoDB connection URL and configuration
const mongoUrl =
  "mongodb+srv://akhilsaisriram9848:test@hill.vmdzs.mongodb.net/chatDB?retryWrites=true&w=majority";

const setupnotifySocket = async (server) => {
  // const io = socketio(server);
  const io = socketio(server, {
    cors: {
      origin: "*", // Change this to your frontend domain in production
      methods: ["GET", "POST"],
    },
    path: "/notify-socket",
  }); // Set path to separate notify namespace

  // Connect to MongoDB to set up the adapter
  const mongoClient = new MongoClient(mongoUrl);
  await mongoClient.connect();
  const db = mongoClient.db();
  const mongoCollection = db.collection("socketio_events");

  // Use the MongoDB adapter with the capped collection
  io.adapter(createAdapter(mongoCollection));

  io.on("connection", (socket) => {
    console.log("New client connected notify", socket.id);

    // User joins a room and is associated with their uid and room
    socket.on("joinRoomnotify", ({ room, uid }) => {
      socket.join(room);
      allUsers[socket.id] = { uid, room }; // Store the user's UID and room
      console.log(`User ${uid} joined room: ${room}`);
    });

    // Listen for 'Sendnotification' event to check present and absent users
    socket.on("Sendnotification", async ({ room, uids, message }) => {
      console.log("UIDs to notify:", uids);

      // Get all users in the room
      const usersInRoom = Object.entries(allUsers).filter(
        ([socketId, user]) => user.room === room
      );

      // Extract the online uids and their socket IDs
      const onlineUsers = usersInRoom.map(([socketId, user]) => ({
        socketId,
        uid: user.uid,
      }));

      console.log("Online Users in Room:", onlineUsers);

      // Identify present users and absent users
      const presentUsers = onlineUsers.filter((user) =>
        uids.includes(user.uid)
      );
      const absentUsers = uids.filter(
        (uid) => !presentUsers.some((user) => user.uid === uid)
      );

      console.log("Present Users:", presentUsers);
      console.log("Absent Users:", absentUsers);

      // Send notifications only to the present users by their socket ID
      presentUsers.forEach(({ socketId, uid }) => {
        // Check if the user is the one who sent the notification
        if (
          uid !== onlineUsers.find((user) => user.socketId === socket.id)?.uid
        ) {
          io.to(socketId).emit("notification", { message, uid });
          console.log(`Notification sent to ${uid}`);
        }
      });

      // Send emails to absent users (background job)

    });

    socket.on("newChatNotification", ({ room, name, message }) => {
      console.log("New chat message notification for room:", room);

      // Broadcast notification to users in the room
      io.to(room).emit("notification", {
        message: `New message from ${name}: ${message}`,
        room,
      });
    });
    // Handle user disconnection
    socket.on("disconnect", () => {
      const user = allUsers[socket.id];
      if (user) {
        delete allUsers[socket.id];
      }
      console.log("Client disconnected notify", socket.id);
    });
  });
  return io;  

};

module.exports = setupnotifySocket;
