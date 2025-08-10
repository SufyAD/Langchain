import mongoose from "mongoose"


const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, enum: ['developer', 'moderator', 'admin'], required: true , default: "developer"},
  skills: [{ type: String }],
  createdAt: {type: Date, default: Date.now},
  isAvailable: { type: Boolean, default: true },
});

export default mongoose.model('User', userSchema);
