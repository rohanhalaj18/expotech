const express = require("express");
const router = express.Router();
const Message = require("../models/message");

exports.enquiry = async (req, res) => {
  const { firstName, lastName, email, phoneNumber, subject, message } =
    req.body;
  try {
    const newMessage = new Message({
      firstName,
      lastName,
      email,
      phoneNumber,
      subject,
      message,
    });
    await newMessage.save();
    res.status(201).json({
      message: "Message sent successfully,we will contact you soon!",
    });
  } catch (e) {
    console.error("Error saving message:", e.message);
    res.status(500).json({ error: "Server error" });
  }
};
