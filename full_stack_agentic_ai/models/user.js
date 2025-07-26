import mongoose from "mongoose"

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, enum: ['developer', 'moderator', 'admin'], required: true , default: "User"},
  skills: [{ type: String }],
  isAvailable: { type: Boolean, default: true },
}, 
{ timestamps: true });

module.exports = mongoose.model('User', userSchema);
