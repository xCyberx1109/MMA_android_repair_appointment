const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema({

  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  serviceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Service",
    required: true
  },

  title: String,

  description: String,

  address: String,


  // ngày customer muốn sửa
  scheduleDate: {
    type: Date,
    required: true
  },

  repairmanId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  status: {
    type: String,
    enum: ["pending", "accepted", "in_progress", "completed"],
    default: "pending"
  }

}, { timestamps: true });

module.exports = mongoose.model("Request", requestSchema);
