const formidable = require("formidable");
const validator = require("validator");
const fs = require("fs");
const path = require("path");
const User = require("../models/userRegister");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const secret_key = process.env.SECRET_KEY;
const saltRounds = 10;

const userRegister = async (req, res) => {
  const { username, email, password, confirmPassword } = req.body;
  const { location, key } = req.file; // Assuming you handle file upload separately

  try {
    const errors = [];
    if (!username) {
      errors.push("Please provide your username");
    }
    if (!email) {
      errors.push("Please provide your email");
    }
    if (email && !validator.isEmail(email)) {
      errors.push("Please provide a valid email");
    }
    if (!password) {
      errors.push("Please provide your password");
    }
    if (!confirmPassword) {
      errors.push("Please provide your confirm password");
    }
    if (password && confirmPassword && password !== confirmPassword) {
      errors.push("Your password and confirm password do not match");
    }
    if (password && password.length < 6) {
      errors.push("Password must be at least 6 characters long");
    }
    if (!location) {
      errors.push("Please provide a user image");
    }

    if (errors.length > 0) {
      return res.status(400).json({ errors });
    } else {
      try {
        const existingUsername = await User.findOne({ username });
        if (existingUsername) {
          return res.status(409).json({
            errors: ["Username already exists"],
          });
        }

        // Check if email already exists
        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
          return res.status(409).json({
            errors: ["Email already exists"],
          });
        }

        // Assuming you have already handled file upload and have the new image path
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const newUser = new User({
          username,
          email,
          password: hashedPassword,
          image: location, // Assuming location is the path to the uploaded image
          s3Key: key,
        });

        await newUser.save();
        const token = jwt.sign(
          {
            id: newUser._id,
            username: newUser.username,
            email: newUser.email,
            image: newUser.image,
            registerTime: newUser.createdAt,
          },
          secret_key,
          { expiresIn: "7d" }
        );
        return res
          .status(201)
          .cookie("authToken", token)
          .json({ msg: "User registered successfully", token });
      } catch (dbErr) {
        return res.status(500).json({ errors: "Database error" });
      }
    }
  } catch (error) {
    return res.status(500).json({ errors: "An error occurred" });
  }
};

const userLogin = async (req, res) => {
  console.log(req.body);
  const { email, password } = req.body;

  const errors = [];
  if (!email) {
    errors.push("Please enter your email");
  }
  if (email && !validator.isEmail(email)) {
    errors.push("Please provide a valid email");
  }
  if (!password) {
    errors.push("Please provide your password");
  }
  if (errors.length > 0) {
    return res.status(400).json({ errors });
  } else {
    try {
      const checkUser = await User.findOne({ email: email });
      if (!checkUser) {
        return res.status(404).json({
          errors: ["User not found"],
        });
      }
      const isMatch = await bcrypt.compare(password, checkUser.password);
      if (!isMatch) {
        return res.status(401).json({ errors: ["Incorrect Password"] });
      }
      const token = jwt.sign(
        {
          id: checkUser._id,
          username: checkUser.username,
          email: checkUser.email,
          image: checkUser.image,
          phone: checkUser.phone,
          about: checkUser.about,
          registerTime: checkUser.createdAt,
        },
        secret_key,
        { expiresIn: "7d" }
      );
      return res
        .status(201)
        .cookie("authToken", token, {
          // httpOnly: true,
          sameSite: "strict",
          secure: true,
          expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        })
        .json({ msg: "User registered successfully", token });
    } catch (error) {
      return res.status(500).json({ errors: "Database error" });
    }
  }
};

const forgetPassword = async (req, res) => {
  const { email } = req.body;

  await User.findOne({ email: email }).then((user) => {
    if (!user) {
      return res.status(401).send({ message: "User not existed" });
    }
    const token = jwt.sign({ id: user._id }, secret_key, {
      expiresIn: "1d",
    });
    var transporter = nodemailer.createTransport({
      service: "gmail",
      secure: true,
      port: 465,
      auth: {
        user: "sumit260799@gmail.com",
        pass: "ttah ftqd xmzk cnsl",
      },
    });

    var mailOptions = {
      from: "sumit260799@@gmail.com",
      to: `${email}`,
      subject: "Reset Password",
      text: `http://localhost:5174/reset_password/${user._id}/${token}`,
      html: `<h1>Reset Password Link Below</h1><br/><p>Please use the following link to reset your password:</p><a href="http://localhost:5173/reset-password?id=${user._id}&token=${token}">Reset Password</a>`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        return res.send({
          Status: "Success",
          message: "Password reset link send your email",
        });
      }
    });
  });
};
const resetPassword = (req, res) => {
  const { id, token } = req.params;
  const { password } = req.body;

  jwt.verify(token, secret_key, (err, decoded) => {
    if (err) {
      return res.json({ Status: "Error with token" });
    } else {
      bcrypt
        .hash(password, saltRounds)
        .then((hash) => {
          User.findByIdAndUpdate({ _id: id }, { password: hash })
            .then((u) => res.send({ Status: "Success" }))
            .catch((err) => res.send({ Status: err }));
        })
        .catch((err) => res.send({ Status: err }));
    }
  });
};
const userLogout = async (req, res) => {
  const userId = req.body.id;

  try {
    const findUser = await User.findById(userId);
    if (findUser) {
      // Clear the authToken cookie by setting its expiry date to a past date
      res.cookie("authToken", "", { expires: new Date(0), httpOnly: true });
      res.status(200).json({ message: "User logged out successfully" });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  userRegister,
  userLogin,
  forgetPassword,
  resetPassword,
  userLogout,
};
