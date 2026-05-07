const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
  fullName: { type: String, required: true, trim: true },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  username: { type: String, required: true, unique: true, trim: true },
  password: { type: String, required: true, minlength: 8 },
  dob: { type: String, default: "" },
  gender: { type: String, default: "" },
  hobbies: { type: String, default: "" },
  profession: { type: String, default: "" },
  bio: { type: String, default: "" },
  phone: { type: String, default: "" },
  profileImage: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now },
});

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", UserSchema);
