const mongoose = require("mongoose");
// Define the schema
const messageSchema = new mongoose.Schema({
  messageId: {
    type: String,
    required: true,
    unique: true,
  },
  userId: {
    type: String,
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
});

// Create the model from the schema
const MessageId = mongoose.model("MessageId", messageSchema);

module.exports = MessageId;
