require("dotenv").config();
const {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} = require("@aws-sdk/client-s3");
const multer = require("multer");
const sharp = require("sharp");
const path = require("path");

// Configure AWS SDK
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// Configure Multer to use memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const uploadMiddleware = (req, res, next) => {
  upload.array("images")(req, res, async (err) => {
    // Changed to handle multiple files
    if (err instanceof multer.MulterError) {
      console.error("Multer error:", err);
      return res.status(500).json({
        message: "Multer error occurred when uploading.",
        error: err.message,
      });
    } else if (err) {
      console.error("Unknown error:", err);
      return res.status(500).json({
        message: "An unknown error occurred when uploading.",
        error: err.message,
      });
    }
    next();
  });
};
const uploadMiddlewareSingle = (req, res, next) => {
  upload.single("image")(req, res, async (err) => {
    // Changed to handle multiple files
    if (err instanceof multer.MulterError) {
      console.error("Multer error:", err);
      return res.status(500).json({
        message: "Multer error occurred when uploading.",
        error: err.message,
      });
    } else if (err) {
      console.error("Unknown error:", err);
      return res.status(500).json({
        message: "An unknown error occurred when uploading.",
        error: err.message,
      });
    }
    next();
  });
};

// Function to handle image compression and upload to S3
const compressAndUpload = async (req, res, next) => {
  console.log("files", req.files);
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded." });
    }

    const uploadResults = [];

    for (const file of req.files) {
      let buffer = file.buffer;

      // Compress only if the file is an image
      if (file.mimetype.startsWith("image/")) {
        buffer = await sharp(file.buffer)
          .jpeg({ quality: 50 }) // Adjust the quality as needed
          .toBuffer();
      }

      const fileName = Date.now().toString() + path.extname(file.originalname);

      const uploadParams = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: fileName,
        Body: buffer,
        ContentType: file.mimetype,
        ContentDisposition: "inline",
      };

      const command = new PutObjectCommand(uploadParams);
      const data = await s3Client.send(command);

      uploadResults.push({
        location: `https://${uploadParams.Bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`,
        originalname: file.originalname,
        key: fileName,
      });
    }

    req.files = uploadResults;

    next();
  } catch (error) {
    console.error("Error uploading files:", error);
    res
      .status(500)
      .json({ message: "Error uploading files.", error: error.message });
  }
};

const compressAndUploadSingle = async (req, res, next) => {
  console.log("files", req.file);
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded." });
    }
    const compressedBuffer = await sharp(req.file.buffer)
      .jpeg({ quality: 50 }) // Adjust the quality as needed
      .toBuffer();

    const fileName =
      Date.now().toString() + path.extname(req.file.originalname);

    const uploadParams = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: fileName,
      Body: compressedBuffer,
      ContentType: req.file.mimetype,
      ContentDisposition: "inline",
    };

    const command = new PutObjectCommand(uploadParams);
    const data = await s3Client.send(command);

    // Set req.file properties
    req.file.location = `https://${uploadParams.Bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
    req.file.originalname = req.file.originalname;
    req.file.key = fileName; // Store the S3 key in req.file

    next();
  } catch (error) {
    console.error("Error uploading file:", error);
    res
      .status(500)
      .json({ message: "Error uploading file.", error: error.message });
  }
};
// Middleware to delete an object from S3
const deleteMiddleware = async (req, res, next) => {
  const { key } = req.params; // Retrieve the key from request parameters
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: key, // Specify the key of the object to delete
  };

  try {
    const data = await s3Client.send(new DeleteObjectCommand(params));
    next(); // Call next middleware/route handler if successful
  } catch (error) {
    console.error("Error deleting file:", error);
    res
      .status(500)
      .json({ message: "Error deleting file", error: error.message });
  }
};

module.exports = {
  uploadMiddleware,
  uploadMiddlewareSingle,
  compressAndUpload,
  compressAndUploadSingle,
  deleteMiddleware,
};
