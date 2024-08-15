const mongoose = require("mongoose");
const User = require("../models/userRegister");
const UserMessage = require("../models/userMessage");
const MessageId = require("../models/deleteMessages");

const jwt = require("jsonwebtoken");
const secret_key = process.env.SECRET_KEY;

const lastMsgGet = async (myId, fdId) => {
  const messages = await UserMessage.find({
    $or: [
      { senderId: myId, receiverId: fdId },
      { senderId: fdId, receiverId: myId },
    ],
  })
    .sort({ createdAt: -1 })
    .limit(1);

  return messages[0]; // Return the single message or undefined if no messages exist
};

const getLastMessage = async (req, res) => {
  const myId = req.query.id;
  let friendMsg = [];
  try {
    // Find all users and exclude the password field
    const friends = await User.find().select("-password");
    for (let i = 0; i < friends.length; i++) {
      const msg = await lastMsgGet(myId, friends[i]._id);
      friendMsg = [
        ...friendMsg,
        { friendId: friends[i]._id, friendName: friends[i].username, msg },
      ];
    }

    res.status(200).json({
      friendMsg,
    });
  } catch (error) {
    console.error("Error fetching friends:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching friends.",
      error: error.message,
    });
  }
};

const getFriends = async (req, res) => {
  try {
    // Find all users and exclude the password field
    const friends = await User.find().select("-password");
    res.status(200).json({
      success: true,
      friends,
    });
  } catch (error) {
    console.error("Error fetching friends:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching friends.",
      error: error.message,
    });
  }
};

const sendMessage = async (req, res) => {
  const { senderId, senderName, receiverId, receiverName, message, status } =
    req.body;

  try {
    const newMessage = await new UserMessage({
      senderId,
      senderName,
      receiverId,
      receiverName,
      message,
      status,
    });
    await newMessage.save();
    return res.status(201).json({ success: true, newMessage });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const sendImageData = async (req, res) => {
  const { senderId, senderName, receiverId, receiverName, caption, status } =
    req.body;

  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded." });
    }

    const images = req.files.map((file) => ({
      url: file.location, // Assuming `location` is the URL of the uploaded file
      s3Key: file.key, // Assuming `key` is the S3 key of the uploaded file
    }));

    const newMessage = new UserMessage({
      senderId,
      senderName,
      receiverId,
      receiverName,
      message: {
        images,
        caption,
      },
      status,
    });

    await newMessage.save();
    return res.status(201).json({ success: true, newMessage });
  } catch (error) {
    console.error("Error saving message:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const getMessages = async (req, res) => {
  const myId = req.query.senderId;
  const fdId = req.query.receiverId;
  try {
    const messages = await UserMessage.find({
      $or: [
        { senderId: myId, receiverId: fdId },
        { senderId: fdId, receiverId: myId },
      ],
    });
    return res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: "internal server error" });
  }
};

const seenMessage = async (req, res) => {
  const messageId = req.body._id; // Corrected variable name to messageId

  try {
    const updateStatus = await UserMessage.findByIdAndUpdate(
      messageId, // Pass the message ID directly to findByIdAndUpdate
      { status: "seen" }, // Update status to "seen"
      { new: true } // To return the updated document
    );

    if (!updateStatus) {
      return res
        .status(404)
        .json({ status: false, message: "Message not found" });
    }

    res.status(200).json({ status: true });
  } catch (error) {
    console.error("Error updating message status:", error);
    res.status(500).json({ status: false, message: "Internal server error" });
  }
};

const updateProfileImage = async (req, res) => {
  const { id } = req.body;
  const { key, location } = req.file;
  try {
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { s3Key: key, image: location },
      { new: true }
    );
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    const token = jwt.sign(
      {
        id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
        image: updatedUser.image,
        registerTime: updatedUser.createdAt,
      },
      secret_key,
      { expiresIn: "7d" }
    );
    return res
      .status(201)
      .cookie("authToken", token, {
        secure: true,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 1 day
      })
      .json({ msg: "User registered successfully", token });
  } catch (error) {
    console.error("Error updating profile image:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateProfile = async (req, res) => {
  const { id, username, phone, email, about } = req.body;
  try {
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { username, phone, email, about },
      { new: true }
    );
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    const token = jwt.sign(
      {
        id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
        image: updatedUser.image,
        phone: updatedUser.phone,
        about: updatedUser.about,
        registerTime: updatedUser.createdAt,
      },
      secret_key,
      { expiresIn: "7d" }
    );
    return res
      .status(201)
      .cookie("authToken", token, {
        secure: true,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .json({ msg: "User registered successfully", token });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Server error" });
  }
};
const deleteFriendMessage = async (req, res) => {
  const { messageId, userId, userName } = req.body;

  try {
    const newMessage = new MessageId({ messageId, userId, userName });
    await newMessage.save();
    console.log(newMessage);
    res.status(201).json({ newMessage });
  } catch (error) {
    res.status(500).json({ error: "Error saving message" });
  }
};
const getDeleteFriendMessage = async (req, res) => {
  try {
    const deletedMessages = await MessageId.find();
    res.status(200).json(deletedMessages);
  } catch (error) {
    res.status(500).json({ error: "Error fetching deleted messages" });
  }
};

const deleteMessageForEveryone = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedMessage = await UserMessage.findByIdAndDelete(id);

    if (!deletedMessage) {
      return res.status(404).json({ message: "Message not found" });
    }

    return res.status(200).json({ message: "Message deleted successfully" });
  } catch (error) {
    console.error("Error deleting message:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getFriends,
  sendMessage,
  sendImageData,
  getMessages,
  getLastMessage,
  seenMessage,
  updateProfileImage,
  updateProfile,
  deleteFriendMessage,
  getDeleteFriendMessage,
  deleteMessageForEveryone,
};
