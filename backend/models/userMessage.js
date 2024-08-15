const mongoose = require("mongoose");

// Define the schema
const messageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    senderName: {
      type: String,
      required: true,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    receiverName: {
      type: String,
      required: true,
    },
    message: {
      text: {
        type: String,
        default: "",
      },
      images: [
        {
          url: {
            type: String,
          },
          s3Key: {
            type: String,
          },
        },
      ],
      videos: [
        {
          url: {
            type: String,
          },
          s3Key: {
            type: String,
          },
        },
      ],
      documents: [
        {
          url: {
            type: String,
          },
          s3Key: {
            type: String,
          },
          fileName: {
            type: String,
          },
        },
      ],
      caption: {
        type: String,
        default: "",
      },
    },
    status: {
      type: String,
      default: "unseen",
    },
  },
  { timestamps: true }
);

// Create the model
const UserMessage = mongoose.model("UserMessage", messageSchema);

// Export the model
module.exports = UserMessage;
