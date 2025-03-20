const mongoose = require("mongoose");

let ChatSchema = new mongoose.Schema(
  {
    room: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,  
    
    },
    messages: [
      {
        sender: { type: String }, // Example of a sender field
        content: { type: String }, // The message content
        timestamp: { type: Date, default: Date.now }, // The time the message was sent
      },
    ],
    members: [
      {
        name: { type: String }, // Member name
        role: { type: String, default: "member" }, // Role of the member (e.g., admin, member)
        joinedAt: { type: Date, default: Date.now }, // When the member joined the chat
        mid:{type: String}
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("chat", ChatSchema);
