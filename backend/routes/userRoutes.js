const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const {
  uploadMiddleware,
  compressAndUpload,
  uploadMiddlewareSingle,
  compressAndUploadSingle,
  deleteMiddleware,
} = require("../aws-config/upload");

const {
  getFriends,
  sendMessage,
  getMessages,
  getLastMessage,
  seenMessage,
  sendImageData,
  updateProfileImage,
  updateProfile,
  deleteFriendMessage,
  getDeleteFriendMessage,
  deleteMessageForEveryone,
} = require("../controllers/userControllers");

// const upload = multer({ storage: storage });

router.get("/", (req, res) => {
  res.json({ message: "hello world" });
});

router.post("/sendMessage", sendMessage);
router.post(
  "/sendImageData",
  uploadMiddleware,
  compressAndUpload,
  sendImageData
);
router.get("/getFriends", getFriends);
router.get("/getMessages", getMessages);
router.get("/getLastMessage", getLastMessage);
router.post("/seen-message", seenMessage);
router.post(
  "/upload-cropped-image",
  uploadMiddlewareSingle,
  compressAndUploadSingle,
  updateProfileImage
);
router.post("/update-profile", updateProfile);
router.post("/delete-fd-message", deleteFriendMessage);
router.get("/getDelete-fd-message", getDeleteFriendMessage);
router.delete("/delete-message-everyone/:id", deleteMessageForEveryone);

module.exports = router;
