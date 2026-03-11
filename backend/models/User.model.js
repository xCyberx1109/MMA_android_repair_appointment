const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({

  name: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true,
    unique: true
  },
  phone: {
    type: Number,
    required: true
  },

  password: {
    type: String,
    required: true
  },

  role: {
    type: String,
    enum: ["customer", "repairman", "admin"],
    default: "customer"
  },
  is_active: {
    type: Boolean,
    required: true,
    default: true
  }

}, { timestamps: true });

module.exports = mongoose.model("User", UserSchema);
