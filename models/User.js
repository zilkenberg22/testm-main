import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  userName: String,
  email: String,
  password: String,
  address: String,
  phoneNumber: String,
  roles: {
    type: [String],
    enum: ["employee", "admin"],
    default: ["employee"],
  },
});

export default mongoose.models.User || mongoose.model("User", UserSchema);
