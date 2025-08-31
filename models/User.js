import mongoose from "mongoose";
import { hashPassword, comparePassword } from "../utils/hashPassword.js";

const addressSchema = new mongoose.Schema({
  street: { type: String },
  city: { type: String },
  state: { type: String },
  postalCode: { type: String },
  country: { type: String, default: "India" },
});

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    phone: {
      type: String,
      match: [/^[6-9]\d{9}$/, "Please enter a valid Indian phone number"],
    },
    whatsappNumber: {
      type: String,
      match: [/^[6-9]\d{9}$/, "Please enter a valid WhatsApp number"],
    },
    address: [addressSchema],
  },
  { timestamps: true },
);

// 🔐 Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await hashPassword(this.password); // use utils
  next();
});

// ✅ Compare password for login
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await comparePassword(enteredPassword, this.password); // use utils
};

const User = mongoose.model("User", userSchema);
export default User;
