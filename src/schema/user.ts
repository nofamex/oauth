import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
  username: { type: String, required: true },
  fullName: { type: String, required: true },
  npm: { type: String, required: true },
  password: { type: String, required: true },
  createdAt: { type: String, default: Date.now() },
});

const User = mongoose.model("User", userSchema);

export default User;
