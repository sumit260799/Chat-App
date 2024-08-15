const express = require("express");
const router = express.Router();
const {
  userRegister,
  userLogin,
  forgetPassword,
  resetPassword,
  userLogout,
} = require("../controllers/authControllers");
const {
  uploadMiddleware,
  uploadMiddlewareSingle,
  compressAndUpload,
  compressAndUploadSingle,
  deleteMiddleware,
} = require("../aws-config/upload");

router.post(
  "/user-register",
  uploadMiddlewareSingle,
  compressAndUploadSingle,
  userRegister
);
router.post("/user-login", userLogin);
router.post("/forgot-password", forgetPassword);
router.post("/reset-password/:id/:token", resetPassword);
router.post("/user-logout", userLogout);

module.exports = router;
