const express = require("express");
const Message = require("../models/message");

// Async wrapper to handle errors
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// Controller for handling enquiry submission
exports.enquiry = asyncHandler(async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    phoneNumber,
    subject,
    message: messageContent,
  } = req.body;

  // 1. Basic validation
  if (
    !firstName ||
    !lastName ||
    !email ||
    !phoneNumber ||
    !subject ||
    !messageContent
  ) {
    return res.status(400).json({ error: "All fields are required" });
  }

  // 2. Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "Invalid email format" });
  }

  // 3. Phone number validation (basic)
  const phoneRegex = /^[0-9]{10,15}$/;
  if (!phoneRegex.test(phoneNumber)) {
    return res.status(400).json({ error: "Invalid phone number" });
  }

  // 4. Optional: Limit lengths for subject/message
  if (subject.length > 100) {
    return res.status(400).json({ error: "Subject too long" });
  }
  if (messageContent.length > 1000) {
    return res.status(400).json({ error: "Message too long" });
  }

  // 5. Save the message
  const newMessage = new Message({
    firstName,
    lastName,
    email,
    phoneNumber,
    subject,
    message: messageContent,
  });

  await newMessage.save();

  res.status(200).json({ message: "Enquiry submitted successfully" });
});
