const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    name: { type: String, required: true },
    semister: { type: String, required: true },
    class: { type: String, required: true },
    email: { type: String, required: true },
    phoneNumber: { type: String, required: true },
});
const Order = mongoose.model('Order', orderSchema);
module.exports = Order;