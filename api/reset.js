const express = require("express");
const router = express.Router();
const UserModel = require("../models/UserModel");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const sendGridTransport = require("nodemailer-sendgrid-transport");
const crypto = require("crypto");
const baseUrl = require("../utils/baseUrl");
const isEmail = require("validator/lib/isEmail");
const options = {
  auth: {
    api_key: process.env.sendGrid_api,
  },
};

const transporter = nodemailer.createTransport(sendGridTransport(options));

// Send notification through email to reset password
router.post("/", async (req, res) => {
  try {
    const { email } = req.body;
    // Check if the email is a valid email
    if (!isEmail(email)) {
      return res.status(401).send("Invalid Email!");
    }

    // Find the user account associated to the email
    const user = await UserModel.findOne({ email: email.toLowerCase() });

    // If user doesn't exist return an error
    if (!user) {
      return res.status(404).send("User not found!");
    }

    const token = crypto.randomBytes(32).toString("hex");

    user.resetToken = token;
    user.expireToken = Date.now() + 600000;

    await user.save();

    const href = `${baseUrl}/reset/${token}`;

    // Define mailOptions to be the information needed to send the password reset email
    const mailOptions = {
      to: user.email,
      from: "gioanno000@citymail.cuny.edu",
      subject: "Password reset request for SocialPulse account!",
      html: `<p>Hey ${user.name
        .split(" ")[0]
        .toString()}, There was a request for password reset for your SocialPulse account!. <a href=${href}>Click this link to reset the password </a>   </p>
      <p>This token is valid for only 10 minutes. If this email is not relevant to you please disregard it.</p></br><p>Thank you very much!</p>`,
    };

    // Send the email to the users email address
    transporter.sendMail(mailOptions, (err, info) => err && console.log(err));

    return res.status(200).send("Email sent successfully!");
  } catch (error) {
    console.error(error);
    return res.status(500).send("Server Error!");
  }
});

// With the token obtained while resetting password, update with new password
router.post("/token", async (req, res) => {
  try {
    const { token, password } = req.body;

    // If token is incorrect or not inputted then the user is unauthorized to update the password
    if (!token) {
      return res.status(401).send("Unauthorized!");
    }

    // The password must fit the requirements of a password
    if (password.length < 6)
      return res.status(401).send("Password must be at least 6 characters!");

    // Find the user and check if they exist
    const user = await UserModel.findOne({ resetToken: token });

    if (!user) {
      return res.status(404).send("User not found!");
    }

    // Check if the token has been expired
    if (Date.now() > user.expireToken) {
      return res.status(401).send("Token expired. Generate new one!");
    }

    // Set the new password
    user.password = await bcrypt.hash(password, 10);

    user.resetToken = "";
    user.expireToken = undefined;

    await user.save();

    return res.status(200).send("Password updated!");
  } catch (error) {
    console.error(error);
    return res.status(500).send("Server Error!");
  }
});

module.exports = router;
