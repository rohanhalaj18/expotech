const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    date: { type: Date, default: Date.now },
    createadAt: { type: Date, default: Date.now }
})
const Message = mongoose.model('Message', messageSchema);
module.exports = Message;
